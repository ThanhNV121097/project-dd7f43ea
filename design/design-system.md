# Design System — Todo List App v5

> Source of truth: approved `index.html`.
> Every value below is extracted from it. Changing value here without changing approved design is defect.

Last updated: 2026-08-12

## 1. Foundations

### 1.1 Color

Semantic tokens. Name by job, never by hue.

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#F9FAFB` | Page background |
| `--color-bg-end` | `#EEF6FF` | Page gradient end |
| `--color-surface` | `#FFFFFF` | Card, input, button, panel background |
| `--color-surface-soft` | `#F8FAFC` | Subtle list items, stats, empty states |
| `--color-surface-muted` | `#F3F4F6` | Browser chrome mock, neutral icon buttons |
| `--color-border` | `#E5E7EB` | Default border, divider |
| `--color-border-strong` | `#CBD5E1` | Input border, dashed empty border |
| `--color-text` | `#111827` | Body text, skip-link background, toast background |
| `--color-text-inverse` | `#FFFFFF` | Text on dark and primary backgrounds |
| `--color-text-muted` | `#6B7280` | Secondary text, captions |
| `--color-text-soft` | `#4B5563` | Neutral icon button text |
| `--color-label` | `#374151` | Form labels |
| `--color-primary` | `#2563EB` | Primary action background, active filter, illustration strokes |
| `--color-primary-hover` | `#1D4ED8` | Primary hover, saving badge text |
| `--color-primary-soft` | `#DBEAFE` | Decorative wash, skip focus ring, illustration fill |
| `--color-primary-soft-2` | `#EFF6FF` | Eyebrow, ghost hover, checkbox background, saving badge background |
| `--color-primary-accent` | `#60A5FA` | Logo gradient highlight |
| `--color-primary-border` | `#BFDBFE` | Ghost button border, hover task border |
| `--color-primary-check-border` | `#93C5FD` | Incomplete checkbox border |
| `--color-success` | `#10B981` | Completed checkbox, progress gradient, illustration status |
| `--color-success-text` | `#047857` | Saved badge text, success notice text |
| `--color-success-bg` | `#ECFDF5` | Saved badge, success notice |
| `--color-success-border` | `#A7F3D0` | Saved badge, success notice border |
| `--color-danger` | `#EF4444` | Invalid field border |
| `--color-danger-text` | `#B91C1C` | Error text, delete hover text |
| `--color-danger-strong` | `#991B1B` | Load error text |
| `--color-danger-bg` | `#FEF2F2` | Danger button, error notice, delete hover |
| `--color-danger-hover-bg` | `#FEE2E2` | Danger hover background |
| `--color-danger-border` | `#FECACA` | Error and danger borders |
| `--color-window-red` | `#F87171` | Decorative window dot |
| `--color-window-yellow` | `#FBBF24` | Decorative window dot |
| `--color-window-green` | `#34D399` | Decorative window dot |
| `--color-window-neutral` | `#CBD5E1` | Decorative window dot |
| `--color-dark-panel` | `#0F172A` | Help card background |
| `--color-dark-muted` | `#CBD5E1` | Help card secondary text |
| `--color-focus` | `rgba(37,99,235,.22)` | Focus ring |
| `--color-error-focus` | `rgba(239,68,68,.12)` | Invalid input halo |

#### Contrast audit

