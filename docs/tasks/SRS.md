# SRS — Tasks

Module: `tasks`
Last updated: 2026-08-12
Design: [View Design](http://localhost:8080/design/dd7f43ea-55b8-465f-9e3f-1b7aec8a90d3)
Design system: `design/design-system.md`

## 1. Purpose

The `tasks` module lets any visitor manage one shared todo list without login. It covers adding, viewing, completing, deleting, and polished single-page task interactions with database persistence. If this module fails, "Todo List App v5" cannot perform its core promise: a saved task list that remains after refresh.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Visitor | Any person opening the app; not signed in | Add tasks, view saved tasks, mark tasks complete or active, delete tasks, use page controls and filters |

## 3. Scope

**In scope** — the functions specified below, by their plan titles:

- Add persistent tasks
- View saved tasks
- Complete tasks
- Delete tasks
- Polish todo page

**Out of scope** — related work not included in this module:

- User accounts and permissions — deliberately not built; app has no login.
- Per-user private lists — deliberately not built; all visitors use the same task list for this app version.
- Due dates, priorities, notes, search, and task editing — deliberately not built; current scope is add, view, complete, and delete.
- Offline sync — deliberately not built; database persistence requires network access.
- Notifications or reminders — deliberately not built; no external services are planned.

## 4. Functional requirements

### 4.1 Add persistent tasks

**Requirement TASKS-001 — Add valid task**

*As a* Visitor, *I want to* enter a task title and submit it, *so that* the task appears in my todo list and remains after refresh.

Behaviour:

1. Visitor enters a task title in the `Task title` field and activates `Add task`.
2. System trims leading and trailing whitespace from the title.
3. If the trimmed title is valid, system creates a task with active status.
4. System shows the new task in the visible list immediately after successful creation.
5. System saves the task to persistent storage so opening or refreshing the page later shows the task.
6. System clears the input after successful creation.
7. System updates total, active, completed counts and completion meter after successful creation.
8. System communicates successful save through saved-progress feedback.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/tasks/test-cases/add-persistent-tasks.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | App is open and task title field contains `Buy milk` | Visitor activates `Add task` | A visible active task titled `Buy milk` appears in the task list |
| AC-2 | Visitor has added `Buy milk` successfully | Visitor refreshes page | Task `Buy milk` remains visible in the task list |
| AC-3 | App is open and task title field contains `  Buy milk  ` | Visitor activates `Add task` | A visible active task titled `Buy milk` appears without leading or trailing spaces |
| AC-4 | App is open and task title field contains a valid title | Visitor activates `Add task` | Task title field becomes empty after task is created |
| AC-5 | App has 1 active task and 0 completed tasks | Visitor adds a valid task | Total count increases to 2 and active count increases to 2 |
| AC-6 | App accepts a valid task | System finishes saving | Saved-progress feedback says `Saved` |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | Trimmed task title is empty | Inline error says `Enter a task title.`, task is not saved, existing list remains unchanged |
| Boundary | Trimmed title length is 1 character | Task is accepted and saved |
| Boundary | Trimmed title length is 80 characters | Task is accepted and saved |
| Boundary | Trimmed title length is 81 characters | Task is rejected with message naming the 80-character limit, task is not saved |
| Duplicate title | Title matches an existing task | Task is accepted as a separate task |
| Upstream failure | Save fails | Error notice appears, task is not shown as saved, existing list remains unchanged |
| Not permitted | Visitor tries to add a task | Action is allowed because no login or roles exist |
| Conflict | Another visitor changes the list before save completes | System keeps the saved task list consistent after the next load; no duplicate task is created from one submit |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Unique per task and stable across refresh |
| Task title | text | yes | Trimmed length 1 to 80 characters |
| Task completion status | boolean | yes | New tasks start active |
| Created time | datetime | yes | Recorded when task is created |
| Updated time | datetime | yes | Recorded when task is created or changed |

### 4.2 View saved tasks

**Requirement TASKS-002 — Load saved tasks**

*As a* Visitor, *I want to* see saved tasks when I open the app, *so that* I can continue from the same list.

Behaviour:

1. Visitor opens the single-page app.
2. System loads saved tasks from persistent storage.
3. While saved tasks load, system shows a loading state for the task list.
4. When saved tasks exist, system shows each task with title, completion status, and available actions.
5. When no saved tasks exist, system shows the empty state with guidance to add a task.
6. System shows counts for total, active, and completed tasks.
7. System lets Visitor filter visible tasks by all, active, and completed.
8. Filtering changes visible tasks only; it does not change saved task data.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/tasks/test-cases/view-saved-tasks.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Database contains active task `Call Sam` | Visitor opens app | Task `Call Sam` appears in task list |
| AC-2 | Database contains completed task `File notes` | Visitor opens app | Task `File notes` appears with completed visual state |
| AC-3 | Database contains no tasks | Visitor opens app | Empty state appears with guidance to add a task |
| AC-4 | Saved tasks are loading | Visitor opens app | Loading state appears before task data renders |
| AC-5 | Database contains 2 active tasks and 1 completed task | Visitor opens app | Total count is 3, active count is 2, completed count is 1 |
| AC-6 | List contains active and completed tasks | Visitor selects `Active` filter | Only active tasks are visible |
| AC-7 | List contains active and completed tasks | Visitor selects `Completed` filter | Only completed tasks are visible |
| AC-8 | Current filter has no matching tasks | Visitor applies that filter | Empty filtered state appears without deleting saved tasks |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Absent data | No saved tasks exist | Empty state appears; add form remains usable |
| Upstream failure | Task load fails | Error state appears with retry option; no blank screen appears |
| Retry | Load failed and storage becomes available | Visitor activates retry and saved tasks load |
| Boundary | Saved list contains 0 tasks | Empty state appears and counts show 0 total, 0 active, 0 completed |
| Boundary | Saved list contains 100 tasks | Page renders all saved tasks without horizontal scroll at supported widths |
| Data integrity | A saved task has missing required title | Task is not rendered as a valid task; error state or safe fallback prevents broken layout |
| Not permitted | Visitor opens app | Action is allowed because no login or roles exist |
| Conflict | Saved list changes before Visitor refreshes | Next load shows current persisted list |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Used to identify each rendered task |
| Task title | text | yes | Displayed as task title |
| Task completion status | boolean | yes | Controls active or completed visual state |
| Created time | datetime | yes | Available for stable ordering |
| Updated time | datetime | yes | Available for latest state |

### 4.3 Complete tasks

**Requirement TASKS-003 — Toggle completion status**

*As a* Visitor, *I want to* mark a task complete or active, *so that* my progress is saved and visible after refresh.

Behaviour:

1. Visitor activates a task completion control.
2. If the task is active, system marks it completed.
3. If the task is completed, system marks it active.
4. System updates the task visual state immediately after successful change.
5. System saves the changed completion status to persistent storage.
6. System updates total, active, completed counts and completion meter after successful change.
7. System keeps the task visible or hidden according to the current filter after change.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/tasks/test-cases/complete-tasks.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Task `Pay bill` is active | Visitor marks task complete | Task `Pay bill` appears completed |
| AC-2 | Task `Pay bill` is completed | Visitor marks task active | Task `Pay bill` appears active |
| AC-3 | Visitor has marked `Pay bill` completed | Visitor refreshes page | Task `Pay bill` remains completed |
| AC-4 | Visitor has marked `Pay bill` active | Visitor refreshes page | Task `Pay bill` remains active |
| AC-5 | List has 1 active task and 0 completed tasks | Visitor marks active task complete | Active count becomes 0 and completed count becomes 1 |
| AC-6 | Active filter is selected and a visible active task exists | Visitor marks that task complete | Task no longer appears in active-filtered list |
| AC-7 | Completed filter is selected and a visible completed task exists | Visitor marks that task active | Task no longer appears in completed-filtered list |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Not found | Target task no longer exists | System shows error feedback and removes or refreshes stale task from visible list |
| Upstream failure | Completion save fails | System shows error feedback and does not claim saved state |
| Boundary | Visitor toggles same task repeatedly | Final persisted status matches last successful toggle |
| Boundary | List has one active task | Marking it complete updates progress meter to 100% |
| Boundary | List has one completed task | Marking it active updates progress meter to 0% |
| Not permitted | Visitor toggles task completion | Action is allowed because no login or roles exist |
| Conflict | Another visitor changes same task before save completes | Last successful persisted change is shown after next load |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Identifies task to update |
| Task completion status | boolean | yes | Toggles between active and completed |
| Updated time | datetime | yes | Changes when completion status changes |

### 4.4 Delete tasks

**Requirement TASKS-004 — Delete task**

*As a* Visitor, *I want to* delete a task, *so that* removed work no longer appears in my saved list.

Behaviour:

1. Visitor activates a task delete control.
2. System deletes the selected task after Visitor action.
3. System removes the task from the visible list immediately after successful deletion.
4. System removes the task from persistent storage so opening or refreshing the page later does not show the task.
5. System updates total, active, completed counts and completion meter after successful deletion.
6. If deletion leaves no tasks or no tasks matching current filter, system shows the correct empty state.
7. System uses destructive styling for delete control.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/tasks/test-cases/delete-tasks.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Task `Old note` is visible | Visitor deletes task `Old note` | Task `Old note` disappears from task list |
| AC-2 | Visitor has deleted task `Old note` | Visitor refreshes page | Task `Old note` remains absent |
| AC-3 | List contains 2 tasks | Visitor deletes 1 task | Total count decreases to 1 |
| AC-4 | List contains only task `Old note` | Visitor deletes task `Old note` | Empty state appears |
| AC-5 | Active filter is selected and only 1 active task is visible | Visitor deletes that task | Empty filtered state appears |
| AC-6 | Completed task is deleted | Visitor views completed count | Completed count decreases by 1 |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Not found | Target task no longer exists | System shows error feedback and removes or refreshes stale task from visible list |
| Upstream failure | Delete save fails | System shows error feedback and does not claim saved state |
| Boundary | Deleting last remaining task | Empty state appears and counts show 0 total, 0 active, 0 completed |
| Boundary | Delete control is activated repeatedly for same task | Only one deletion is persisted; no duplicate error is shown to Visitor |
| Not permitted | Visitor deletes task | Action is allowed because no login or roles exist |
| Conflict | Another visitor changes same task before deletion completes | Successful deletion removes task from persisted list; failed deletion shows current safe list after reload or retry |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Identifies task to delete |
| Task title | text | yes | Used to identify visible task before deletion |
| Task completion status | boolean | yes | Used to update counts after deletion |

### 4.5 Polish todo page

**Requirement TASKS-005 — Polished accessible single-page UI**

*As a* Visitor, *I want to* use a clean blue-and-white todo page with accessible controls and minimal motion, *so that* task management is quick and understandable.

Behaviour:

1. System presents a single responsive page with header navigation, hero intro, todo app, reachable states, help section, and footer.
2. System uses approved colors: `#2563EB` primary blue, `#F9FAFB` soft background, `#FFFFFF` cards, `#10B981` completion accent, and `#EF4444` destructive or error state.
3. System shows clean card layout, task form, task list, progress summary, filter controls, and save feedback.
4. System provides keyboard-reachable controls with visible focus states.
5. System labels form fields and controls so assistive technology can identify purpose.
6. System uses minimal motion for hover, task state changes, progress meter, loading skeleton, and transient toast.
7. System provides reachable loading, empty, and error states for saved task loading.
8. System keeps core add, complete, and delete interactions instant from Visitor perspective after successful actions.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/tasks/test-cases/polish-todo-page.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Visitor opens app | Page loads | Single page shows header, hero, todo app, states section, help section, and footer |
| AC-2 | Visitor views todo app | Page loads | Primary action color uses `#2563EB` and page background uses `#F9FAFB` |
| AC-3 | Visitor navigates by keyboard | Visitor tabs through interactive controls | Each interactive control receives visible focus |
| AC-4 | Visitor uses screen reader landmarks | Visitor opens page | Main navigation and task controls have accessible names |
| AC-5 | Viewport width is 320px | Visitor opens page | Page content fits without horizontal page scroll |
| AC-6 | Viewport width is 1120px or wider | Visitor opens page | Todo app and progress summary use two-column layout |
| AC-7 | Saved tasks are loading | Visitor views states | Loading state is visible with skeleton rows |
| AC-8 | Task loading fails | Visitor views app | Error state is visible and tells Visitor retry is possible |
| AC-9 | Visitor completes or deletes a task | Action succeeds | Visible feedback appears within 500ms |
| AC-10 | Visitor views completed task | Page renders | Completed task uses completion accent and text treatment that distinguishes it from active tasks |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Small viewport | Viewport is 320px wide | Layout remains usable without horizontal page scroll |
| Keyboard access | Visitor cannot use pointer | Add, filter, complete, delete, retry, navigation, and help controls remain operable by keyboard |
| Assistive technology | Visitor uses screen reader | Form input has label, error text is announced, list changes are polite-live updates |
| Motion sensitivity | Visitor prefers reduced motion | Essential content remains available; motion is decorative and not required to understand state |
| Error state | Loading or saving fails | Error message uses destructive styling and does not hide existing safe data |
| Empty state | No tasks exist | Empty message explains what to do next |
| Not permitted | Visitor uses page controls | Controls are available because no login or roles exist |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Used by controls and list rendering |
| Task title | text | yes | Displayed in task cards and form validation |
| Task completion status | boolean | yes | Drives completed visual state, filters, and progress |
| Save state | status | yes | One of loading, saving, saved, error for user feedback |

## 5. Screens

## Design

Design preview: [View Design](http://localhost:8080/design/dd7f43ea-55b8-465f-9e3f-1b7aec8a90d3)

Approved design summary:

- Colors: `#2563EB` primary blue, `#F9FAFB` soft background, `#FFFFFF` cards, `#10B981` completion accent, `#EF4444` error/destructive.
- Todo page: single responsive todo screen for adding, viewing, completing, deleting, filtering, and seeing saved-progress feedback.
- States section: reachable loading, empty, and error states for saved task loading.
- Help section: short product promise and return link to main todo app.

| Screen | Section in the design | Functions it serves | States that must exist |
|---|---|---|---|
| Todo page | Hero and `Your tasks` app section | TASKS-001, TASKS-002, TASKS-003, TASKS-004, TASKS-005 | default, loading, saving, saved, validation error, empty, filtered empty, save error |
| Progress summary | `Progress` side panel | TASKS-001, TASKS-002, TASKS-003, TASKS-004, TASKS-005 | zero tasks, partial completion, full completion |
| States section | `Reachable states` section | TASKS-002, TASKS-005 | loading, empty, load error |
| Help section | `Built for one clean loop` section | TASKS-005 | default |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Initial todo page renders usable shell within 2 seconds on a typical broadband connection |
| Performance | Successful add, complete, and delete actions show visible feedback within 500ms after the action completes |
| Accessibility | Keyboard reachable controls, visible focus, labelled inputs, live validation feedback, and text contrast at least 4.5:1 for normal text |
| Responsive | Works at 320px and up with no horizontal page scroll |
| Localisation | User-facing product copy is in English |
| Privacy | Stored task data contains task titles and completion metadata only; no login, email, or personal profile data is collected |
| Data volume | App supports at least 100 saved tasks in the shared list |
| Persistence | Created, completed, active, and deleted task states remain after page refresh |

## 7. Dependencies and assumptions

- **Depends on:** persistent storage, for saving and loading todo tasks.
- **Depends on:** approved design and `design/design-system.md`, for colors, layout, components, and states.
- **Assumption:** the app has one shared todo list because no login or account owner exists. If private lists are required later, authentication and per-user data ownership must become new scope.
- **Assumption:** task titles are plain text only. If rich text or links are required later, input rules and sanitization requirements must change.
- **Assumption:** all visitors have equal access. If roles are added later, permission rules must be revised before implementation.

| Open question | Proposed default | Who decides |
|---|---|---|
| Should deletion require confirmation? | No confirmation; single click deletes because app is minimal and current design shows instant delete | Stakeholder |
| Should tasks have custom ordering? | Use stable default ordering from saved data; no drag reorder in current scope | Stakeholder |

## 8. Traceability

| Plan item | Requirement ids | Test cases |
|---|---|---|
| Add persistent tasks | TASKS-001 | `docs/tasks/test-cases/add-persistent-tasks.md` |
| View saved tasks | TASKS-002 | `docs/tasks/test-cases/view-saved-tasks.md` |
| Complete tasks | TASKS-003 | `docs/tasks/test-cases/complete-tasks.md` |
| Delete tasks | TASKS-004 | `docs/tasks/test-cases/delete-tasks.md` |
| Polish todo page | TASKS-005 | `docs/tasks/test-cases/polish-todo-page.md` |
