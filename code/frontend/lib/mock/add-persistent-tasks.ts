export type TaskDto = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TasksSummaryDto = {
  total: number;
  active: number;
  completed: number;
  completionPercent: number;
};

export type TasksListResponse = {
  data: TaskDto[];
  summary: TasksSummaryDto;
};

export type CreateTaskRequest = {
  title: string;
};

export type CreateTaskResponse = {
  data: TaskDto;
  summary: TasksSummaryDto;
};

export type ApiErrorResponse = {
  error: {
    code: "VALIDATION_FAILED" | "CREATE_FAILED" | "LOAD_FAILED";
    message: string;
    details?: Array<{ field: "title"; code: string; message: string }>;
  };
};

const initialTasks: TaskDto[] = [
  {
    id: "task_001",
    title: "Plan weekend",
    isCompleted: false,
    createdAt: "2026-08-12T09:00:00.000Z",
    updatedAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "task_002",
    title: "Read book",
    isCompleted: true,
    createdAt: "2026-08-12T08:30:00.000Z",
    updatedAt: "2026-08-12T08:45:00.000Z",
  },
];

let tasks = [...initialTasks];
let nextId = 3;

export function summarizeTasks(items: TaskDto[]): TasksSummaryDto {
  const total = items.length;
  const completed = items.filter((task) => task.isCompleted).length;
  const active = total - completed;
  return { total, active, completed, completionPercent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export async function listTasksMock(mode: "default" | "empty" | "error" = "default"): Promise<TasksListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (mode === "error") {
    throw { error: { code: "LOAD_FAILED", message: "Saved tasks could not load." } } satisfies ApiErrorResponse;
  }
  const data = mode === "empty" ? [] : tasks;
  return { data, summary: summarizeTasks(data) };
}

export async function createTaskMock(request: CreateTaskRequest, fail = false): Promise<CreateTaskResponse> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const title = request.title.trim();
  if (!title) {
    throw { error: { code: "VALIDATION_FAILED", message: "Enter a task title.", details: [{ field: "title", code: "REQUIRED", message: "Enter a task title." }] } } satisfies ApiErrorResponse;
  }
  if (title.length > 80) {
    throw { error: { code: "VALIDATION_FAILED", message: "Task title must be 80 characters or fewer.", details: [{ field: "title", code: "MAX_LENGTH", message: "Task title must be 80 characters or fewer." }] } } satisfies ApiErrorResponse;
  }
  if (fail) {
    throw { error: { code: "CREATE_FAILED", message: "Task was not saved. Try again." } } satisfies ApiErrorResponse;
  }
  const now = new Date().toISOString();
  const task: TaskDto = { id: `task_${String(nextId++).padStart(3, "0")}`, title, isCompleted: false, createdAt: now, updatedAt: now };
  tasks = [task, ...tasks];
  return { data: task, summary: summarizeTasks(tasks) };
}
