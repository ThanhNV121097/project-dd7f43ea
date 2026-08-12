export type CompleteTask = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type CompleteTasksSummary = {
  total: number;
  active: number;
  completed: number;
  completion_rate: number;
};

export type CompleteTasksResponse = {
  tasks: CompleteTask[];
  summary: CompleteTasksSummary;
};

export type CompleteTaskError = {
  error: {
    code: "SAVE_FAILED" | "LOAD_FAILED";
    message: string;
  };
};

const savedTasks: CompleteTask[] = [
  {
    id: "9c6b6b3a-8f67-4d6b-9a11-4a0d1b4b8001",
    title: "Buy milk",
    is_completed: false,
    created_at: "2026-08-12T08:00:00.000Z",
    updated_at: "2026-08-12T08:00:00.000Z",
  },
  {
    id: "9c6b6b3a-8f67-4d6b-9a11-4a0d1b4b8002",
    title: "Buy milk",
    is_completed: true,
    created_at: "2026-08-12T07:30:00.000Z",
    updated_at: "2026-08-12T07:45:00.000Z",
  },
  {
    id: "9c6b6b3a-8f67-4d6b-9a11-4a0d1b4b8003",
    title: "Review project notes",
    is_completed: false,
    created_at: "2026-08-12T07:00:00.000Z",
    updated_at: "2026-08-12T07:00:00.000Z",
  },
];

function summarize(tasks: CompleteTask[]): CompleteTasksSummary {
  const completed = tasks.filter((task) => task.is_completed).length;
  const total = tasks.length;

  return {
    total,
    active: total - completed,
    completed,
    completion_rate: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getCompleteTasksMock(state: "default" | "empty" = "default"): CompleteTasksResponse {
  const tasks = state === "empty" ? [] : savedTasks.map((task) => ({ ...task }));

  return {
    tasks,
    summary: summarize(tasks),
  };
}

export function updateCompleteTaskMock(
  tasks: CompleteTask[],
  id: string,
  is_completed: boolean,
): CompleteTasksResponse | CompleteTaskError {
  if (id === "9c6b6b3a-8f67-4d6b-9a11-4a0d1b4b8003") {
    return {
      error: {
        code: "SAVE_FAILED",
        message: "Status could not be saved. Task returned to last saved state.",
      },
    };
  }

  const updatedTasks = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          is_completed,
          updated_at: "2026-08-12T08:15:00.000Z",
        }
      : task,
  );

  return {
    tasks: updatedTasks,
    summary: summarize(updatedTasks),
  };
}
