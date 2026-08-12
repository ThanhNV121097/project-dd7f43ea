# Test Cases — Polish todo page

Module: `tasks`
Function: Polish todo page
Requirement: TASKS-005
Risk level: Low — visual polish and accessibility affect usability, not data integrity. Happy-path coverage only per task request.

## Automated coverage

**Scenario**: Page uses approved blue-and-white visual style
**Given**: Visitor opens todo page with saved tasks loaded
**When**: Page renders main todo interface
**Then**: Page uses approved design-system tokens: primary blue `#2563EB` for primary actions or highlights, soft background `#F9FAFB`, white `#FFFFFF` task/card surfaces, completion accent `#10B981` for completed state, and destructive red `#EF4444` for delete action. Traces to TASKS-005.

**Scenario**: Page layout adapts to mobile width
**Given**: Visitor opens todo page at 390px viewport width with saved tasks loaded
**When**: Page renders main todo interface
**Then**: Add-task controls, task list, counts, completion meter, filters, and saved-progress feedback remain visible without horizontal scrolling. Traces to TASKS-005.

**Scenario**: Page layout adapts to desktop width
**Given**: Visitor opens todo page at 1440px viewport width with saved tasks loaded
**When**: Page renders main todo interface
**Then**: Main content stays in a clean centered layout, task controls remain aligned, and primary actions are reachable without overlapping content. Traces to TASKS-005.

**Scenario**: Keyboard focus states are visible
**Given**: Visitor opens todo page with saved tasks loaded
**When**: Visitor uses keyboard navigation through task title input, `Add task`, complete toggle, filter controls, and `Delete task`
**Then**: Each focused control shows a visible focus indicator before activation. Traces to TASKS-005.

**Scenario**: Task controls expose accessible names
**Given**: Visitor opens todo page with at least one active saved task loaded
**When**: Accessibility tree is inspected for input and task controls
**Then**: Task title input, `Add task`, complete toggle, filter controls, and `Delete task` each expose a non-empty accessible name matching their purpose. Traces to TASKS-005.

**Scenario**: Loading state keeps polished page shell
**Given**: Visitor opens todo page while saved tasks are loading
**When**: Loading state is displayed
**Then**: Blue-and-white page shell remains visible and loading feedback is present without hiding page structure. Traces to TASKS-005.

**Scenario**: Empty state keeps polished page shell
**Given**: Visitor opens todo page and persistent storage returns zero tasks
**When**: Empty state is displayed
**Then**: Blue-and-white page shell remains visible and empty-state copy appears in task list area. Traces to TASKS-005.

**Scenario**: Error state keeps polished page shell
**Given**: Visitor opens todo page and saved-task loading returns an error
**When**: Error state is displayed
**Then**: Blue-and-white page shell remains visible and retryable error state appears in task list area. Traces to TASKS-005.

**Scenario**: Saved state shows normal task interactions
**Given**: Visitor opens todo page with at least one active saved task loaded
**When**: Saved state is displayed
**Then**: Saved task title, completion status, available actions, counts, completion meter, filters, and saved-progress feedback are visible in the polished layout. Traces to TASKS-005.

**Scenario**: Interactions do not require animation
**Given**: Visitor opens todo page with saved tasks loaded and motion disabled by system preference
**When**: Visitor adds, completes, or deletes a task successfully
**Then**: Updated task list, counts, completion meter, and saved-progress feedback appear without requiring animation to understand or complete the task. Traces to TASKS-005.

## Manual coverage

None. All requested happy-path polish checks are observable with DOM, viewport, accessibility tree, CSS, and reduced-motion assertions.