Every text-on-background pair actually used. Body text ≥ 4.5:1, large text (≥ 18.66px bold or ≥ 24px) ≥ 3:1, UI borders ≥ 3:1.

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-text` `#111827` | `--color-bg` `#F9FAFB` | `16.9:1` | AA |
| `--color-text` `#111827` | `--color-surface` `#FFFFFF` | `17.7:1` | AA |
| `--color-text-muted` `#6B7280` | `--color-surface` `#FFFFFF` | `4.8:1` | AA |
| `--color-text-muted` `#6B7280` | `--color-surface-soft` `#F8FAFC` | `4.7:1` | AA |
| `--color-label` `#374151` | `--color-surface` `#FFFFFF` | `10.3:1` | AA |
| `--color-text-soft` `#4B5563` | `--color-surface-muted` `#F3F4F6` | `7.1:1` | AA |
| `--color-primary` `#2563EB` | `--color-primary-soft-2` `#EFF6FF` | `4.9:1` | AA |
| `--color-primary` `#2563EB` | `--color-primary-soft` `#DBEAFE` | `4.2:1` | AA Large |
| `--color-primary` `#2563EB` | `--color-surface` `#FFFFFF` | `5.2:1` | AA |
| `--color-primary-text` `#FFFFFF` | `--color-primary` `#2563EB` | `5.2:1` | AA |
| `--color-primary-text` `#FFFFFF` | `--color-primary-hover` `#1D4ED8` | `6.7:1` | AA |
| `--color-primary-hover` `#1D4ED8` | `--color-primary-soft-2` `#EFF6FF` | `6.3:1` | AA |
| `--color-success-text` `#047857` | `--color-success-bg` `#ECFDF5` | `4.9:1` | AA |
| `--color-danger-text` `#B91C1C` | `--color-danger-bg` `#FEF2F2` | `6.5:1` | AA |
| `--color-danger-strong` `#991B1B` | `--color-danger-bg` `#FEF2F2` | `8.2:1` | AA |
| `--color-text-inverse` `#FFFFFF` | `--color-dark-panel` `#0F172A` | `17.9:1` | AA |
| `--color-dark-muted` `#CBD5E1` | `--color-dark-panel` `#0F172A` | `11.0:1` | AA |
| `--color-border` `#E5E7EB` | `--color-surface` `#FFFFFF` | `1.2:1` | FAIL for meaningful UI border; decorative only |
| `--color-border-strong` `#CBD5E1` | `--color-surface` `#FFFFFF` | `1.5:1` | FAIL for meaningful UI border; decorative only |

### 1.2 Spacing

Base unit: `1px`, because approved mockup uses multiple non-4px values. Product spacing still clusters around 8px steps.

| Token | Value |
|---|---|
| `--space-0` | `0` |
| `--space-1` | `2px` |
| `--space-2` | `6px` |
| `--space-3` | `7px` |
| `--space-4` | `8px` |
| `--space-5` | `9px` |
| `--space-6` | `10px` |
| `--space-7` | `11px` |
| `--space-8` | `12px` |
| `--space-9` | `13px` |
| `--space-10` | `14px` |
| `--space-11` | `15px` |
| `--space-12` | `16px` |
| `--space-13` | `18px` |
| `--space-14` | `20px` |
| `--space-15` | `22px` |
| `--space-16` | `24px` |
| `--space-17` | `28px` |
| `--space-18` | `32px` |
| `--space-19` | `34px` |
| `--space-20` | `36px` |
| `--space-21` | `42px` |
| `--space-22` | `54px` |
| `--space-23` | `72px` |
| `--space-24` | `76px` |
| `--space-25` | `80px` |
| `--space-26` | `96px` |

### 1.3 Typography

Font families (include fallback stack and how font is loaded):

