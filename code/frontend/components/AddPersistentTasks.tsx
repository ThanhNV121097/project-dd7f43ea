"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createTaskMock, listTasksMock, summarizeTasks, TaskDto, TasksSummaryDto } from "../lib/mock/add-persistent-tasks";
import styles from "./AddPersistentTasks.module.css";

type ViewMode = "default" | "loading" | "empty" | "error";

const emptySummary: TasksSummaryDto = { total: 0, active: 0, completed: 0, completionPercent: 0 };

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "error" in error) {
    const value = error as { error?: { message?: string } };
    return value.error?.message ?? "Task was not saved. Try again.";
  }
  return "Task was not saved. Try again.";
}

export default function AddPersistentTasks() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [summary, setSummary] = useState<TasksSummaryDto>(emptySummary);
  const [title, setTitle] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<ViewMode>("loading");
  const [failNextSave, setFailNextSave] = useState(false);

  useEffect(() => {
    let alive = true;
    if (mode === "loading") {
      listTasksMock("default")
        .then((response) => {
          if (!alive) return;
          setTasks(response.data);
          setSummary(response.summary);
          setNotice(null);
          setMode("default");
        })
        .catch((error) => {
          if (!alive) return;
          setTasks([]);
          setSummary(emptySummary);
          setNotice({ kind: "error", message: getErrorMessage(error) });
          setMode("error");
        });
    }
    if (mode === "empty") {
      setTasks([]);
      setSummary(emptySummary);
      setNotice(null);
    }
    if (mode === "error") {
      setTasks([]);
      setSummary(emptySummary);
      setNotice({ kind: "error", message: "Saved tasks could not load." });
    }
    return () => {
      alive = false;
    };
  }, [mode]);

  const currentSummary = useMemo(() => (mode === "default" ? summary : summarizeTasks(tasks)), [mode, summary, tasks]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    setNotice(null);
    if (!trimmed) {
      setFieldError("Enter a task title.");
      setNotice({ kind: "error", message: "Enter a task title." });
      return;
    }
    if (trimmed.length > 80) {
      const message = "Task title must be 80 characters or fewer.";
      setFieldError(message);
      setNotice({ kind: "error", message });
      return;
    }
    setFieldError("");
    setSaving(true);
    const previousTasks = tasks;
    try {
      const response = await createTaskMock({ title: trimmed }, failNextSave);
      const nextTasks = [response.data, ...tasks];
      setTasks(nextTasks);
      setSummary(response.summary);
      setTitle("");
      setFailNextSave(false);
      setMode("default");
      setNotice({ kind: "success", message: "Task added and saved." });
    } catch (error) {
      setTasks(previousTasks);
      setSummary(summarizeTasks(previousTasks));
      setNotice({ kind: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="tasksTitle">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Todo List App v5</p>
          <h1 id="tasksTitle" className={styles.title}>Your tasks</h1>
          <p className={styles.sub}>Add task, save it, then see active list update without refresh.</p>
        </div>
        <span className={`${styles.badge} ${saving ? styles.badgeSaving : styles.badgeSaved}`}>{saving ? "Saving…" : "Saved"}</span>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.label} htmlFor="taskTitle">Task title</label>
        <div className={styles.formRow}>
          <input
            id="taskTitle"
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby="taskError"
            aria-invalid={fieldError ? "true" : "false"}
            disabled={saving}
            maxLength={120}
            placeholder="Buy milk"
          />
          <button className={styles.primary} type="submit" disabled={saving}>{saving ? "Saving…" : "Add task"}</button>
        </div>
        <p id="taskError" className={styles.helper} aria-live="polite">{fieldError}</p>
      </form>

      {notice ? <div className={notice.kind === "success" ? styles.successNotice : styles.errorNotice} role={notice.kind === "error" ? "alert" : "status"}>{notice.message}</div> : null}

      <div className={styles.summary} aria-label="Task counts">
        <span>Total <strong>{currentSummary.total}</strong></span>
        <span>Active <strong>{currentSummary.active}</strong></span>
        <span>Completed <strong>{currentSummary.completed}</strong></span>
      </div>
      <div className={styles.meter} aria-label={`${currentSummary.completionPercent}% complete`}><span style={{ width: `${currentSummary.completionPercent}%` }} /></div>

      <div className={styles.controls} aria-label="State demos">
        <button type="button" className={styles.ghost} onClick={() => setMode("loading")}>Loading</button>
        <button type="button" className={styles.ghost} onClick={() => setMode("empty")}>Empty</button>
        <button type="button" className={styles.danger} onClick={() => setMode("error")}>Error</button>
        <button type="button" className={styles.ghost} onClick={() => setFailNextSave(true)}>Fail next save</button>
      </div>

      <div className={styles.list} aria-live="polite">
        {mode === "loading" ? <><div className={styles.skeleton} /><div className={styles.skeleton} /></> : null}
        {mode === "empty" ? <div className={styles.empty}>No saved tasks yet. Add first task above.</div> : null}
        {mode === "error" ? <div className={styles.loadError}>Saved tasks could not load. Try loading again.</div> : null}
        {mode === "default" && tasks.map((task) => <article className={styles.task} key={task.id}><span className={task.isCompleted ? styles.checkDone : styles.check} aria-hidden="true" /> <span>{task.title}</span></article>)}
      </div>
    </section>
  );
}
