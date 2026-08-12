# Story — Polish todo page

Plan item: Polish todo page
Module: `tasks`
Requirement: TASKS-005

## User story

As a Visitor, I want the todo page to look polished and remain usable across common task states, so that I can manage the shared todo list confidently on mobile or desktop.

## In scope

- Apply the approved blue-and-white visual style from `design/design-system.md` to the single todo page.
- Build responsive layout for mobile and desktop widths using the approved page frame, todo panel, task form, toolbar, task items, progress panel, state cards, help card, notices, badges, and toast patterns.
- Provide visible keyboard focus states for every interactive control in this story.
- Provide accessible names and state attributes where the design system calls them out, including task action labels, filter `aria-pressed`, and completion meter progress semantics.
- Include reachable loading, empty, error, and saved states in the page UI.
- Use minimal motion only for lightweight feedback such as hover, save badge, toast, skeleton shimmer, and progress meter changes.
- Respect `prefers-reduced-motion: reduce` during implementation even though the approved static mockup recorded it as a deviation.

## Out of scope

- Login, private lists, or per-user task ownership.
- Task editing, due dates, priorities, notes, search, notifications, reminders, offline sync, delete confirmation dialogs, or drag/drop ordering.
- Changing persistence rules, API contracts, database schema, or task ordering.
- Adding external services, analytics, custom fonts, icon libraries, or new design themes.
- Adding animation required for completing normal task actions.
- Redesigning approved layout, copy tone, or color palette beyond implementation-level accessibility fixes.

## UI scope

- Touches the approved single-page Todo page only: app shell, sticky header/navigation, hero preview, main todo panel, add-task form, notices/badges/toast, filter toolbar, task list item states, empty state, progress side panel, reachable states section, help section, and footer.
- Loading state: saved task fetch shows skeleton rows without breaking the page shell.
- Empty state: no saved tasks or no matching filtered tasks shows `No tasks here. Add one above to start your list.` with approved empty-state styling.
- Error state: failed task loading or save operations show error copy in approved danger styling and keep safe recovery controls visible.
- Saved state: saved-progress badge communicates saved or saving state after successful task interactions.
- Mobile layout stays single-column with usable controls; desktop layout uses the approved main panel plus progress side panel arrangement.

## Acceptance criteria

1. Page uses approved design tokens for colors, spacing, radius, shadows, typography, borders, focus ring, and motion; no new palette or theme is introduced.
2. At widths below 821px, header navigation collapses to the approved mobile menu pattern, task form actions remain usable, and content fits without horizontal scrolling.
3. At widths 901px and above, todo panel and progress side panel render in the approved two-column layout, with progress panel usable without covering task content.
4. Every interactive control has a visible keyboard focus state: nav links, mobile menu button, add button, input, filters, task completion controls, delete controls, retry/reset/state buttons, and help return link.
5. Native buttons or links are used for interactive controls, with accessible names matching their action, including `Add task`, `Mark complete`, `Mark active`, and `Delete task`.
6. Filter buttons expose selected state with `aria-pressed` and do not rely on color alone.
7. Completion meter exposes progress semantics with current completed count, total count, and percent value available to assistive technology.
8. Loading state is visible while saved tasks load and uses non-blocking skeleton or equivalent approved visual treatment.
9. Empty state is visible when no tasks exist and when selected filter has no matching tasks; message names missing tasks and gives next action.
10. Error state is visible when loading or task mutation fails, uses `role="alert"` for critical errors, and preserves page shell plus existing saved list where available.
11. Saved-progress feedback is visible after successful add, complete, uncomplete, and delete interactions, and saving feedback is visible while mutation is pending.
12. Task rows visually distinguish active and completed tasks without removing task title readability.
13. Delete action is styled as destructive on hover/focus intent but does not show a confirmation dialog.
14. Motion is lightweight and non-essential; with reduced-motion preference enabled, animations and smooth scrolling are removed or reduced while task actions remain fully usable.
15. Page content follows approved tone and sentence case; product name remains `Todo List App v5` when shown.

## Dependencies

- Approved design system: `design/design-system.md`.
- Architecture overview: `docs/architecture/overview.md`.
- Related task behavior stories provide data and interactions: Add persistent tasks, View saved tasks, Complete tasks, Delete tasks.
- No external accounts, credentials, or setup steps are required.