- Body: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; no external font load in approved mockup, so system fallback may render if Inter is unavailable.
- Headings: same as body.
- Mono: none used.

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--text-xs` | `12px` | normal | `700`, `850`, `900` | Stat captions, meta text, badge |
| `--text-sm` | `13px` | normal | `800`, `900` | Eyebrow, label, error helper |
| `--text-nav` | `14px` | normal | `700` | Navigation links |
| `--text-base` | browser default `16px` | inherited / `1.35` / `1.5` / `1.6` | inherited, `800`, `850` | Body, buttons, task titles, help copy |
| `--text-lg` | `18px` not directly used | n/a | n/a | Not used in approved mockup |
| `--text-xl` | `20px` | `1.65` or normal | normal | Lead paragraph, state card h3 |
| `--text-2xl` | `24px` | normal | browser h2 bold | Progress h2 inline override |
| `--text-3xl` | `32px` | normal | browser h2 bold | Section h2 |
| `--text-4xl` | `40px` minimum clamp | `.95` | browser h1 bold | h1 small viewport |
| `--text-display` | `clamp(40px,6vw,72px)` | `.95` | browser h1 bold | h1 responsive display |

Heading levels are used in order: h1 hero, h2 sections and panels, h3 state cards. Levels are not skipped.

### 1.4 Radius, border, shadow, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-xs` | `10px` | Checkbox |
| `--radius-sm` | `12px` | Skip link, icon button, filter buttons |
| `--radius-md` | `14px` | Logo, menu button |
| `--radius-lg` | `16px` | Buttons, input, notice, summary item |
| `--radius-xl` | `18px` | Stat card, task card, state error / mini empty card |
| `--radius-2xl` | `22px` | Mobile nav, main empty state |
| `--radius-panel` | `24px` | Mini window, approved `--radius` token |
| `--radius-card` | `28px` | Todo, side, state panels |
| `--radius-feature` | `30px` | Help card |
| `--radius-preview` | `32px` | Preview card |
| `--radius-full` | `999px` | Pills, badge, meter, toast, decorative dots |
| `--border-width` | `1px` | Default borders, dividers, dashed empty border |
| `--border-width-strong` | `2px` | Checkbox border |
| `--focus-ring-width` | `4px` | Keyboard focus ring |
| `--shadow-card` | `0 18px 55px rgba(15,23,42,.08)` | Todo, side, state panels |
| `--shadow-preview` | `0 24px 70px rgba(37,99,235,.13)` | Preview card, mobile nav |
| `--shadow-logo` | `0 14px 30px rgba(37,99,235,.28)` | Logo |
| `--shadow-primary` | `0 16px 34px rgba(37,99,235,.28)` | Primary action |
| `--shadow-help` | `0 24px 70px rgba(15,23,42,.22)` | Help card |
| `--shadow-toast` | `0 18px 50px rgba(17,24,39,.22)` | Toast |
| `--duration-fast` | `.18s` | Button, input, task transitions |
| `--duration-base` | `.2s` | Nav link and toast transitions |
| `--duration-progress` | `.25s` | Progress meter |
| `--duration-loading` | `1.2s` | Skeleton shimmer loop |
| `--duration-intro` | `.7s` | Preview card intro animation |
| `--easing` | `ease` | All non-linear transitions |
| `--easing-loading` | `linear` | Skeleton shimmer |

Motion does not include `prefers-reduced-motion: reduce`; see Known deviations.

### 1.5 Layout and breakpoints

| Name | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `base` | `0` | `calc(100% - 32px)` capped at `1120px` | 1 | `16px` side inset |
| `md` | `821px` | `min(1120px, calc(100% - 32px))` | Hero `1.05fr .95fr`; nav links inline | `36px` hero gap |
| `lg` | `901px` | `min(1120px, calc(100% - 32px))` | App `minmax(0,1fr) 320px`; states `repeat(3,1fr)` | `24px` app gap, `18px` states gap |
| `xl` | `1120px` container cap | `1120px` | Same as `lg` | Same as `lg` |

Z-index scale (only these values are allowed):

| Layer | Value |
|---|---|
| Base | `0` |
| Sticky header | `5` |
| Skip link | `10` |
| Dropdown | `5` through header context; mobile nav has no explicit z-index |
| Modal backdrop | Not used |
| Modal | Not used |
| Toast | `20` |

## 2. Components

### 2.1 App shell / page frame

**Purpose** — single-page wrapper for todo app, preview, states, help, and footer; do not use for modal or multi-page navigation.

**Anatomy** — `[skip link] [sticky header/nav] [main sections] [footer] [toast]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Marketing intro + app | `--color-bg`, `--color-primary-soft`, `--color-bg-end`, `--space-19`, `--space-23` | Approved single todo page |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | min `100vh` | main `34px 0 72px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Radial and vertical background gradients, centered container | `--color-bg`, `--color-primary-soft`, `--color-bg-end` |
| Hover | No shell-level hover | none |
| Focus (keyboard) | Skip link moves into view with focus ring | `--color-focus`, `--color-text`, `--color-text-inverse` |
| Active / pressed | No shell-level pressed state | none |
| Disabled | Not applicable; shell is not interactive | none |
| Loading | Child skeleton cards handle loading | `--duration-loading` |
| Error | Child notices and state cards handle error | `--color-danger-bg`, `--color-danger-text` |
| Empty | Child empty state explains missing tasks | `--color-surface-soft`, `--color-text-muted` |

