"use client";

import { useMemo, useState } from "react";
import { deleteTasksErrors, deleteTasksMock, type DeleteTask } from "../lib/mock/delete-tasks";
import styles from "./DeleteTasks.module.css";

type ViewState = "default" | "loading" | "empty" | "error";

function getMeta(tasks: DeleteTask[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const active = total - completed;
  return { total, completed, active, completionPercent: total ? Math.round((completed / total) * 100) : 0 };
}

export default function DeleteTasks() {
  const [tasks, setTasks] = useState(deleteTasksMock.data);
  const [viewState, setViewState] = useState<ViewState>("default");
  const [notice, setNotice] = useState("Saved tasks loaded.");
  const [deleteShouldFail, setDeleteShouldFail] = useState(false);
  const visibleTasks = viewState === "empty" ? [] : tasks;
  const meta = useMemo(() => getMeta(visibleTasks), [visibleTasks]);

  function deleteTask(taskId: string) {
    if (deleteShouldFail) {
      setNotice(deleteTasksErrors.delete.error.message);
      return;
    }
    setTasks((current) => current.filter((task) => task.id !== taskId));
    setNotice("Task deleted");
  }

  function resetDemo() {
    setTasks(deleteTasksMock.data);
    setViewState("default");
    setNotice("Saved tasks loaded.");
    setDeleteShouldFail(false);
  }

  return (
    <section className={styles.shell} aria-labelledby="deleteTasksTitle">
      <div className={styles.todoPanel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>Todo List App v5</p>
            <h2 id="deleteTasksTitle">Your tasks</h2>
          </div>
          <span className={notice === deleteTasksErrors.delete.error.message || viewState === "error" ? styles.savingBadge : styles.savedBadge}>
            {notice === "Task deleted" ? "Saved" : "Ready"}
          </span>
        </div>

        <div className={styles.demoControls} aria-label="Delete task UI states">
          <button type="button" onClick={() => setViewState("default")}>Default</button>
          <button type="button" onClick={() => setViewState("loading")}>Loading</button>
          <button type="button" onClick={() => setViewState("empty")}>Empty</button>
          <button type="button" onClick={() => setViewState("error")}>Error</button>
          <button type="button" onClick={() => setDeleteShouldFail((value) => !value)} aria-pressed={deleteShouldFail}>
            {deleteShouldFail ? "Delete fails" : "Delete succeeds"}
          </button>
          <button type="button" onClick={resetDemo}>Reset demo</button>
        </div>

        {notice === deleteTasksErrors.delete.error.message && <p className={styles.errorNotice} role="alert">{notice}</p>}
        {notice === "Task deleted" && <p className={styles.successNotice} role="status">Task deleted. Saved list updated.</p>}

        {viewState === "loading" && (
          <div className={styles.list} aria-label="Loading saved tasks" aria-busy="true">
            {["a", "b", "c"].map((key) => <div className={styles.skeletonRow} key={key} aria-hidden="true" />)}
          </div>
        )}

        {viewState === "error" && <p className={styles.errorNotice} role="alert">{deleteTasksErrors.load.error.message}</p>}

        {viewState !== "loading" && viewState !== "error" && visibleTasks.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">✓</div>
            <strong>No tasks here. Add one above to start your list.</strong>
            <span>Deleted tasks stay gone after refresh.</span>
          </div>
        )}

        {viewState !== "loading" && viewState !== "error" && visibleTasks.length > 0 && (
          <ul className={styles.list} aria-live="polite">
            {visibleTasks.map((task) => (
              <li className={task.isCompleted ? styles.completedTask : styles.task} key={task.id}>
                <span className={styles.check} aria-hidden="true">{task.isCompleted ? "✓" : ""}</span>
                <span className={styles.taskText}>
                  <strong>{task.title}</strong>
                  <small>{task.isCompleted ? "Completed" : "Active"} · id {task.id}</small>
                </span>
                <button className={styles.deleteButton} type="button" aria-label="Delete task" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className={styles.progressPanel} aria-labelledby="progressTitle">
        <h2 id="progressTitle">Progress</h2>
        <p>Counts update after successful delete and stay unchanged after delete failure.</p>
        <div className={styles.meterTrack} role="progressbar" aria-label="Completion meter" aria-valuenow={meta.completionPercent} aria-valuemin={0} aria-valuemax={100}>
          <span className={styles.meterFill} style={{ width: `${meta.completionPercent}%` }} />
        </div>
        <dl className={styles.stats}>
          <div><dt>Total</dt><dd>{meta.total}</dd></div>
          <div><dt>Active</dt><dd>{meta.active}</dd></div>
          <div><dt>Completed</dt><dd>{meta.completed}</dd></div>
          <div><dt>Complete</dt><dd>{meta.completionPercent}%</dd></div>
        </dl>
      </aside>
    </section>
  );
}
