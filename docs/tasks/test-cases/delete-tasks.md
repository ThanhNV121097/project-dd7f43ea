# Test Cases — Delete tasks

Module: `tasks`
Function: Delete tasks
Requirement: TASKS-004 — Delete tasks
Risk level: Medium. Delete writes persistent data and changes shared list state, but task has no login, permissions, or confirmation flow.
Coverage: Happy path only per task request.

## Automated happy-path scenarios

**Scenario**: Delete task removes selected task from visible list
**Given**: Visitor has a saved active task titled `Buy milk` visible in task list
**When**: Visitor activates `Delete task` for `Buy milk`
**Then**: `Buy milk` is no longer visible in task list, and no confirmation dialog appears

Traceability: TASKS-004 — Activating `Delete task` removes task after successful delete, with no confirmation dialog in this version.

**Scenario**: Deleted task stays removed after refresh
**Given**: Visitor has saved task titled `Water plants` visible in task list
**When**: Visitor activates `Delete task` for `Water plants` and refreshes page after task disappears
**Then**: `Water plants` is not visible after refresh

Traceability: TASKS-004 — Deleted task stays removed after refresh.

**Scenario**: Counts and completion meter update after deleting active task
**Given**: Visitor has two saved tasks: active task `Pack bag` and completed task `Charge phone`, with count showing 2 total tasks and completion meter showing 1 of 2 complete
**When**: Visitor activates `Delete task` for `Pack bag`
**Then**: Count shows 1 total task and completion meter shows 1 of 1 complete

Traceability: TASKS-004 — Counts and completion meter update after successful delete.

**Scenario**: Counts and completion meter update after deleting completed task
**Given**: Visitor has two saved tasks: active task `Pack bag` and completed task `Charge phone`, with count showing 2 total tasks and completion meter showing 1 of 2 complete
**When**: Visitor activates `Delete task` for `Charge phone`
**Then**: Count shows 1 total task and completion meter shows 0 of 1 complete

Traceability: TASKS-004 — Counts and completion meter update after successful delete.

**Scenario**: Delete one duplicate title removes only selected task
**Given**: Visitor has two saved active tasks with title `Read book`, each represented by a different stable task id and both visible in task list
**When**: Visitor activates `Delete task` for one `Read book` task
**Then**: Exactly one `Read book` task remains visible in task list

Traceability: TASKS-004 — Deleting one duplicate title removes only selected task id.

## Manual scenarios

None. All happy-path delete behavior is observable through UI state and persistence checks.
