export type DeleteTask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type DeleteTasksResponse = {
  data: DeleteTask[];
  meta: {
    total: number;
    active: number;
    completed: number;
    completionPercent: number;
  };
};

export type DeleteTaskError = {
  error: {
    code: "DELETE_TASK_FAILED" | "LOAD_TASKS_FAILED";
    message: string;
  };
};

export const deleteTasksMock: DeleteTasksResponse = {
  data: [
    { id: "task_01j4_delete_buy_milk", title: "Buy milk", isCompleted: false },
    { id: "task_01j4_delete_call_sam_a", title: "Call Sam", isCompleted: false },
    { id: "task_01j4_delete_call_sam_b", title: "Call Sam", isCompleted: false },
    { id: "task_01j4_delete_read_book", title: "Read book", isCompleted: true },
  ],
  meta: {
    total: 4,
    active: 3,
    completed: 1,
    completionPercent: 25,
  },
};

export const deleteTasksErrors = {
  load: {
    error: {
      code: "LOAD_TASKS_FAILED",
      message: "Could not load tasks. Retry keeps saved data safe.",
    },
  },
  delete: {
    error: {
      code: "DELETE_TASK_FAILED",
      message: "Could not delete task. Saved task remains in your list.",
    },
  },
} satisfies Record<string, DeleteTaskError>;
