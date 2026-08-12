"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  polishTodoEmptyResponse,
  polishTodoMockError,
  polishTodoMockResponse,
  type PolishTodoTask,
} from "../lib/mock/polish-todo-page";
import styles from "./PolishTodoPage.module.css";

type Filter = "all" | "active" | "completed";
type Mode = "default" | "loading" | "empty" | "error";
type SaveState = "saved" | "saving";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function PolishTodoPage() {
  const [mode, setMode] = useState<Mode>("default");
  const [tasks, setTasks] = useState<PolishTodoTask[]>(polishTodoMockResponse.tasks);
  const [filter, setFilter] = useState<Filter>("all");
  const [title, setTitle] = useState("");
  const [taskError, setTaskError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [toast, setToast] = useState("Saved tasks loaded");
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleTasks = useMemo(() => {
    if (mode === "empty") return polishTodoEmptyResponse.tasks;
    if (filter === "active") return tasks.filter((task) => !task.is_completed);
    if (filter === "completed") return tasks.filter((task) => task.is_completed);
    return tasks;
  }, [filter, mode, tasks]);

  const summary = useMemo(() => {
    const total = mode === "empty" ? 0 : tasks.length;
    const completed = mode === "empty" ? 0 : tasks.filter((task) => task.is_completed).length;
    const active = total - completed;
    return { total, completed, active, percent: total ? Math.round((completed / total) * 100) : 0 };
  }, [mode, tasks]);

  function confirm(message: string) {
    setSaveState("saving");
    window.setTimeout(() => {
      setSaveState("saved");
      setToast(message);
    }, 180);
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      setTaskError("Enter a task title.");
      return;
    }
    const now = new Date().toISOString();
    setTasks((current) => [
      {
        id: crypto.randomUUID(),
        title: nextTitle.slice(0, 80),
        is_completed: false,
        created_at: now,
        updated_at: now,
      },
      ...current,
    ]);
    setMode("default");
    setTitle("");
    setTaskError("");
    confirm("Task added");
  }

  function toggleTask(id: string) {
    const now = new Date().toISOString();
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, is_completed: !task.is_completed, updated_at: now } : task,
      ),
    );
    confirm("Task completed");
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    confirm("Task deleted");
  }

  function setDemoMode(nextMode: Mode) {
    setMode(nextMode);
    setTaskError("");
    setToast(nextMode === "error" ? polishTodoMockError.error.message : "Demo state changed");
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#app">Skip to todo app</a>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Todo List App v5 home">
          <span aria-hidden="true" className={styles.logo}>✓</span>
          <span>Todo List App v5</span>
        </a>
        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mainNavigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <nav id="mainNavigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
          <a href="#app" onClick={() => setMenuOpen(false)}>App</a>
          <a href="#states" onClick={() => setMenuOpen(false)}>States</a>
          <a href="#help" onClick={() => setMenuOpen(false)}>Help</a>
        </nav>
      </header>

      <main id="top" className={styles.main}>
        <section className={styles.hero} aria-labelledby="heroTitle">
          <div>
            <p className={styles.eyebrow}>Shared todo list</p>
            <h1 id="heroTitle">Simple tasks, saved clearly.</h1>
            <p className={styles.lead}>Add, complete, and delete tasks in one polished blue-and-white workspace.</p>
            <a className={styles.primaryLink} href="#app">Open todo list</a>
          </div>
          <aside className={styles.preview} aria-label="Todo preview summary">
            <div className={styles.windowDots} aria-hidden="true"><span /><span /><span /></div>
            <p className={styles.previewTitle}>Today</p>
            <div className={styles.previewStats}>
              <span><strong>{summary.total}</strong> tasks</span>
              <span><strong>{summary.completed}</strong> done</span>
              <span><strong>0</strong> errors</span>
            </div>
          </aside>
        </section>

        <section id="app" className={styles.appGrid} aria-label="Todo app">
          <div className={styles.todoPanel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Your list</p>
                <h2>Your tasks</h2>
              </div>
              <span className={saveState === "saving" ? styles.savingBadge : styles.savedBadge} aria-live="polite">
                {saveState === "saving" ? "Saving" : "Saved"}
              </span>
            </div>

            <form className={styles.form} onSubmit={addTask}>
              <label htmlFor="taskTitle">Task title</label>
              <div className={styles.formRow}>
                <input
                  id="taskTitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  aria-describedby="taskError"
                  aria-invalid={taskError ? "true" : "false"}
                  placeholder="Add a task"
                  maxLength={80}
                />
                <button className={styles.primaryButton} type="submit" disabled={saveState === "saving"}>Add task</button>
              </div>
              <p id="taskError" className={styles.inputError} aria-live="polite">{taskError}</p>
            </form>

            {mode === "error" && <div className={styles.errorNotice} role="alert">{polishTodoMockError.error.message}</div>}

            <div className={styles.toolbar} role="group" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={filter === item.value ? styles.filterActive : styles.filterButton}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={styles.list} aria-live="polite">
              {mode === "loading" ? <SkeletonRows /> : mode === "error" ? <ErrorState onRetry={() => setDemoMode("default")} /> : visibleTasks.length === 0 ? <EmptyState /> : visibleTasks.map((task) => (
                <article key={task.id} className={task.is_completed ? styles.taskDone : styles.taskRow}>
                  <button
                    type="button"
                    className={styles.checkButton}
                    aria-label={task.is_completed ? "Mark active" : "Mark complete"}
                    aria-pressed={task.is_completed}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.is_completed ? "✓" : ""}
                  </button>
                  <div className={styles.taskText}>
                    <strong>{task.title}</strong>
                    <span>{task.is_completed ? "Completed" : "Active"}</span>
                  </div>
                  <button type="button" className={styles.deleteButton} aria-label="Delete task" onClick={() => deleteTask(task.id)}>Delete</button>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.progressPanel} aria-labelledby="progressTitle">
            <h2 id="progressTitle">Progress</h2>
            <p>Completion updates instantly as tasks change.</p>
            <div
              className={styles.meter}
              role="progressbar"
              aria-label="Completion meter"
              aria-valuemin={0}
              aria-valuemax={summary.total}
              aria-valuenow={summary.completed}
              aria-valuetext={`${summary.completed} of ${summary.total} tasks complete, ${summary.percent}%`}
            >
              <span style={{ width: `${summary.percent}%` }} />
            </div>
            <dl className={styles.summaryList}>
              <div><dt>Total</dt><dd>{summary.total}</dd></div>
              <div><dt>Active</dt><dd>{summary.active}</dd></div>
              <div><dt>Completed</dt><dd>{summary.completed}</dd></div>
            </dl>
          </aside>
        </section>

        <section id="states" className={styles.states} aria-labelledby="statesTitle">
          <h2 id="statesTitle">Reachable states</h2>
          <div className={styles.stateGrid}>
            <article className={styles.stateCard}>
              <h3>Loading</h3>
              <p>Saved task fetch can show skeleton rows while shell stays usable.</p>
              <div aria-hidden="true"><SkeletonRows compact /></div>
              <button type="button" className={styles.ghostButton} onClick={() => setDemoMode("loading")}>Show loading</button>
            </article>
            <article className={styles.stateCard}>
              <h3>Empty</h3>
              <p>No saved tasks or no matching filter shows clear next action copy.</p>
              <div className={styles.miniEmpty}>No tasks here. Add one above to start your list.</div>
              <button type="button" className={styles.ghostButton} onClick={() => setDemoMode("empty")}>Show empty</button>
            </article>
            <article className={styles.stateCard}>
              <h3>Error</h3>
              <p>Load failures keep safe recovery controls visible.</p>
              <div className={styles.miniError}>Could not load tasks. Retry keeps saved data safe.</div>
              <button type="button" className={styles.dangerButton} onClick={() => setDemoMode("error")}>Show error</button>
            </article>
          </div>
          <button type="button" className={styles.ghostButton} onClick={() => setDemoMode("default")}>Reset demo</button>
        </section>

        <section id="help" className={styles.help} aria-labelledby="helpTitle">
          <h2 id="helpTitle">Keep today moving</h2>
          <p>Todo List App v5 keeps core task actions fast, clear, and accessible without accounts or setup.</p>
          <a className={styles.primaryLink} href="#app">Back to app</a>
        </section>
      </main>

      <footer className={styles.footer}>Todo List App v5</footer>
      <div className={styles.toast} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}

function SkeletonRows({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? styles.skeletonCompact : styles.skeletonWrap} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div aria-hidden="true" className={styles.emptyIcon}>✓</div>
      <strong>No tasks here. Add one above to start your list.</strong>
      <p>Use Task title and Add task to create your next saved item.</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.loadError} role="alert">
      <strong>Could not load tasks. Retry keeps saved data safe.</strong>
      <button type="button" className={styles.dangerButton} onClick={onRetry}>Retry</button>
    </div>
  );
}