**Accessibility** — skip link targets `#app`; header nav uses `aria-label`; main uses section labels. Minimum interactive target inherited from child controls, generally at least 44×44px except compact text links.

### 2.2 Header navigation

**Purpose** — move between App, States, Help on same page; do not use for external account navigation.

**Anatomy** — `[brand link with logo] [menu button on mobile] [anchor links]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Desktop inline | `--color-text-muted`, `--color-primary-soft`, `--color-primary` | Viewport above `820px` |
| Mobile dropdown | `--color-surface`, `--color-border`, `--shadow-preview`, `--radius-2xl` | Viewport at or below `820px` |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Header | `72px` | none | `--text-base` brand |
| Link | auto | `10px 12px`; mobile `14px` | `--text-nav` |
| Menu button | auto | `10px 12px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Sticky translucent white bar with blur and bottom border | `--color-surface`, `--color-border` |
| Hover | Link pill gets soft blue background and primary text | `--color-primary-soft`, `--color-primary` |
| Focus (keyboard) | Same visual as hover for links; menu button uses 4px focus ring | `--color-focus` |
| Active / pressed | Menu button toggles nav open; no separate pressed visual | `--color-surface`, `--shadow-preview` |
| Disabled | Not used; links remain available | none |
| Loading | Not used in navigation | none |
| Error | Not used in navigation | none |
| Empty | Mobile nav hidden when closed; not content-empty state | none |

**Accessibility** — nav has `aria-label="Main navigation"`; menu button uses `aria-expanded` and `aria-controls`; Escape closes menu; link clicks close mobile menu. Logo checkmark is `aria-hidden`.

### 2.3 Button / link button

**Purpose** — primary navigation and todo actions; do not use when plain text link is enough.

