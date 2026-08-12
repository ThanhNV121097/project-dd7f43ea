export type PolishTodoTask = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type PolishTodoSummary = {
  total: number;
  active: number;
  completed: number;
  completion_percent: number;
};

export type PolishTodoResponse = {
  tasks: PolishTodoTask[];
  summary: PolishTodoSummary;
};

export type PolishTodoError = {
  error: {
    code: "LOAD_FAILED" | "SAVE_FAILED" | "VALIDATION_FAILED";
    message: string;
  };
};

export const polishTodoMockResponse: PolishTodoResponse = {
  tasks: [
    {
      id: "7a019aa4-0cab-4ea3-8990-b2df6fcb9c3a",
      title: "Plan tomorrow morning",
      is_completed: false,
      created_at: "2026-08-12T09:00:00.000Z",
      updated_at: "2026-08-12T09:00:00.000Z",
    },
    {
      id: "30ce610f-e13e-4c27-a28f-28a935624e22",
      title: "Review saved tasks",
      is_completed: true,
      created_at: "2026-08-12T08:30:00.000Z",
      updated_at: "2026-08-12T08:45:00.000Z",
    },
    {
      id: "bb6ccdf6-a3f7-4cce-b8c3-f376447b80d6",
      title: "Clean up completed items",
      is_completed: false,
      created_at: "2026-08-12T08:00:00.000Z",
      updated_at: "2026-08-12T08:00:00.000Z",
    },
  ],
  summary: {
    total: 3,
    active: 2,
    completed: 1,
    completion_percent: 33,
  },
};

export const polishTodoEmptyResponse: PolishTodoResponse = {
  tasks: [],
  summary: {
    total: 0,
    active: 0,
    completed: 0,
    completion_percent: 0,
  },
};

export const polishTodoMockError: PolishTodoError = {
  error: {
    code: "LOAD_FAILED",
    message: "Could not load tasks. Retry keeps saved data safe.",
  },
};
