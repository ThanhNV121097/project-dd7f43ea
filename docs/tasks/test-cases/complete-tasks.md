# Test Cases — Complete tasks

Module: `tasks`
Function: Complete tasks
Requirement: TASKS-003
Risk level: Medium — completion writes persisted task state and updates visible page state, but no auth or destructive action exists.
Coverage type: Happy path only, per task request.

## Automated happy-path scenarios

**Scenario**: Mark active task complete
**Given**: Visitor has one saved active task titled `Buy milk` visible in task list.
**When**: Visitor activates completion control for `Buy milk`.
**Then**: `Buy milk` is shown as completed, completed count increases by 1, active count decreases by 1, completion meter reflects 1 completed task, and saved-progress feedback indicates change was saved.

Trace: TASKS-003 — Active task can be marked complete; Counts, completion meter, task styling, and saved-progress feedback update after successful status change.

**Scenario**: Mark completed task active again
**Given**: Visitor has one saved completed task titled `Buy milk` visible in task list.
**When**: Visitor activates completion control for `Buy milk`.
**Then**: `Buy milk` is shown as active, active count increases by 1, completed count decreases by 1, completion meter reflects 0 completed tasks, and saved-progress feedback indicates change was saved.

Trace: TASKS-003 — Completed task can be marked active again; Counts, completion meter, task styling, and saved-progress feedback update after successful status change.

**Scenario**: Completed status remains after refresh
**Given**: Visitor has one saved active task titled `Buy milk` visible in task list.
**When**: Visitor marks `Buy milk` complete, waits for saved-progress feedback, and refreshes page.
**Then**: `Buy milk` remains visible as completed after reload, completed count is 1, active count is 0, and completion meter reflects 1 completed task.

Trace: TASKS-003 — Status change persists after refresh.

**Scenario**: Active status remains after refresh
**Given**: Visitor has one saved completed task titled `Buy milk` visible in task list.
**When**: Visitor marks `Buy milk` active, waits for saved-progress feedback, and refreshes page.
**Then**: `Buy milk` remains visible as active after reload, active count is 1, completed count is 0, and completion meter reflects 0 completed tasks.

Trace: TASKS-003 — Status change persists after refresh.

## Manual checks

None. All happy-path requirements are observable through UI state and persisted state after refresh.
