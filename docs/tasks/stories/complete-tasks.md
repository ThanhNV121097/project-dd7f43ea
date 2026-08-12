# Story — Complete tasks

Module: `tasks`
Plan item: Complete tasks
Requirement: TASKS-003 — Complete tasks

## User story

As a Visitor, I want to mark a task complete or active again, so that the shared todo list reflects current task progress and keeps it after refresh.

## In scope

- Toggle one existing task from active to complete.
- Toggle one existing task from complete back to active.
- Persist the changed completion status in database-backed storage.
- Keep visible task order stable under the system-defined ordering from TASKS-002.
- Update counts, completion meter, task styling, and saved-progress feedback after successful save.
- Revert the task to its last saved state and show an error notice if status save fails.

## Out of scope

- Adding tasks.
- Viewing initial saved task list beyond dependency on loaded tasks.
- Deleting tasks.
- Editing task titles.
- Login, private lists, permissions, ownership, due dates, priorities, notes, reminders, notifications, search, offline sync, drag/drop ordering.
- Bulk complete, bulk reopen, clear completed, undo, or confirmation dialogs.
- Custom sorting or moving completed tasks to another position.

## UI scope

Touches approved single Todo page only:

- Task list item check button toggles completion status.
- Active task row uses active task styling from design system.
- Completed task row uses completed task styling from design system, including muted title treatment and completed checkbox.
- Check button accessible label changes between `Mark complete` and `Mark active`.
- Progress side panel updates total active/completed counts and completion meter after successful toggle.
- Saved badge/saved-progress feedback reflects saving and saved states for status change.
- Error notice appears in todo panel if save fails.
- Task list remains inside `aria-live="polite"` region.

No new screen, modal, external navigation, or extra state demo is added by this story.

## Acceptance criteria

1. Given a saved active task is visible, when Visitor activates its completion toggle, then task becomes completed after successful save.
2. Given a saved completed task is visible, when Visitor activates its completion toggle, then task becomes active after successful save.
3. Given a task status was changed successfully, when Visitor refreshes the page, then changed completion status remains.
4. Given a status change succeeds, then active count, completed count, completion meter, task styling, and saved-progress feedback update to match saved data.
5. Given a status change is being saved, then UI communicates saving through existing saved-progress feedback without blocking page shell.
6. Given status save fails, then affected task returns to last saved status, error notice appears, and counts and meter match last saved state.
7. Given status save fails, then no other task statuses change.
8. Given two tasks have same title, when Visitor toggles one task, then only selected stable task id changes status.
9. Given task list is ordered by TASKS-002, when status changes, then list order does not change unless loaded data order changes from persistence rules already defined there.
10. Given keyboard focus is on a task completion toggle, when Visitor uses keyboard activation, then same status toggle behavior occurs and visible focus remains available.
11. Given a task is active, then completion toggle accessible name is `Mark complete`.
12. Given a task is completed, then completion toggle accessible name is `Mark active`.

## Dependencies

- `View saved tasks` must provide loaded saved tasks, stable task ids, default ordering, loading/error shell, counts, and completion meter basis.
- Backend task persistence must support stable task ids and updating completion status by id.
- No external accounts or third-party services required.

## Non-goals and product decisions

- Toggling completion does not delete, hide, or reorder a task by itself.
- Reopen completed task is required in this version.
- Failed save uses last saved state as source of truth, not unsaved optimistic state.
