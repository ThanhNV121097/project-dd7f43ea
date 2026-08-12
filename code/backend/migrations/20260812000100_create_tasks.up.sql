CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_tasks_title_length CHECK (length(title) BETWEEN 1 AND 80)
);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at_id ON tasks (created_at DESC, id DESC);
