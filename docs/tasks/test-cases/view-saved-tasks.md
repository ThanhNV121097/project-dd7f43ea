# Test Cases — View saved tasks

Module: `tasks`
Function: View saved tasks
Requirement: TASKS-002 — View saved tasks
Risk level: Medium — core persisted list read path; happy-path coverage focuses on loaded, ordered, empty, and refresh-visible states.

## Automated happy-path scenarios

**Scenario**: Loading state appears while saved tasks load
**Given**: Persistent storage contains at least one saved task and task loading has not completed yet
**When**: Visitor opens todo page
**Then**: Page shell remains visible and loading state for saved tasks is shown until load completes

**Scenario**: Saved active and completed tasks display after load
**Given**: Persistent storage contains saved active task `Buy milk` and saved completed task `Water plants`
**When**: Visitor opens todo page and task loading completes
**Then**: Task list shows `Buy milk` as active and `Water plants` as completed, and each task shows available complete/active toggle and `Delete task` action

**Scenario**: Saved tasks appear newest first by creation time
**Given**: Persistent storage contains task `Older task` with earlier `created_at` and task `Newer task` with later `created_at`
**When**: Visitor opens todo page and task loading completes
**Then**: `Newer task` appears before `Older task`

**Scenario**: Saved tasks with same creation time use stable id descending order
**Given**: Persistent storage contains task `Lower id task` and task `Higher id task` with same `created_at`, where `Higher id task` has greater stable task id
**When**: Visitor opens todo page and task loading completes
**Then**: `Higher id task` appears before `Lower id task`

**Scenario**: Default saved-task ordering remains after refresh
**Given**: Persistent storage contains `First newest`, `Second newest`, and `Third newest` with ordering defined by TASKS-002
**When**: Visitor opens todo page, task loading completes, then visitor refreshes page and task loading completes again
**Then**: Task list order after refresh is `First newest`, `Second newest`, then `Third newest`

**Scenario**: Empty state appears when no saved tasks exist
**Given**: Persistent storage contains no tasks
**When**: Visitor opens todo page and task loading completes
**Then**: Empty state copy is shown and task list contains zero tasks

**Scenario**: Counts and completion meter match loaded saved tasks
**Given**: Persistent storage contains 3 saved tasks: 2 completed and 1 active
**When**: Visitor opens todo page and task loading completes
**Then**: Counts show 3 total tasks, 2 completed tasks, 1 active task, and completion meter shows 2 of 3 tasks complete

## Manual happy-path scenarios

None. These happy-path outcomes are observable through automated UI or integration checks.
