# Test Cases — Polish todo page

Module: `tasks`
Function: Polish todo page
Requirement: TASKS-005
Risk level: Low. Visual polish and accessibility improve usability, but do not change task persistence or destructive behavior.
Scope: Happy path only, per task request.

## Automated coverage

**Scenario**: Approved blue-and-white style appears on main todo page
**Given**: Visitor opens todo page with saved tasks available
**When**: Page finishes loading saved tasks
**Then**: Page uses approved design-system colors: primary blue `#2563EB` for main actions or accents, soft background `#F9FAFB`, white `#FFFFFF` content cards, completion accent `#10B981`, and destructive delete styling `#EF4444`; content appears in clean single-page layout
Trace: TASKS-005

**Scenario**: Mobile layout remains usable
**Given**: Visitor opens todo page at mobile viewport width
**When**: Page finishes loading saved tasks
**Then**: Add-task control, task list, filters, counts, completion meter, and saved-progress feedback fit viewport without horizontal scrolling; visible controls remain tappable and readable
Trace: TASKS-005

**Scenario**: Desktop layout remains usable
**Given**: Visitor opens todo page at desktop viewport width
**When**: Page finishes loading saved tasks
**Then**: Todo content stays arranged in clean centered page layout with readable spacing; add-task control, task list, filters, counts, completion meter, and saved-progress feedback are visible without overlap
Trace: TASKS-005

**Scenario**: Keyboard focus states are visible
**Given**: Visitor opens todo page with saved tasks available
**When**: Visitor tabs through title input, `Add task`, task completion toggle, filter controls, and `Delete task`
**Then**: Each focused control shows visible focus styling that is distinguishable from non-focused state
Trace: TASKS-005

**Scenario**: Buttons expose accessible names
**Given**: Visitor opens todo page with saved tasks available
**When**: Accessibility tree or equivalent query inspects interactive buttons
**Then**: Add button exposes name `Add task`, each completion toggle exposes a task-specific accessible name, filter controls expose readable names, and each delete button exposes `Delete task` or task-specific delete name
Trace: TASKS-005

**Scenario**: Loading state keeps page shell usable
**Given**: Visitor opens todo page while saved tasks are still loading
**When**: Loading state is displayed
**Then**: Page shell remains visible with blue-and-white styling and loading feedback; layout does not jump outside viewport
Trace: TASKS-005

**Scenario**: Empty state uses polished page layout
**Given**: Visitor opens todo page and persistent storage contains no tasks
**When**: Empty state is displayed
**Then**: Empty state copy appears inside polished blue-and-white page layout with add-task control still available
Trace: TASKS-005

**Scenario**: Saved state uses polished task styling
**Given**: Visitor opens todo page and persistent storage contains at least one active task and one completed task
**When**: Saved tasks are displayed
**Then**: Active and completed tasks are visually distinct, completion styling uses approved completion accent, and available actions remain visible
Trace: TASKS-005

**Scenario**: Minimal motion gives lightweight feedback only
**Given**: Visitor opens todo page with saved tasks available
**When**: Visitor adds, completes, or deletes a task successfully
**Then**: Interaction feedback is instant and does not require waiting for animation before next task action can be used
Trace: TASKS-005

## Manual coverage

None. All happy-path polish requirements above are observable through DOM, accessibility tree, viewport, and style assertions.
