# Story — Delete tasks

Module: `tasks`
Plan item: Delete tasks
Requirement: TASKS-004

## User story

As a Visitor, I want to delete a task directly from the list, so that the shared todo list only keeps tasks still needed.

## In scope

- Delete action on each visible task row.
- Backend delete by stable task id.
- Remove task from database only after successful delete request.
- Remove deleted task from visible list after successful delete.
- Keep deleted task removed after page refresh.
- Update total, active, completed counts, and completion meter after successful delete.
- Show error notice when delete fails.
- Preserve duplicate titles as separate tasks and delete only selected task id.
- Use existing task list ordering after deletion; no custom reorder.

## Out of scope

- Delete confirmation dialog.
- Undo delete.
- Bulk delete or clear completed.
- Soft delete, archive, trash, or retention controls.
- Task editing, due dates, priorities, notes, search, reminders, notifications, drag/drop ordering.
- Login, private lists, permissions, audit history.
- External services.

## UI scope

This story touches approved single todo page only.

- Task list item: each row shows existing `Delete task` button with accessible label `Delete task`.
- Todo panel: delete failure appears as error notice above toolbar/list, using error notice tokens.
- Progress side panel: counts and completion meter update after successful delete.
- Empty state: if deleting last visible task leaves no visible tasks, show empty state copy `No tasks here. Add one above to start your list.`
- Loading state: no new loading screen. Existing list remains visible while delete request is pending.
- Confirmation: no confirmation dialog in this version.

## Acceptance criteria

1. Given a visible task row, when Visitor activates its `Delete task` action, then app sends delete request for that task's stable id.
2. Given delete request succeeds, then selected task disappears from visible list without a confirmation dialog.
3. Given deleted task disappeared, when Visitor refreshes page, then deleted task does not return.
4. Given delete succeeds, then total, active, completed counts, and completion meter reflect remaining saved tasks.
5. Given two tasks have same title, when Visitor deletes one of them, then only selected task id is removed and other duplicate remains visible after refresh.
6. Given delete request fails, then task remains visible in last saved state and error notice appears.
7. Given delete request fails, then counts and completion meter remain based on last saved task list.
8. Given deleting last task leaves no tasks for current view, then task list is replaced by approved empty state.
9. Given keyboard focus is on `Delete task`, when Visitor activates it with keyboard, then behavior matches pointer activation and focus remains visible before activation.
10. Given delete succeeds, then saved-progress feedback updates using approved badge/notice/toast pattern and communicates saved state with text, not color alone.

## Dependencies

- View saved tasks story provides initial task loading, visible rows, empty/loading/error page states, and default ordering.
- Add persistent tasks story provides saved tasks to delete.
- Complete tasks story may update counts and task status before deletion, but delete works for active and completed tasks.
- Technical design must define delete API contract and task table stable id before backend implementation.
- No external accounts, secrets, or provider setup needed.
