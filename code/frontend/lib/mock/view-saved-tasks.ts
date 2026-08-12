export type SavedTask = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TasksSummary = {
  total: number;
  active: number;
  completed: number;
  completion_percent: number;
};

export type TasksResponse = {
  tasks: SavedTask[];
  summary: TasksSummary;
};

export type TasksError = {
  error: {
    code: "LOAD_FAILED";
    message: string;
  };
};

const tasks: SavedTask[] = [
  {
    id: "f3b72d6c-9e67-4ff5-a81d-f36ddaa2a202",
    title: "Review saved task order",
    is_completed: false,
    created_at: "2026-08-12T10:30:00.000Z",
    updated_at: "2026-08-12T10:30:00.000Z",
  },
  {
    id: "d1c0f171-24aa-4d63-98d9-c73b2bf08775",
    title: "Water plants",
    is_completed: true,
    created_at: "2026-08-12T10:30:00.000Z",
    updated_at: "2026-08-12T10:45:00.000Z",
  },
  {
    id: "8a190f13-f682-4ff6-83b1-0ec22e4dc227",
    title: "Buy milk",
    is_completed: false,
    created_at: "2026-08-11T18:15:00.000Z",
    updated_at: "2026-08-11T18:15:00.000Z",
  },
];

function summarize(savedTasks: SavedTask[]): TasksSummary {
  const completed = savedTasks.filter((task) => task.is_completed).length;
  const total = savedTasks.length;

  return {
    total,
    active: total - completed,
    completed,
    completion_percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function orderTasks(savedTasks: SavedTask[]): SavedTask[] {
  return [...savedTasks].sort((left, right) => {
    const time = Date.parse(right.created_at) - Date.parse(left.created_at);
    return time || right.id.localeCompare(left.id);
  });
}

export async function loadSavedTasks(mode: "default" | "empty" | "error" = "default"): Promise<TasksResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (mode === "error") {
    throw {
      error: {
        code: "LOAD_FAILED",
        message: "Could not load tasks. Retry keeps saved data safe.",
      },
    } satisfies TasksError;
  }

  const ordered = mode === "empty" ? [] : orderTasks(tasks);
  return {
    tasks: ordered,
    summary: summarize(ordered),
  };
}
