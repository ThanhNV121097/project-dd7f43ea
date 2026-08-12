# Test Cases — Add Persistent Tasks

Module: `tasks`
Function: Add persistent tasks
Requirement: TASKS-001
Risk level: Medium. Core write path with database persistence and immediate UI feedback; happy-path coverage only per task scope.

## Automated happy-path scenarios

**Scenario**: Add task with valid title and see it immediately
**Given**: Visitor opens todo page and existing saved list is loaded
**When**: Visitor enters `Buy milk` in task title input and activates `Add task`
**Then**: New task `Buy milk` appears in task list as active, title input is empty, total count increases by 1, active count increases by 1, completion meter reflects new active task, and saved-progress feedback shows saved state.

**Scenario**: Save new task to database and keep it after refresh
**Given**: Visitor opens todo page and existing saved list is loaded
**When**: Visitor enters `Plan weekend` in task title input, activates `Add task`, waits until saved-progress feedback shows saved state, and refreshes page
**Then**: Task `Plan weekend` appears after reload as active, with total count and completion meter including that task.

**Scenario**: Trim title before save on successful add
**Given**: Visitor opens todo page and existing saved list is loaded
**When**: Visitor enters `  Walk dog  ` in task title input and activates `Add task`
**Then**: New task appears as `Walk dog` with no leading or trailing spaces, starts active, and remains as `Walk dog` after refresh.

**Scenario**: Add duplicate titles as separate active tasks
**Given**: Visitor opens todo page with one saved active task titled `Read book`
**When**: Visitor enters `Read book` in task title input and activates `Add task`
**Then**: Task list shows two separate active tasks titled `Read book`, total count increases by 1, and both duplicate tasks remain after refresh.

## Manual scenarios

None. All happy-path scenarios have observable UI and persistence results suitable for automation.
