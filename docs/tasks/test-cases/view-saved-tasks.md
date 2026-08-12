# Test Cases — View saved tasks

Function: View saved tasks  
Module: `tasks`  
Requirement: TASKS-002  
Risk level: Low — read-only page load for shared todo list; database ordering and empty state are core user-visible behavior.

## Automated happy-path coverage

**Scenario**: Shows loading state while saved tasks load
**Given**: persistent storage contains at least one saved task and task loading has started but not resolved
**When**: Visitor opens the todo app
**Then**: page shell remains visible and loading state for saved tasks is shown until loaded task data resolves

Traceability: TASKS-002 — Show loading state while tasks load.

**Scenario**: Shows saved active task details and actions
**Given**: persistent storage contains saved task `Buy milk` with completion status `active`
**When**: Visitor opens the todo app and task loading completes
**Then**: task list shows `Buy milk`, active status, `Complete task` action, and `Delete task` action

Traceability: TASKS-002 — Show each saved task title, completion status, and available actions.

**Scenario**: Shows saved completed task details and actions
**Given**: persistent storage contains saved task `Pay bill` with completion status `completed`
**When**: Visitor opens the todo app and task loading completes
**Then**: task list shows `Pay bill`, completed status, `Mark active` action, and `Delete task` action

Traceability: TASKS-002 — Show each saved task title, completion status, and available actions.

**Scenario**: Sorts saved tasks by newest creation time first
**Given**: persistent storage contains task `Older task` with `created_at` `2026-08-12T09:00:00Z` and task `Newer task` with `created_at` `2026-08-12T10:00:00Z`
**When**: Visitor opens the todo app and task loading completes
**Then**: task list shows `Newer task` before `Older task`

Traceability: TASKS-002 — Sort saved tasks by `created_at` descending by default.

**Scenario**: Sorts matching timestamps by stable task id descending
**Given**: persistent storage contains task `Lower id task` with id `100` and `created_at` `2026-08-12T10:00:00Z`, and task `Higher id task` with id `101` and `created_at` `2026-08-12T10:00:00Z`
**When**: Visitor opens the todo app and task loading completes
**Then**: task list shows `Higher id task` before `Lower id task`

Traceability: TASKS-002 — Sort saved tasks by stable task id descending when timestamps match.

**Scenario**: Preserves default order after refresh
**Given**: persistent storage contains task `First newest` newer than task `Second oldest`
**When**: Visitor opens the todo app, task loading completes, then refreshes the page
**Then**: task list after refresh still shows `First newest` before `Second oldest`

Traceability: TASKS-002 — Preserve same default ordering after refresh.

**Scenario**: Shows empty state when no saved tasks exist
**Given**: persistent storage contains no tasks
**When**: Visitor opens the todo app and task loading completes
**Then**: empty state copy is shown and no task rows are shown

Traceability: TASKS-002 — Show empty state copy when no tasks exist.

**Scenario**: Counts and completion meter match loaded mixed-status tasks
**Given**: persistent storage contains three saved tasks: two active tasks and one completed task
**When**: Visitor opens the todo app and task loading completes
**Then**: total count shows `3`, active count shows `2`, completed count shows `1`, and completion meter shows one of three tasks complete

Traceability: TASKS-002 — Counts and completion meter match loaded tasks.

## Manual coverage

None. All happy-path TASKS-002 outcomes above are observable with automated UI and persistence checks.
