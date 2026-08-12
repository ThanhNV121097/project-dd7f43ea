package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const maxBody = 8 << 10

type task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	IsCompleted bool      `json:"is_completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type detail struct {
	Field   string `json:"field"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

type apiError struct {
	Error struct {
		Code      string   `json:"code"`
		Message   string   `json:"message"`
		Details   []detail `json:"details"`
		RequestID string   `json:"request_id"`
	} `json:"error"`
}

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := migrate(ctx, db, "migrations"); err != nil {
		log.Fatalf("migrate database: %v", err)
	}
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("ping database: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		var one int
		if err := db.QueryRowContext(ctx, "SELECT 1").Scan(&one); err != nil || one != 1 {
			http.Error(w, "unhealthy", http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok\n"))
	})
	h := &handler{db: db}
	mux.HandleFunc("GET /api/v1/tasks", h.listTasks)
	mux.HandleFunc("POST /api/v1/tasks", h.createTask)
	mux.HandleFunc("GET /api/v1/tasks/{id}", h.getTask)
	mux.HandleFunc("PATCH /api/v1/tasks/{id}", h.patchTask)
	mux.HandleFunc("DELETE /api/v1/tasks/{id}", h.deleteTask)

	port := firstNonEmpty(os.Getenv("PORT"), os.Getenv("APP_PORT"), "8080")
	server := &http.Server{Addr: ":" + port, Handler: requestID(mux), ReadHeaderTimeout: 5 * time.Second}
	log.Printf("listening on :%s", port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("serve: %v", err)
	}
}

type handler struct{ db *sql.DB }

func (h *handler) listTasks(w http.ResponseWriter, r *http.Request) {
	if len(r.URL.Query()) != 0 {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Unsupported query parameter.", nil)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	rows, err := h.db.QueryContext(ctx, `SELECT id, title, is_completed, created_at, updated_at FROM tasks ORDER BY created_at DESC, id DESC`)
	if err != nil {
		writeDBErr(w, r, err)
		return
	}
	defer rows.Close()
	var tasks []task
	for rows.Next() {
		var t task
		if err := rows.Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt); err != nil {
			writeDBErr(w, r, err)
			return
		}
		tasks = append(tasks, t)
	}
	if err := rows.Err(); err != nil {
		writeDBErr(w, r, err)
		return
	}
	completed := 0
	for _, t := range tasks {
		if t.IsCompleted {
			completed++
		}
	}
	percent := 0
	if len(tasks) > 0 {
		percent = (completed*100 + len(tasks)/2) / len(tasks)
	}
	writeJSON(w, http.StatusOK, map[string]any{"tasks": tasks, "summary": map[string]int{"total_count": len(tasks), "active_count": len(tasks) - completed, "completed_count": completed, "completion_percent": percent}})
}

