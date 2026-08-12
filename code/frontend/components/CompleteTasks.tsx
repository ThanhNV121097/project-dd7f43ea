"use client";

import { useMemo, useState } from "react";
import {
  type CompleteTask,
  getCompleteTasksMock,
  updateCompleteTaskMock,
} from "../lib/mock/complete-tasks";
import styles from "./CompleteTasks.module.css";

type DemoState = "default" | "loading" | "empty" | "error";

type SaveState = "Saved" | "Saving…";

function percent(tasks: CompleteTask[]) {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((task) => task.is_completed).length / tasks.length) * 100);
}

export function CompleteTasks() {
  const initial = getCompleteTasksMock();
  const [tasks, setTasks] = useState(initial.tasks);
  const [demoState, setDemoState] = useState<DemoState>("default");
  const [saveState, setSaveState] = useState<SaveState>("Saved");
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.is_completed).length;

    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed,
      completion_rate: percent(tasks),
    };
  }, [tasks]);

  function reset(state: DemoState) {
    setDemoState(state);
    setError(state === "error" ? "Saved tasks could not load. Try again." : "");
    setSaveState("Saved");
    setTasks(getCompleteTasksMock(state === "empty" ? "empty" : "default").tasks);
  }

  function toggleTask(task: CompleteTask) {
    setError("");
    setSaveState("Saving…");

    const next = !task.is_completed;
    const response = updateCompleteTaskMock(tasks, task.id, next);

    if ("error" in response) {
      setSaveState("Saved");
      setError(response.error.message);
      return;
    }

    setTasks(response.tasks);
    setSaveState("Saved");
  }

  const isLoading = demoState === "loading";
  const isError = demoState === "error";
  const isEmpty = !isLoading && !isError && tasks.length === 0;

  return (
    <section className={styles.shell} aria-labelledby="completeTasksTitle">
      <div className={styles.todoPanel}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Todo List App v5</p>
            <h2 id="completeTasksTitle">Your tasks</h2>
            <p className={styles.subtext}>Toggle saved tasks complete or active without changing list order.</p>
          </div>
          <span className={saveState === "Saving…" ? styles.savingBadge : styles.savedBadge}>{saveState}</span>
        </div>

        {error ? (
          <p className={styles.errorNotice} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.toolbar} aria-label="Task controls">
          <div className={styles.filterGroup} role="group" aria-label="Filter tasks">
            <button className={styles.activeFilter} type="button" aria-pressed="true">All</button>
            <button className={styles.filterButton} type="button" aria-pressed="false">Active</button>
            <button className={styles.filterButton} type="button" aria-pressed="false">Completed</button>
          </div>
          <button className={styles.ghostButton} type="button" onClick={() => reset("default")}>Reset demo</button>
        </div>

        <div className={styles.listRegion} aria-live="polite">
          {isLoading ? <LoadingRows /> : null}
          {isError ? (
            <div className={styles.loadError} role="alert">
              Saved tasks could not load. Use retry to restore task list.
            </div>
          ) : null}
          {isEmpty ? <EmptyState /> : null}
          {!isLoading && !isError && tasks.length > 0 ? (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={task.is_completed ? styles.completedTask : styles.taskItem} key={task.id}>
                  <button
                    aria-label={task.is_completed ? "Mark active" : "Mark complete"}
                    className={task.is_completed ? styles.checkedButton : styles.checkButton}
                    type="button"
                    onClick={() => toggleTask(task)}
                  >
                    {task.is_completed ? "✓" : ""}
                  </button>
                  <div className={styles.taskText}>
                    <span>{task.title}</span>
                    <small>{task.is_completed ? "Completed" : "Active"}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <aside className={styles.sidePanel} aria-labelledby="progressTitle">
        <h2 id="progressTitle">Progress</h2>
        <p className={styles.subtext}>Completion meter updates after saved status changes.</p>
        <div
          className={styles.meter}
          role="progressbar"
          aria-label="Completion meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={summary.completion_rate}
        >
          <span style={{ width: `${summary.completion_rate}%` }} />
        </div>
        <div className={styles.summaryGrid}>
          <div><span>Total</span><b>{summary.total}</b></div>
          <div><span>Active</span><b>{summary.active}</b></div>
          <div><span>Completed</span><b>{summary.completed}</b></div>
        </div>
        <div className={styles.stateButtons}>
          <button type="button" onClick={() => reset("loading")}>Show loading</button>
          <button type="button" onClick={() => reset("empty")}>Show empty</button>
          <button type="button" onClick={() => reset("error")}>Show error</button>
        </div>
      </aside>
    </section>
  );
}

function LoadingRows() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div aria-hidden="true">✓</div>
      <strong>No tasks here.</strong>
      <p>Add one above to start your list.</p>
    </div>
  );
}
