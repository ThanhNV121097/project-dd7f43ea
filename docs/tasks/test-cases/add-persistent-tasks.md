# Test Cases — Add Persistent Tasks

Module: `tasks`
Function: Add persistent tasks
Requirement: TASKS-001
Risk level: Medium — core write path with database persistence, but no login or authorization rules.
Scope: Happy path only, per task instructions.

## Automated cases

**Scenario**: Add valid task and show it immediately
**Given**: Visitor is on todo page and saved task list is empty.
**When**: Visitor enters `Buy milk` in task title field and activates `Add task`.
**Then**: Task list shows one active task titled `Buy milk` without page refresh.
Traceability: TASKS-001 — New task appears after successful creation; new tasks start active.

**Scenario**: Trim whitespace before saving task title
**Given**: Visitor is on todo page and saved task list is empty.
**When**: Visitor enters `  Walk dog  ` in task title field and activates `Add task`.
**Then**: Task list shows one active task titled `Walk dog`, with no leading or trailing spaces.
Traceability: TASKS-001 — Trim leading/trailing whitespace before save; accept trimmed titles from 1 to 80 characters.

**Scenario**: Accept duplicate task titles as separate active tasks
**Given**: Visitor is on todo page and saved task list already contains one active task titled `Read book`.
**When**: Visitor enters `Read book` in task title field and activates `Add task`.
**Then**: Task list shows two separate active tasks titled `Read book`.
Traceability: TASKS-001 — Accept duplicate titles as separate tasks; new tasks start active.

**Scenario**: Clear input after successful creation
**Given**: Visitor is on todo page and saved task list is empty.
**When**: Visitor enters `Water plants` in task title field and activates `Add task`.
**Then**: Task list shows active task `Water plants`, and task title field value is empty.
Traceability: TASKS-001 — Input clears after successful creation.

**Scenario**: Persist new task after refresh
**Given**: Visitor is on todo page and saved task list is empty.
**When**: Visitor enters `Pay bills` in task title field, activates `Add task`, waits until creation succeeds, and refreshes page.
**Then**: Task list still shows active task `Pay bills` after reload.
Traceability: TASKS-001 — New task remains after refresh; persist tasks in database-backed storage.

**Scenario**: Update counts, completion meter, and saved-progress feedback after add
**Given**: Visitor is on todo page with one completed task `Done item` and one active task `Open item`.
**When**: Visitor enters `New item` in task title field and activates `Add task`.
**Then**: Task list shows active task `New item`; total count is `3`; active count is `2`; completed count is `1`; completion meter shows `1 of 3` complete; saved-progress feedback indicates changes are saved.
Traceability: TASKS-001 — Counts, completion meter, and saved-progress feedback update after successful creation.

## Manual cases

None. All happy-path outcomes are observable through UI state and persisted reload behavior.
