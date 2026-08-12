# Database Design (ERD) — Todo List App v5

Engine: PostgreSQL 16
Last updated: 2026-08-12
Source requirements: `docs/tasks/SRS.md`; story extension: `docs/tasks/stories/complete-tasks.md`

## 1. Overview

This schema stores one shared todo list for all visitors. `tasks` is the only aggregate root: each row is one saved task with stable identity, title, completion state, and system-defined creation ordering. Login, users, private lists, due dates, priorities, notes, search, editing history, offline sync, notifications, and custom ordering are deliberately out of scope and not stored.

`Complete tasks` uses existing `tasks.is_completed` and `tasks.updated_at`. No new table or column is required.

## 2. Diagram

```mermaid
erDiagram
    TASKS {
        uuid id PK
        text title
        boolean is_completed
        timestamptz created_at
        timestamptz updated_at
    }
```

Relationships: none. SRS requires one shared list with no login and no parent entity.

## 3. Entities

### 3.1 `tasks`

**Purpose** — Persist tasks in the shared todo list. **Traces to** — TASKS-001, TASKS-002, TASKS-003, TASKS-004.

| Column | Type | Null | Default | Unique | Description |
|---|---|---|---|---|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK | Stable surrogate key for update and delete operations. |
| `title` | `text` | no | none | no | Trimmed task title shown in list. |
| `is_completed` | `boolean` | no | `false` | no | Completion status; `false` means active, `true` means complete. Updated by Complete tasks. |
| `created_at` | `timestamptz` | no | `now()` | no | Creation time used for default newest-first ordering. |
| `updated_at` | `timestamptz` | no | `now()` | no | Last database update time for status changes; Complete tasks changes it only when requested completion status differs from saved value. |

**Nullable columns** — none.

**Foreign keys**

None. No login, no private lists, no parent objects in scope.

**Constraints**

- `ck_tasks_title_length`: `length(title) BETWEEN 1 AND 80`. Enforces TASKS-001 after backend trims input.
- `title` is not unique. Duplicate titles are accepted as separate tasks by TASKS-001 and TASKS-004; Complete tasks targets only `id` so duplicate-title rows do not change together.
- `is_completed` is a non-null boolean. Database type limits completion state to active/complete.

**Indexes**

| Name | Columns | Type | Query it serves |
|---|---|---|---|
| `idx_tasks_created_at_id` | `created_at DESC, id DESC` | btree | List saved tasks sorted by `created_at` descending, then stable `id` descending for tie-breaks (TASKS-002). |
| primary key on `tasks.id` | `id` | btree | Update one task by stable id for Complete tasks (TASKS-003) and delete one task by stable id (TASKS-004). |

**Lifecycle** — hard delete. TASKS-004 requires deleted tasks stay removed, with no retention/audit requirement and no children that need history.

## 4. Enumerations

No enumerations. Completion status is boolean because SRS has exactly two states: active and complete.

## 5. Access patterns

| # | Pattern | Frequency | Index used |
|---|---|---|---|
| 1 | List all tasks ordered by `created_at DESC, id DESC`. | On page load, retry, and after refresh. | `idx_tasks_created_at_id` |
| 2 | Insert task with trimmed title and default active status. | Per add action. | Primary key only; no lookup. |
| 3 | Update one task by stable `id` to set `is_completed` true or false and return saved row. | Per complete/active toggle. | Primary key. |
| 4 | Delete one task by stable `id`. | Per delete action. | Primary key. |
| 5 | Count active and completed tasks. | Derived after loading tasks and after changes. | No separate index; current app loads whole shared list and expected volume is small. |

## 6. Data volume and growth

| Table | Rows at launch | Growth | Retention |
|---|---|---|---|
| `tasks` | 0 | Low, visitor-created; expected under 10,000 rows/month for this simple shared app. | Until explicit hard delete. |

No table is expected to exceed 10M rows within a year. No partitioning or archival needed now.

## 7. Integrity, privacy, and security

- Database enforces stable primary key, non-null required fields, default active status, title length, timestamps, and duplicate-title allowance.
- Complete tasks must update by `id`, never by `title`, so duplicate titles remain independent.
- Application enforces trimming, user-facing validation messages, rollback/error UX, and optimistic-status recovery because those are interaction concerns.
- No personal data is required. `title` is visitor-entered text and may contain personal data by user choice; retention is until explicit delete.
- No secrets are stored.
- No row-level access rule. SRS says all visitors share one list with no login.

## 8. Migrations

| # | Change | Forward | Backward | Safe on non-empty table |
|---|---|---|---|---|
| 1 | Enable UUID generation | `CREATE EXTENSION IF NOT EXISTS pgcrypto;` | `DROP EXTENSION IF EXISTS pgcrypto;` only if no objects depend on it | Yes; metadata-only when extension exists. |
| 2 | Initial `tasks` table | Create `tasks` with `id`, `title`, `is_completed`, `created_at`, `updated_at`, primary key, and `ck_tasks_title_length`. | Drop `tasks`. | Yes for new database; destructive backward path if rows exist. |
| 3 | Task ordering index | Create `idx_tasks_created_at_id` on `(created_at DESC, id DESC)`. | Drop `idx_tasks_created_at_id`. | Yes; on populated production table use `CREATE INDEX CONCURRENTLY`. |
| 4 | Complete tasks design | No schema migration. Use existing `tasks.is_completed`, `tasks.updated_at`, and primary key. | No schema rollback. | Yes; no data or metadata change. |

Forward migration for Complete tasks is code-only: deploy handler/repository logic that runs `UPDATE tasks SET is_completed=$1, updated_at=CASE WHEN is_completed IS DISTINCT FROM $1 THEN now() ELSE updated_at END WHERE id=$2 RETURNING id,title,is_completed,created_at,updated_at`. Backward migration for this story is code rollback only. Safe on populated tables because no schema change, no data rewrite, and update touches only selected primary-key row per request.

## 9. Open questions

none
