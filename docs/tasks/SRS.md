# SRS — Tasks

Module: `tasks`
Last updated: 2026-08-12
Design: [View Design](http://localhost:8080/design/dd7f43ea-55b8-465f-9e3f-1b7aec8a90d3)
Design system: `design/design-system.md`

## 1. Purpose

The `tasks` module lets any visitor manage one shared todo list without login. It covers adding, viewing, completing, deleting, and polished single-page task interactions with database persistence. If this module fails, "Todo List App v5" cannot perform its core promise: a saved task list that remains after refresh.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Visitor | Any person opening the app; not signed in | Add tasks, view saved tasks, mark tasks complete or active, delete tasks, use page controls and filters |

## 3. Scope

In scope: add, view, complete, delete, and polish tasks. Out of scope: login, private lists, due dates, priorities, notes, search, task editing, offline sync, notifications, reminders, delete confirmation dialogs, and custom drag/drop ordering.

## 4. Functional requirements

### TASKS-001 — Add persistent tasks

Visitor enters a task title, activates `Add task`, and sees a saved active task.

Acceptance criteria:
- Trim leading/trailing whitespace before save.
- Accept trimmed titles from 1 to 80 characters.
- Reject empty titles with `Enter a task title.`
- Reject titles over 80 characters with message naming 80-character limit.
- Accept duplicate titles as separate tasks.
- New tasks start active.
- New task appears after successful creation and remains after refresh.
- Input clears after successful creation.
- Counts, completion meter, and saved-progress feedback update after successful creation.
- If save fails, show error notice and leave existing saved list unchanged.

### TASKS-002 — View saved tasks

Visitor opens app and sees saved tasks from persistent storage.

Acceptance criteria:
- Show loading state while tasks load.
- Show each saved task title, completion status, and available actions.
- Sort saved tasks by `created_at` descending by default, then by stable task id descending when timestamps match. Newest task appears first.
- Preserve same default ordering after refresh.
- Show empty state copy when no tasks exist.
- If loading fails, show retryable error state and preserve page shell.
- Counts and completion meter match loaded tasks.

### TASKS-003 — Complete tasks

Visitor toggles task completion status.

Acceptance criteria:
- Active task can be marked complete.
- Completed task can be marked active again.
- Status change persists after refresh.
- Counts, completion meter, task styling, and saved-progress feedback update after successful status change.
- If status save fails, task returns to last saved state and error notice appears.

### TASKS-004 — Delete tasks

Visitor deletes task directly from list.

Acceptance criteria:
- Activating `Delete task` removes task after successful delete, with no confirmation dialog in this version.
- Deleted task stays removed after refresh.
- Counts and completion meter update after successful delete.
- If delete fails, task remains visible and error notice appears.
- Deleting one duplicate title removes only selected task id.

### TASKS-005 — Polish todo page

Single page looks consistent with approved design and remains usable across common states.

Acceptance criteria:
- Use approved blue/white visual style and design-system tokens.
- Support responsive layout for mobile and desktop widths.
- Provide visible focus states and accessible button names.
- Include loading, empty, error, and saved states.
- Use minimal motion only for lightweight feedback; no required animation for task use.

## 5. Non-functional requirements

- No login; all visitors share one list.
- Persist tasks in database-backed storage.
- Use stable task ids for update and delete operations.
- Do not create external-service dependencies.
- Avoid custom ordering in this version; ordering is system-defined by TASKS-002.

## 6. Traceability

| Plan item | Requirement |
|---|---|
| Add persistent tasks | TASKS-001 |
| View saved tasks | TASKS-002 |
| Complete tasks | TASKS-003 |
| Delete tasks | TASKS-004 |
| Polish todo page | TASKS-005 |
