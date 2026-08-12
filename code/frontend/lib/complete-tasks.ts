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

type ApiListResponse = {
  tasks: CompleteTask[];
  summary: {
    total_count: number;
    active_count: number;
    completed_count: number;
    completion_percent: number;
  };
};

export async function getCompleteTasks(): Promise<CompleteTasksResponse> {
  const response = await fetch("/api/v1/tasks", { cache: "no-store" });
  if (!response.ok) throw new Error("Saved tasks could not load. Try again.");
  return mapList(await response.json());
}

export async function updateCompleteTask(id: string, is_completed: boolean): Promise<CompleteTask> {
  const response = await fetch(`/api/v1/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_completed }),
  });
  if (!response.ok) throw new Error("Status could not be saved. Task returned to last saved state.");
  return response.json();
}

export function summarize(tasks: CompleteTask[]): CompleteTasksSummary {
  const completed = tasks.filter((task) => task.is_completed).length;
  const total = tasks.length;
  return {
    total,
    active: total - completed,
    completed,
    completion_rate: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function mapList(response: ApiListResponse): CompleteTasksResponse {
  return {
    tasks: response.tasks,
    summary: {
      total: response.summary.total_count,
      active: response.summary.active_count,
      completed: response.summary.completed_count,
      completion_rate: response.summary.completion_percent,
    },
  };
}
