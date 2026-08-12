# Test Cases — Delete tasks

Module: `tasks`
Function: Delete tasks
Requirement trace: TASKS-004
Risk level: Medium — delete writes persistent data and affects counts, but app has one visitor role and no permissions.
Scope: Happy path only per task request.

## Automated happy-path cases

**Scenario**: Delete a visible task from the list
**Given**: A visitor has one saved active task titled `Buy milk` visible in the task list.
**When**: The visitor activates `Delete task` for `Buy milk`.
**Then**: `Buy milk` is removed from the visible task list without any confirmation dialog.

Traceability: TASKS-004 — Activating `Delete task` removes task after successful delete, with no confirmation dialog in this version.

**Scenario**: Deleted task remains gone after refresh
**Given**: A visitor has a saved task titled `Pay bills` visible in the task list.
**When**: The visitor activates `Delete task` for `Pay bills` and refreshes the page after the delete succeeds.
**Then**: `Pay bills` is not shown in the refreshed task list.

Traceability: TASKS-004 — Deleted task stays removed after refresh.

**Scenario**: Counts and completion meter update after deleting active task
**Given**: A visitor has two saved tasks visible: one active task titled `Wash car` and one completed task titled `Read book`; counts show 2 total tasks and 1 completed task, and completion meter shows 50%.
**When**: The visitor activates `Delete task` for `Wash car`.
**Then**: The task list shows only `Read book`; counts show 1 total task and 1 completed task, and completion meter shows 100%.

Traceability: TASKS-004 — Counts and completion meter update after successful delete.

**Scenario**: Counts and completion meter update after deleting completed task
**Given**: A visitor has two saved tasks visible: one active task titled `Wash car` and one completed task titled `Read book`; counts show 2 total tasks and 1 completed task, and completion meter shows 50%.
**When**: The visitor activates `Delete task` for `Read book`.
**Then**: The task list shows only `Wash car`; counts show 1 total task and 0 completed tasks, and completion meter shows 0%.

Traceability: TASKS-004 — Counts and completion meter update after successful delete.

**Scenario**: Delete one duplicate title by selected task
**Given**: A visitor has two saved active tasks with title `Call Sam`, each with a distinct stable task id and each visible as a separate list item.
**When**: The visitor activates `Delete task` for one selected `Call Sam` item.
**Then**: Exactly one `Call Sam` item is removed, and the other `Call Sam` item remains visible after refresh.

Traceability: TASKS-004 — Deleting one duplicate title removes only selected task id.

## Manual cases

None. All happy-path delete behavior has observable UI and persistence outcomes suitable for automated verification.
