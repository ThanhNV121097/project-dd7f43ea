# Architecture Overview — Todo List App v5

## Scope

Fullstack app: Next.js frontend, Go HTTP API, PostgreSQL database. One shared todo list, no login, no external services.

## Tech stack

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS v3, ESLint.
- Backend: Go 1.22+, `net/http`, `database/sql`, `github.com/jackc/pgx/v5/stdlib` PostgreSQL driver.
- Database: PostgreSQL 16.
- Runtime: `docker compose --profile local up` from repo root for local full stack.
- CI: `.github/workflows/ci.yml` runs backend build/vet/test, frontend lint/build/test, and compose config validation.

## Repository layout

```text
code/
  backend/
    cmd/api/main.go          # HTTP entry point, migration runner, health check
    migrations/              # ordered SQL migrations, .up.sql/.down.sql pairs
    Dockerfile               # fixed service image
    .env.example             # backend env keys
  frontend/
    app/                     # Next.js App Router pages and global CSS
    Dockerfile               # fixed standalone Next.js image
    .env.example             # browser-visible env keys
    package.json             # frontend scripts and pinned deps
docs/
  architecture/overview.md   # this document
  tasks/SRS.md               # merged requirements
```

## Component boundaries and data flow

1. Browser loads `code/frontend/app/page.tsx`.
2. Frontend components call backend through `NEXT_PUBLIC_API_URL`.
3. Backend reads `DATABASE_URL`, applies all pending migrations, verifies database with `SELECT 1`, then serves HTTP.
4. PostgreSQL stores shared tasks. Detailed schema and endpoint contracts belong in later ERD and service design tasks.

Frontend owns presentation, validation messages, loading/empty/error states, accessibility, and optimistic or instant interaction behavior. Backend owns persistence, trust-boundary validation, stable IDs, ordering, and database errors.

## Environment variables

Root `.env.example` keys for compose:

- `POSTGRES_USER` — local database username.
- `POSTGRES_PASSWORD` — local database password.
- `POSTGRES_DB` — local database name.
- `BACKEND_PORT` — optional host port for backend.
- `FRONTEND_PORT` — optional host port for frontend.
- `NEXT_PUBLIC_API_URL` — browser URL for API.

Backend `code/backend/.env.example`:

- `DATABASE_URL` — PostgreSQL connection string injected by runtime.
- `PORT` — HTTP listen port.
- `APP_PORT` — fallback HTTP listen port.

Frontend `code/frontend/.env.example`:

- `NEXT_PUBLIC_API_URL` — public browser API base URL.

No secrets are committed. `.env` files stay local.

## Naming conventions

- Go packages use short lowercase names. Entry point stays `cmd/api`.
- Migrations use UTC timestamp prefix: `YYYYMMDDHHMMSS_name.up.sql` and matching `.down.sql`.
- Database identifiers use `snake_case`.
- JSON fields and TypeScript object fields use `camelCase`.
- React App Router files use default-exported function components: `export default function PageName()`.
- Client components must start with literal first line `"use client"`; server components cannot use browser APIs or event handlers.
- Tailwind classes use design tokens from `app/globals.css` and configured brand colors.

## Security and reliability

- Backend health is 200 only after migrations succeed and database `SELECT 1` works.
- Migration table `schema_migrations` makes boot migration idempotent.
- Future API handlers must validate all input at backend boundary and use parameterized queries.
- No login means all visitors share one list by design.
- No external-service dependencies.

## Failure handling and observability

- Startup fails fast when `DATABASE_URL` is missing or migrations fail.
- `/healthz` returns 503 when database verification fails.
- Server logs startup, migration, and HTTP listen failures to stderr/stdout through standard logger.
- Frontend starts with static shell and later stories add loading, empty, saved, and error states.

## Key decisions

### Fullstack shape

Decision: build frontend, backend, and database from start.

Rejected alternative: static frontend with local storage. Tradeoff: less code and faster scaffold, but violates SRS database persistence after refresh across sessions.

### Go backend with embedded SQL migrations

Decision: use Go backend and embed SQL migrations in binary.

Rejected alternative: external migration CLI. Tradeoff: CLI can be richer, but runtime starts with empty database and only app boot is guaranteed to run before health checks.

### `DATABASE_URL` only

Decision: backend reads one PostgreSQL URL, not separate DB host/user/password keys.

Rejected alternative: assemble DSN from `DB_*` pieces. Tradeoff: pieces are explicit, but deployment and runtime inject `DATABASE_URL`; duplicate config increases mismatch risk.

### Next.js App Router frontend

Decision: use Next.js 15 App Router with TypeScript and Tailwind v3.

Rejected alternative: Vite single-page app. Tradeoff: Vite is smaller, but project convention and fixed container expect Next.js standalone output.

### No feature API yet

Decision: scaffold only health, migration plumbing, and empty UI shell.

Rejected alternative: add tasks endpoints and UI now. Tradeoff: fewer later edits, but this task must not implement product features before ERD/service design.

## How to run

```bash
cp .env.example .env
docker compose --profile local up --build
```

Frontend: `http://localhost:3000`
Backend health: `http://localhost:8080/healthz`

Local checks:

```bash
cd code/backend && go build ./... && go vet ./... && go test ./...
cd code/frontend && npm ci && npm run lint && npm run build && npm test --if-present
docker compose --profile local config -q
```

## Compatibility and rollout notes

- Dockerfiles and container workflows are fixed project infrastructure; scaffold follows their expected paths.
- PostgreSQL starts only with compose `local` profile; deployed backend receives managed `DATABASE_URL`.
- Later ERD task owns task table details. Later service design task owns API routes.
