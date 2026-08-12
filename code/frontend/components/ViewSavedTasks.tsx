"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSavedTasks, type SavedTask, type TasksSummary } from "../lib/mock/view-saved-tasks";

type Mode = "default" | "empty" | "error";
type LoadState = "loading" | "ready" | "error";

const emptySummary: TasksSummary = { total: 0, active: 0, completed: 0, completion_percent: 0 };

export function ViewSavedTasks() {
  const [mode, setMode] = useState<Mode>("default");
  const [state, setState] = useState<LoadState>("loading");
  const [tasks, setTasks] = useState<SavedTask[]>([]);
  const [summary, setSummary] = useState<TasksSummary>(emptySummary);

  useEffect(() => {
    let active = true;
    setState("loading");
    loadSavedTasks(mode)
      .then((response) => {
        if (!active) return;
        setTasks(response.tasks);
        setSummary(response.summary);
        setState("ready");
      })
      .catch(() => {
        if (!active) return;
        setTasks([]);
        setSummary(emptySummary);
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [mode]);

  const meterLabel = useMemo(() => `${summary.completed} of ${summary.total} tasks complete`, [summary]);

  return (
    <section className="mx-auto grid w-[min(1120px,calc(100%-32px))] gap-6 py-[34px] lg:grid-cols-[minmax(0,1fr)_320px]" aria-labelledby="tasksTitle">
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.08)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-[13px] font-black uppercase tracking-[0.18em] text-[#2563EB]">Todo List App v5</p>
            <h1 id="tasksTitle" className="text-[32px] font-black leading-none text-[#111827]">Your tasks</h1>
            <p className="mt-3 max-w-2xl text-base leading-[1.6] text-[#6B7280]">Saved tasks load when page opens. Counts and progress come from loaded data.</p>
          </div>
          <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-[11px] py-2 text-[12px] font-black text-[#047857]">Saved</span>
        </div>

        <div className="mb-5 rounded-[16px] border border-[#E5E7EB] bg-[#F8FAFC] p-4" aria-label="Task controls">
          <p className="text-[13px] font-extrabold text-[#374151]">Add task</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input disabled className="min-h-[50px] flex-1 rounded-[16px] border border-[#CBD5E1] bg-white px-[15px] py-[14px] text-[#6B7280] disabled:opacity-70" value="Add task belongs to Add persistent tasks" readOnly />
            <button disabled className="min-h-[46px] rounded-[16px] bg-[#2563EB] px-[18px] py-[13px] font-extrabold text-white opacity-60">Add</button>
          </div>
        </div>

        {state === "error" ? (
          <div className="mb-5 rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] p-[14px] text-[#B91C1C]" role="alert">
            Could not load tasks. Retry keeps saved data safe.
          </div>
        ) : null}

        <div className="mb-5 flex flex-wrap gap-2" aria-label="State demos">
          {(["default", "empty", "error"] as Mode[]).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => setMode(nextMode)}
              disabled={state === "loading" && mode === nextMode}
              className="rounded-[16px] border border-[#BFDBFE] bg-white px-[18px] py-[13px] font-extrabold capitalize text-[#2563EB] transition duration-[.18s] hover:-translate-y-px hover:bg-[#EFF6FF] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(37,99,235,.22)] disabled:opacity-60"
            >
              {nextMode}
            </button>
          ))}
          {state === "error" ? (
            <button
              type="button"
              onClick={() => setMode("default")}
              className="rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] px-[18px] py-[13px] font-extrabold text-[#B91C1C] transition duration-[.18s] hover:bg-[#FEE2E2] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(37,99,235,.22)]"
            >
              Retry
            </button>
          ) : null}
        </div>

        {state === "loading" ? <LoadingRows /> : null}
        {state === "ready" && tasks.length === 0 ? <EmptyState /> : null}
        {state === "ready" && tasks.length > 0 ? <TaskList tasks={tasks} /> : null}
      </div>

      <aside className="h-fit rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,.08)] lg:sticky lg:top-24" aria-label="Task progress">
        <h2 className="text-[24px] font-black text-[#111827]">Progress</h2>
        <p className="mt-2 text-[#6B7280]">{meterLabel}</p>
        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#F8FAFC]"
          role="progressbar"
          aria-label="Completion meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={summary.completion_percent}
        >
          <div className="h-full rounded-full bg-[#10B981] transition-[width] duration-[.25s]" style={{ width: `${summary.completion_percent}%` }} />
        </div>
        <dl className="mt-5 grid gap-3">
          <Summary label="Total" value={summary.total} />
          <Summary label="Active" value={summary.active} />
          <Summary label="Completed" value={summary.completed} />
        </dl>
      </aside>
    </section>
  );
}

function LoadingRows() {
  return (
    <div className="grid gap-3" aria-label="Loading saved tasks">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-[76px] animate-pulse rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFC]" aria-hidden="true" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-[#6B7280]">
      <p className="text-[20px] font-extrabold text-[#111827]">No tasks here. Add one above to start your list.</p>
    </div>
  );
}

function TaskList({ tasks }: { tasks: SavedTask[] }) {
  return (
    <ul className="grid gap-3" aria-live="polite">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-3 rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFC] p-4">
          <button
            type="button"
            aria-label={task.is_completed ? "Mark active" : "Mark complete"}
            className={`grid h-11 w-11 place-items-center rounded-[10px] border-2 font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(37,99,235,.22)] ${task.is_completed ? "border-[#10B981] bg-[#10B981] text-white" : "border-[#93C5FD] bg-[#EFF6FF] text-[#2563EB]"}`}
          >
            ✓
          </button>
          <div className="min-w-0 flex-1">
            <p className={`break-words text-base font-extrabold text-[#111827] ${task.is_completed ? "line-through decoration-[#10B981]" : ""}`}>{task.title}</p>
            <p className="mt-1 text-[12px] font-bold text-[#6B7280]">{task.is_completed ? "Completed" : "Active"} · saved after change</p>
          </div>
          <button type="button" aria-label="Delete task" className="min-h-[42px] rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-[10px] font-extrabold text-[#B91C1C] hover:bg-[#FEE2E2] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(37,99,235,.22)]">
            Delete task
          </button>
        </li>
      ))}
    </ul>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8FAFC] p-3">
      <dt className="text-[12px] font-black uppercase tracking-[0.18em] text-[#6B7280]">{label}</dt>
      <dd className="mt-1 text-[24px] font-black text-[#111827]">{value}</dd>
    </div>
  );
}
