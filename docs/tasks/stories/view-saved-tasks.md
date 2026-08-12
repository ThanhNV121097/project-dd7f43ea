# Story — View saved tasks

Module: `tasks`
Plan item: View saved tasks
Requirement: TASKS-002 — View saved tasks

## User story

As a Visitor, I want the todo screen to load saved tasks when I open the app, so that I can see the shared list exactly as it was persisted.

## In scope

- Load saved tasks from database-backed storage when the page opens.
- Show loading state while initial task fetch is in progress.
- Show saved task title, completion status, and available task actions for each loaded task.
- Sort tasks by `created_at` descending, then stable task id descending when timestamps match.
- Preserve same default ordering after browser refresh.
- Show approved empty state when no saved tasks exist.
- Show retryable loading error state while preserving page shell.
- Update task counts and completion meter from loaded task data.

## Out of scope

- Adding new tasks.
- Completing or reactivating tasks.
- Deleting tasks.
- Editing task titles.
- Search, due dates, priorities, notes, reminders, notifications, offline sync, or custom ordering.
- Login or private per-user lists.
- External services.
- Changing approved visual direction or adding new decorative motion.

## UI scope

Touches approved single todo page only:

- Todo panel: initial loading skeleton rows, loaded task list, empty state, retryable error notice/state.
- Task list item: display title, completion styling, completion toggle button, and `Delete task` action as available controls; this story does not make toggle/delete persistence work beyond showing actions.
- Progress side panel: totals, active/completed counts, and completion meter derived from loaded tasks.
- Notice/badge area: saved or error feedback matching design-system tokens.
- States section remains documentation/demo of reachable loading, empty, and error states; no new page.

Use approved blue/white design tokens from `design/design-system.md`. Keep focus states visible for retry and task action controls. Add implementation-level ARIA where design notes call it out: task list `aria-live="polite"`, filter `aria-pressed` if filters are present, and completion meter `role="progressbar"` with values.

## Acceptance criteria

1. When Visitor opens the app, page shell renders and task list area shows loading state until saved-task request finishes.
2. When saved-task request succeeds with one or more tasks, each task row shows exact saved title, completion status, and visible controls for mark-complete/mark-active and delete.
3. Loaded tasks render in default order: `created_at` descending, with stable task id descending as tie-breaker.
4. Refreshing the browser shows the same loaded tasks in the same default order when database data is unchanged.
5. Completed tasks are visually distinct from active tasks using approved completed-task styling.
6. Counts show total, active, and completed numbers matching loaded data.
7. Completion meter value matches loaded data: `completed / total`, with 0% when total is 0.
8. When saved-task request succeeds with no tasks, task list is hidden and empty state says `No tasks here. Add one above to start your list.`
9. When saved-task request fails, page shell stays visible and error state says `Could not load tasks. Retry keeps saved data safe.`
10. Error state includes retry control; activating retry starts another load and replaces error with loading state until request finishes.
11. Loading, empty, error, active-task, and completed-task states use approved design-system tokens and responsive layout.
12. No login prompt, account chooser, or per-user list selector appears.

## Dependencies

- Architecture scaffold exists for Next.js frontend, Go HTTP API, and PostgreSQL runtime.
- Technical design for this story must define task table fields, saved-task read endpoint, response shape, and default ordering contract before backend implementation.
- No external accounts or secrets required.
