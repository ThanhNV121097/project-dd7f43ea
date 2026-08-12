# Story — Add persistent tasks

Module: `tasks`
Plan item: Add persistent tasks
Requirement: TASKS-001

## User story

As a Visitor, I want to enter a task title and save it, so that my new active task appears in the shared todo list and remains available after refresh.

## In scope

- Add task title input on single todo page.
- Client-side validation for empty and over-80-character titles before submit.
- Backend validation for trimmed title length from 1 to 80 characters.
- Trim leading and trailing whitespace before save.
- Create task in database-backed storage.
- Return stable task id, title, completion status, and creation ordering data after creation.
- Show saved active task immediately after successful creation.
- Clear input after successful creation.
- Accept duplicate titles as separate tasks.
- Update visible counts, completion meter, and saved-progress feedback after successful creation.
- Show error notice when save fails and keep existing saved list unchanged.

## Out of scope

- Login, user-owned lists, or per-browser lists.
- Task editing after creation.
- Completing, reactivating, or deleting tasks beyond preserving controls already present in approved design.
- Loading all saved tasks on first page load except what is needed for add-story integration with current visible list.
- Search, due dates, priorities, notes, reminders, notifications, offline sync, drag/drop ordering, or custom sorting controls.
- Delete confirmation dialogs.
- External services.

## UI scope

Touches approved single-page todo screen only, mainly Todo panel, Task form and text input, Notice/badge/toast, Task list item, and Progress side panel components from `design/design-system.md`.

States covered:

- Default form state with `Task title` input and `Add task` primary button.
- Invalid input state with red input styling, `aria-invalid="true"`, inline helper, and error notice.
- Saving feedback using saving badge or equivalent saved-progress feedback while create request is pending.
- Success state where new active task appears in list, input clears, and success notice/status feedback confirms save.
- Save failure state where error notice appears, typed title remains available for retry, and saved list remains unchanged.
- Responsive mobile and desktop layout must keep approved blue/white styling, visible focus states, and accessible names.

## Acceptance criteria

1. When Visitor submits a title with leading or trailing spaces, system saves and displays trimmed title.
2. When Visitor submits a trimmed title from 1 to 80 characters, system creates task successfully.
3. When Visitor submits only whitespace or empty value, no create request is saved and UI shows exact message `Enter a task title.`
4. When Visitor submits a trimmed title longer than 80 characters, no task is saved and UI shows an error message that names the 80-character limit.
5. When Visitor submits same valid title more than once, each submit creates a separate task with distinct stable id.
6. Every created task starts active, not completed.
7. After successful creation, new task appears in visible task list without page refresh.
8. After successful creation and browser refresh, created task remains present because it was saved to database-backed storage.
9. After successful creation, task title input is cleared.
10. After successful creation, total count increases by 1, active count increases by 1, completed count is unchanged, completion meter recalculates, and saved-progress feedback shows saved state.
11. If backend create request fails, UI shows error notice, existing saved list stays unchanged, and unsaved title remains available for retry.
12. Created task response includes stable id and created ordering data so later update, delete, and default ordering stories can use same record.
13. Task creation works without login and writes to shared list visible to any visitor.
14. Add form remains keyboard usable with visible focus state and native form submit behavior.

## Dependencies

- Project scaffold and architecture overview must exist for Next.js frontend, Go API, and PostgreSQL runtime.
- Database schema and create-task API contract may be defined during downstream technical design for this story.
- No external accounts, secrets, or third-party services are required.
- No prior product story must land first, but this story should preserve clear integration points for `View saved tasks`, `Complete tasks`, and `Delete tasks`.