**Anatomy** — `[label]`; delete icon button uses separate component.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Primary | `--color-primary`, `--color-primary-hover`, `--color-text-inverse`, `--shadow-primary` | Main action: open app, add task, back to app |
| Ghost | `--color-surface`, `--color-primary`, `--color-primary-border`, `--color-primary-soft-2` | Secondary action: review states, reset demo, state demos |
| Danger | `--color-danger-bg`, `--color-danger-text`, `--color-danger-border`, `--color-danger-hover-bg` | Destructive or error-adjacent action |
| Filter | `--color-surface`, `--color-text-muted`, `--color-border`, `--color-primary`, `--color-text-inverse` | Todo list filter group |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default action | approx `46px` | `13px 18px` | `--text-base` |
| Compact danger | approx `42px` | `10px 12px` | `--text-base` |
| Filter pill | approx `38px` | `9px 12px` | `--text-base` |
| Mobile full width primary in form | width `100%` | `13px 18px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Variant fill, 16px radius, bold label | `--radius-lg`, variant tokens |
| Hover | Primary darkens and moves up 1px; ghost softens and moves up 1px; danger background darkens; filter becomes active blue | `--color-primary-hover`, `--color-primary-soft-2`, `--color-danger-hover-bg` |
| Focus (keyboard) | 4px blue halo with 2px offset; filters use active blue fill and no outline | `--color-focus` |
| Active / pressed | No extra pressed style beyond browser click and hover transition | `--duration-fast` |
| Disabled | Not shown; if needed, reduce opacity and keep 44px target without changing tokens | existing variant tokens |
| Loading | Save badge and toast communicate saving; button itself has no spinner | `--color-primary-soft-2`, `--color-primary-hover` |
| Error | Danger button / error notice colors available | `--color-danger-bg`, `--color-danger-text` |
| Empty | Empty state uses ghost action to recover | `--color-primary`, `--color-primary-border` |

**Accessibility** — buttons use native `<button>` or anchors for navigation. Keep visible label. Minimum target height should stay near 44px; compact filter is slightly below and must keep ample spacing.

### 2.4 Todo panel

**Purpose** — primary task management surface; do not use for non-task marketing content.

**Anatomy** — `[panel header] [status badge] [task form] [notices] [filter toolbar] [empty state] [task list]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Main panel | `--color-surface`, `--color-border`, `--radius-card`, `--shadow-card` | Todo app content |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | content-driven | `24px` | `--text-base`, `--text-3xl` h2 |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Raised white panel with border and soft shadow | `--color-surface`, `--color-border`, `--shadow-card` |
| Hover | No panel-level hover | none |
| Focus (keyboard) | Child controls own focus | `--color-focus` |
| Active / pressed | Child controls own active state | none |
| Disabled | Not used; panel remains readable | none |
| Loading | Task list replaced by skeleton task rows | `--duration-loading`, `--color-border`, `--color-surface-soft` |
| Error | Error notice appears above toolbar | `--color-danger-bg`, `--color-danger-text`, `--color-danger-border` |
| Empty | Dashed empty state with illustration and next action text appears | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted` |

**Accessibility** — section labelled by h2 `Your tasks`; task list uses `aria-live="polite"`; toolbar has `aria-label="Task controls"`.

### 2.5 Task form and text input

**Purpose** — capture new task title; do not use for multi-field forms without extending spacing and validation rules.

**Anatomy** — `[label] [input] [inline error] [submit button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Standard text input | `--color-surface`, `--color-border-strong`, `--color-text`, `--radius-lg` | Task title |
| Invalid text input | `--color-danger`, `--color-error-focus`, `--color-danger-text` | Empty submit or validation failure |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | approx `50px` | `14px 15px` | `--text-base` |
| Error helper | min `20px` | `0` | `--text-sm` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | White field, strong neutral border, label above | `--color-surface`, `--color-border-strong`, `--color-label` |
| Hover | No explicit hover | none |
| Focus (keyboard) | 4px blue halo and default border | `--color-focus` |
| Active / pressed | Text cursor, no extra visual | none |
| Disabled | Not shown; if needed, keep label and helper visible | existing tokens |
| Loading | Submit action changes save badge after successful submit; input itself no loading state | `--color-primary-soft-2` |
| Error | Red border, red halo, inline error text, alert notice | `--color-danger`, `--color-error-focus`, `--color-danger-text` |
| Empty | Empty title is invalid; message says `Enter a task title.` | `--color-danger-text` |

**Accessibility** — label uses `for`; input has `aria-describedby="taskError"`; invalid state uses `aria-invalid="true"`; helper uses `aria-live="polite"`; form uses native submit.

### 2.6 Notice, badge, and toast

**Purpose** — communicate save state, success, error, and transient demo updates; do not use toast for critical errors requiring action.

**Anatomy** — badge `[text]`; notice `[message]`; toast `[message]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Saved badge | `--color-success-bg`, `--color-success-text`, `--color-success-border` | Current persistence state is saved |
| Saving badge | `--color-primary-soft-2`, `--color-primary-hover`, `--color-success-border` | Change is being saved |
| Success notice | `--color-success-bg`, `--color-success-text`, `--color-success-border` | Task added |
| Error notice | `--color-danger-bg`, `--color-danger-text`, `--color-danger-border` | Validation or loading error |
| Toast | `--color-text`, `--color-text-inverse`, `--shadow-toast` | Temporary confirmation |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Badge | content-driven | `8px 11px` | `--text-xs` |
| Notice | content-driven | `12px 14px` | `--text-base` |
| Toast | content-driven | `12px 16px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Hidden notices, saved badge visible | `--color-success-bg`, `--color-success-text` |
| Hover | No hover behavior | none |
| Focus (keyboard) | Not focusable | none |
| Active / pressed | Not pressable | none |
| Disabled | Not applicable | none |
| Loading | Badge text changes to `Saving…`; toast can show loading replay | `--color-primary-soft-2`, `--color-primary-hover` |
| Error | Error notice shown with `role="alert"` | `--color-danger-bg`, `--color-danger-text` |
| Empty | Empty messages explain missing data in empty component, not toast | none |

**Accessibility** — success notice and toast use status/live region; error notice uses `role="alert"`. Do not rely on color alone; messages include text.

### 2.7 Filter toolbar

**Purpose** — switch list view between all, active, completed; do not use for permanent navigation.

**Anatomy** — `[filter group] [reset demo button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Filter group | `--color-border`, `--color-surface`, `--color-text-muted`, `--color-primary` | Todo list filters |
| Reset action | ghost button tokens | Restore starter tasks |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Toolbar | content-driven | margin `18px 0`, gap `12px` | `--text-base` |
| Filter | approx `38px` | `9px 12px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Inactive filters are white with muted text | `--color-surface`, `--color-text-muted`, `--color-border` |
| Hover | Filter becomes primary blue with white text | `--color-primary`, `--color-text-inverse` |
| Focus (keyboard) | Same as active blue, outline removed | `--color-primary`, `--color-text-inverse` |
| Active / pressed | `.active` filter remains primary blue | `--color-primary`, `--color-text-inverse` |
| Disabled | Not shown; keep group available | none |
| Loading | No loading state; list area handles loading | none |
| Error | No error state; notice handles errors | none |
| Empty | Empty list appears under toolbar when no matching tasks | `--color-surface-soft`, `--color-text-muted` |

**Accessibility** — filter buttons are in `role="group"` with `aria-label="Filter tasks"`; selected filter uses visual `.active` only, so implementation should add `aria-pressed` when coded.

### 2.8 Task list item

**Purpose** — display single task with completion toggle and delete action; do not use for non-actionable history rows.

**Anatomy** — `[check button] [title + meta] [delete icon button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Active task | `--color-surface`, `--color-border`, `--color-text` | Task not complete |
| Completed task | `--color-surface-soft`, `--color-text-muted`, `--color-success` | Task marked done |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Task row | content-driven, minimum approx `54px` | `12px`, gap `12px` | `--text-base`, `--text-xs` meta |
| Check button | `28px` | none | icon glyph |
| Delete button | approx `36px` | `9px 10px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | White row, border, title and meta | `--color-surface`, `--color-border`, `--color-text` |
| Hover | Row moves up 1px and border becomes primary border; delete button turns danger on hover | `--color-primary-border`, `--color-danger-bg`, `--color-danger-text` |
| Focus (keyboard) | Check and delete buttons get 4px blue halo | `--color-focus` |
| Active / pressed | Check toggles completion; delete removes row | `--color-success`, `--color-surface-soft` |
| Disabled | Not shown; disabled task would need muted text and no pointer cursor | existing muted tokens |
| Loading | Skeleton row may replace list items | `--duration-loading` |
| Error | Load error appears outside list; item-level error not shown | none |
| Empty | List hidden; empty state shown | `--color-surface-soft`, `--color-text-muted` |

**Accessibility** — task list uses `aria-live="polite"`; check button has `aria-label` changing between `Mark complete` and `Mark active`; delete button has `aria-label="Delete task"`. Check button is 28×28px, below 44×44px target; record as deviation.

### 2.9 Empty state

**Purpose** — explain missing tasks and next action; do not leave list blank.

**Anatomy** — `[illustration] [strong message] [instruction]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Main empty state | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted`, `--color-primary-soft`, `--color-primary`, `--color-success` | No tasks or filter result empty |
| Mini empty state | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted` | States demo card |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Main | content-driven | `32px 18px` | `--text-base` |
| Mini | content-driven | `24px` | `--text-base` |
| Illustration | `86px × 86px` | margin bottom `8px` | n/a |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Hidden until no visible tasks | none |
| Hover | No hover behavior | none |
| Focus (keyboard) | Not focusable | none |
| Active / pressed | Not pressable | none |
| Disabled | Not applicable | none |
| Loading | Loading skeleton replaces empty | `--duration-loading` |
| Error | Error notice replaces empty for load failure | `--color-danger-bg`, `--color-danger-text` |
| Empty | Dashed border, illustration, text says `No tasks here. Add one above to start your list.` | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted` |

**Accessibility** — decorative SVG uses `aria-hidden="true"`; text states condition and next action. Keep empty message visible to screen readers.

### 2.10 Progress side panel

**Purpose** — show task totals and completion rate; do not use for primary task editing.

**Anatomy** — `[heading] [description] [meter] [summary list]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Sticky desktop | `--color-surface`, `--color-border`, `--shadow-card`, `--radius-card` | Viewport above `900px` |
| Static mobile | same tokens | Viewport at or below `900px` |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Panel | content-driven | `20px` | `--text-base`, `--text-2xl` heading |
| Meter | `12px` | none | n/a |
| Summary row | content-driven | `12px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | White raised panel, sticky at 96px from top | `--color-surface`, `--shadow-card` |
| Hover | No hover | none |
| Focus (keyboard) | Not focusable | none |
| Active / pressed | Meter width updates after task toggle/delete/add | `--duration-progress` |
| Disabled | Not applicable | none |
| Loading | Counts default to 0 until render; no skeleton in side panel | existing tokens |
| Error | Error state not reflected in counts | none |
| Empty | Counts show 0; meter width 0% | `--color-border`, `--color-surface-soft` |

**Accessibility** — meter has `aria-label="Completion meter"` but no `role="progressbar"`; implementation should add role and value attributes.

### 2.11 State demo card

**Purpose** — document reachable loading, empty, and error states; do not use as app content card without state message.

**Anatomy** — `[h3] [description] [state visual] [demo button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Loading | `--color-border`, `--color-surface-soft`, `--duration-loading` | Saved task fetch in progress |
| Empty | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted` | No saved tasks or no matching filter |
| Error | `--color-danger-bg`, `--color-danger-border`, `--color-danger-strong` | Saved tasks cannot be fetched |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Card | min `220px` | `20px` | `--text-xl` h3, `--text-base` body |
| Skeleton bar | `18px` | none | n/a |
| Demo button | content-driven | `13px 18px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Raised white state card with border | `--color-surface`, `--color-border`, `--shadow-card` |
| Hover | Demo button handles hover | ghost tokens |
| Focus (keyboard) | Demo button gets focus ring | `--color-focus` |
| Active / pressed | Demo button triggers corresponding app state | state variant tokens |
| Disabled | Not shown | none |
| Loading | Shimmer bars animate | `--duration-loading`, `--easing-loading` |
| Error | Red box with safe retry copy | `--color-danger-bg`, `--color-danger-border`, `--color-danger-strong` |
| Empty | Dashed mini empty state explains next action | `--color-surface-soft`, `--color-border-strong`, `--color-text-muted` |

**Accessibility** — cards are `<article>` elements. Loading shimmer is `aria-hidden="true"`; demo buttons are native buttons with visible labels.

### 2.12 Preview and statistic cards

**Purpose** — show non-interactive summary preview in hero; do not use for live task controls.

**Anatomy** — `[preview card] [mini window top] [summary text] [stat row]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Hero preview | `--color-surface`, `--color-border`, `--shadow-preview`, `--radius-preview` | Hero illustrative app preview |
| Stat tile | `--color-surface-soft`, `--color-border`, `--radius-xl` | Summary metrics |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Preview card | content-driven | `20px` | `--text-base` |
| Mini top | `46px` | `0 16px` | n/a |
| Mini body | content-driven | `22px` | `--text-base` |
| Stat tile | content-driven | `14px` | `22px` number, `--text-xs` label |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Raised translucent white card, intro animation | `--shadow-preview`, `--duration-intro` |
| Hover | No hover | none |
| Focus (keyboard) | Not focusable | none |
| Active / pressed | Not pressable | none |
| Disabled | Not applicable | none |
| Loading | Not used; preview static | none |
| Error | Static Errors stat can show 0 | `--color-text` |
| Empty | Static preview still shows sample stats | `--color-surface-soft` |

**Accessibility** — preview `aside` has `aria-label="Todo preview summary"`; window dots are decorative spans.

### 2.13 Help card

**Purpose** — close page with product promise and return action; do not use for errors or forms.

**Anatomy** — `[heading] [paragraph] [primary link]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Dark CTA | `--color-dark-panel`, `--color-text-inverse`, `--color-dark-muted`, `--shadow-help` | End of page guidance |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | content-driven | `28px` | `--text-3xl` h2, `--text-base` body |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Dark rounded panel with white heading and muted paragraph | `--color-dark-panel`, `--color-text-inverse`, `--color-dark-muted` |
| Hover | Primary link hover darkens and lifts | primary button tokens |
| Focus (keyboard) | Link gets focus ring | `--color-focus` |
| Active / pressed | Link jumps to app anchor | primary button tokens |
| Disabled | Not used | none |
| Loading | Not used | none |
| Error | Not used | none |
| Empty | Not used; content always present | none |

**Accessibility** — section labelled by h2; return action is anchor link with visible text.

## 3. Content and formatting

- Voice and tone: clear, calm, action-focused, no jokes or hype.
- Date, time, number, and currency formats: no dates, times, or currency shown; plain integers for task counts.
- Capitalization rule: sentence case for headings and buttons (`Open todo list`, `Add task`); product name remains `Todo List App v5`.
- Empty-state wording pattern: name missing thing, then next action (`No tasks here. Add one above to start your list.`).
- Error-message wording pattern: state problem, then recovery or reassurance (`Could not load tasks. Retry keeps saved data safe.`).
- Success wording pattern: direct confirmation in past tense (`Task added`, `Task completed`, `Task deleted`).
- Labels: short noun phrases (`Task title`, `Progress`, `Reachable states`).

## 4. Known deviations

Places where approved design does not follow its own rules or anti-patterns in `references/ai-defaults.md`. Record, do not silently fix.

| Where | Deviation | Why it stands | Follow-up |
|---|---|---|---|
| Color palette | Uses blue gradients and decorative washes (`linear-gradient`, `radial-gradient`, logo gradient, progress gradient). AI defaults warn against decorative gradients. | Stakeholder approved clean blue/white, slightly polished direction; gradients appear in approved mockup. | Keep gradients only where already used; do not add new decorative gradients without design approval. |
| Radius scale | Many radius values: `10`, `12`, `14`, `16`, `18`, `22`, `24`, `28`, `30`, `32`, `999px`. AI defaults recommend 3–4 steps. | Approved mockup uses broad rounded scale. | Consolidate in future redesign if visual drift appears. |
| Spacing scale | Uses many 1px-specific values such as `7`, `9`, `11`, `13`, `15`, `34`, `54`, `76`, `96`. | Extracted from approved CSS; not normalized here. | Future design cleanup can map to 4px/8px scale. |
| Motion | No `prefers-reduced-motion: reduce` rule; `scroll-behavior:smooth`, intro animation, hover transforms, toast motion, skeleton shimmer remain active. | Approved mockup lacks reduced-motion handling. | Add reduced-motion CSS during implementation if allowed by acceptance criteria. |
| Focus states | `.filter:focus` and nav link focus set `outline:none`; replacement is color-only for filters and nav links. | Approved mockup uses this focus behavior. | Add visible focus ring to filter/nav in future accessibility fix. |
| Hit targets | Check button is `28px × 28px`, below 44×44px minimum target. Filter button height is approx `38px`. | Approved mockup uses compact controls. | Increase target area in implementation if UX acceptance allows. |
| Border contrast | Default borders `#E5E7EB` and input/empty borders `#CBD5E1` fail 3:1 against white when border is meaningful. | Approved mockup uses subtle borders. | Use stronger border token for required affordances in future accessibility pass. |
| ARIA state | Active filter has visual `.active` but no `aria-pressed`; completion meter lacks `role="progressbar"` and values. | Approved mockup is static/interactive design, not final app code. | Add ARIA attributes during implementation. |
| Typography tokens | `--text-lg` is absent while `--text-xl`, `--text-2xl`, `--text-3xl`, and display sizes are used. | Template expects ramp; approved CSS skips direct 18px use. | Do not introduce 18px unless needed by real UI. |

## 5. Change log

| Date | Change | Design PR |
|---|---|---|
| 2026-08-12 | Initial design system extracted from approved `index.html`. | This PR |
