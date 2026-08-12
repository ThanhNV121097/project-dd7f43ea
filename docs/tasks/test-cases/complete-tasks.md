# Test Cases — Complete tasks

Module: `tasks`
Function: Complete tasks
Requirement: TASKS-003 — Complete tasks
Risk level: Medium. Completion changes persisted data and visible progress, but no permissions or destructive action exist.
Coverage type: Happy path only, per task scope.

## Automated test cases

**Scenario**: Mark active task complete
**Given**: Visitor opens app with one saved active task titled `Buy milk` loaded from database.
**When**: Visitor activates completion control for `Buy milk`.
**Then**: `Buy milk` is shown as completed, completed count increases by 1, active count decreases by 1, completion meter reflects 1 of 1 completed, and saved-progress feedback indicates change is saved.

Traceability: TASKS-003: Active task can be marked complete; counts, completion meter, task styling, and saved-progress feedback update after successful status change.

**Scenario**: Mark completed task active again
**Given**: Visitor opens app with one saved completed task titled `Buy milk` loaded from database.
**When**: Visitor activates completion control for `Buy milk`.
**Then**: `Buy milk` is shown as active, completed count decreases by 1, active count increases by 1, completion meter reflects 0 of 1 completed, and saved-progress feedback indicates change is saved.

Traceability: TASKS-003: Completed task can be marked active again; counts, completion meter, task styling, and saved-progress feedback update after successful status change.

**Scenario**: Completed status remains after refresh
**Given**: Visitor opens app with one saved active task titled `Buy milk` loaded from database.
**When**: Visitor marks `Buy milk` complete, waits for saved-progress feedback, then refreshes page.
**Then**: `Buy milk` remains visible as completed after refresh, completed count is 1, active count is 0, and completion meter reflects 1 of 1 completed.

Traceability: TASKS-003: Status change persists after refresh.

**Scenario**: Active status remains after refresh
**Given**: Visitor opens app with one saved completed task titled `Buy milk` loaded from database.
**When**: Visitor marks `Buy milk` active, waits for saved-progress feedback, then refreshes page.
**Then**: `Buy milk` remains visible as active after refresh, completed count is 0, active count is 1, and completion meter reflects 0 of 1 completed.

Traceability: TASKS-003: Status change persists after refresh.

## Manual test cases

None. All happy-path completion behavior is observable through UI state and persisted data after refresh.