func (h *handler) createTask(w http.ResponseWriter, r *http.Request) {
	if !jsonContent(r) || len(r.URL.Query()) != 0 {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid request.", nil)
		return
	}
	var req struct{ Title *string `json:"title"` }
	if !decodeJSON(w, r, &req) {
		return
	}
	title := ""
	if req.Title != nil {
		title = strings.TrimSpace(*req.Title)
	}
	if title == "" {
		writeErr(w, r, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Task title is required.", []detail{{Field: "title", Code: "REQUIRED", Message: "Enter a task title."}})
		return
	}
	if len([]rune(title)) > 80 {
		writeErr(w, r, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Task title is too long.", []detail{{Field: "title", Code: "TOO_LONG", Message: "Task title must be 80 characters or fewer."}})
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	var t task
	err := h.db.QueryRowContext(ctx, `INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, is_completed, created_at, updated_at`, title).Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		writeDBErr(w, r, err)
		return
	}
	w.Header().Set("Location", "/api/v1/tasks/"+t.ID)
	writeJSON(w, http.StatusCreated, t)
}

func (h *handler) getTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if !validUUID(id) || len(r.URL.Query()) != 0 {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid task id.", nil)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	var t task
	err := h.db.QueryRowContext(ctx, `SELECT id, title, is_completed, created_at, updated_at FROM tasks WHERE id=$1`, id).Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, r, http.StatusNotFound, "NOT_FOUND", "Task not found.", nil)
		return
	}
	if err != nil {
		writeDBErr(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (h *handler) patchTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if !validUUID(id) || !jsonContent(r) || len(r.URL.Query()) != 0 {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid request.", nil)
		return
	}
	var req struct{ IsCompleted *bool `json:"is_completed"` }
	if !decodeJSON(w, r, &req) {
		return
	}
	if req.IsCompleted == nil {
		writeErr(w, r, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Completion status is required.", []detail{{Field: "is_completed", Code: "REQUIRED", Message: "Choose active or completed."}})
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	var t task
	err := h.db.QueryRowContext(ctx, `UPDATE tasks SET is_completed=$1, updated_at=CASE WHEN is_completed IS DISTINCT FROM $1 THEN now() ELSE updated_at END WHERE id=$2 RETURNING id, title, is_completed, created_at, updated_at`, *req.IsCompleted, id).Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, r, http.StatusNotFound, "NOT_FOUND", "Task not found.", nil)
		return
	}
	if err != nil {
		writeDBErr(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (h *handler) deleteTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if !validUUID(id) || len(r.URL.Query()) != 0 {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid task id.", nil)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	res, err := h.db.ExecContext(ctx, `DELETE FROM tasks WHERE id=$1`, id)
	if err != nil {
		writeDBErr(w, r, err)
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		writeErr(w, r, http.StatusNotFound, "NOT_FOUND", "Task not found.", nil)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, maxBody)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON body.", nil)
		return false
	}
	if dec.Decode(&struct{}{}) != io.EOF {
		writeErr(w, r, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON body.", nil)
		return false
	}
	return true
}

func jsonContent(r *http.Request) bool {
	ct := r.Header.Get("Content-Type")
	return strings.HasPrefix(strings.ToLower(ct), "application/json")
}

func validUUID(s string) bool {
	if len(s) != 36 {
		return false
	}
	for i, c := range s {
		switch i {
		case 8, 13, 18, 23:
			if c != '-' {
				return false
			}
		default:
			if !(c >= '0' && c <= '9' || c >= 'a' && c <= 'f' || c >= 'A' && c <= 'F') {
				return false
			}
		}
	}
	return true
}

func writeDBErr(w http.ResponseWriter, r *http.Request, err error) {
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		writeErr(w, r, http.StatusServiceUnavailable, "UNAVAILABLE", "Service unavailable.", nil)
		return
	}
	log.Printf("request_id=%s db_error=%v", requestIDValue(r), err)
	writeErr(w, r, http.StatusInternalServerError, "INTERNAL", "Unexpected error.", nil)
}

func writeErr(w http.ResponseWriter, r *http.Request, status int, code, message string, details []detail) {
	var e apiError
	e.Error.Code = code
	e.Error.Message = message
	e.Error.Details = details
	e.Error.RequestID = requestIDValue(r)
	writeJSON(w, status, e)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

type requestIDKey struct{}

func requestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-Id")
		if id == "" {
			id = fmt.Sprintf("%d", time.Now().UnixNano())
		}
		w.Header().Set("X-Request-Id", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), requestIDKey{}, id)))
	})
}

func requestIDValue(r *http.Request) string {
	id, _ := r.Context().Value(requestIDKey{}).(string)
	return id
}

func migrate(ctx context.Context, db *sql.DB, dir string) error {
	_, err := db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version text PRIMARY KEY,
			applied_at timestamptz NOT NULL DEFAULT now()
		)
	`)
	if err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read migrations: %w", err)
	}

	var names []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".up.sql") {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)

	for _, name := range names {
		version := strings.TrimSuffix(name, ".up.sql")
		var exists bool
		if err := db.QueryRowContext(ctx, "SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)", version).Scan(&exists); err != nil {
			return fmt.Errorf("check migration %s: %w", name, err)
		}
		if exists {
			continue
		}

		sqlBytes, err := os.ReadFile(filepath.Join(dir, name))
		if err != nil {
			return fmt.Errorf("read migration %s: %w", name, err)
		}

		tx, err := db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("begin migration %s: %w", name, err)
		}
		if _, err := tx.ExecContext(ctx, string(sqlBytes)); err != nil {
			_ = tx.Rollback()
			return fmt.Errorf("apply migration %s: %w", name, err)
		}
		if _, err := tx.ExecContext(ctx, "INSERT INTO schema_migrations (version) VALUES ($1)", version); err != nil {
			_ = tx.Rollback()
			return fmt.Errorf("record migration %s: %w", name, err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit migration %s: %w", name, err)
		}
		log.Printf("applied migration %s", name)
	}
	return nil
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
