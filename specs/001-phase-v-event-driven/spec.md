# Feature Specification: Phase V – Event-Driven AI Todo Application

**Feature Branch**: `001-phase-v-event-driven`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Phase V AI Todo Application — Event-Driven Architecture with
Task Management, AI Chatbot, Reminders, Recurring Tasks, Audit Logs, and Cloud Deployment"

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│              Next.js + TypeScript + Tailwind CSS                │
│   ┌──────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│   │ Task Dashboard│  │ Task CRUD UI  │  │   Chatbot UI       │  │
│   └──────────────┘  └───────────────┘  └────────────────────┘  │
│                NEXT_PUBLIC_API_URL ↓                            │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Railway) — FastAPI                        │
│    https://web-production-7458d.up.railway.app/                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Task API │ │ Chat API │ │Reminder  │ │ Recurring Engine  │  │
│  └──────────┘ └──────────┘ │ Service  │ └───────────────────┘  │
│                             └──────────┘                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ Audit Log│ │   Auth   │ │  Dapr    │                        │
│  │ Service  │ │(BetterAuth│ │ Sidecar  │                        │
│  └──────────┘ └──────────┘ └────┬─────┘                        │
└───────────────────────────────── │ ──────────────────────────────┘
                                   │
       ┌───────────────────────────┼──────────────────────┐
       │                           │                       │
┌──────┴───────┐     ┌─────────────┴────────┐   ┌────────┴──────┐
│  Redpanda    │     │  Dapr State Store    │   │  Neon Postgres│
│ (Kafka Cloud)│     │  (Conversation State)│   │  (Persistence)│
│ task-events  │     └──────────────────────┘   └───────────────┘
│task-reminders│
│ audit-events │
└──────────────┘
       │
┌──────┴───────┐
│  Cohere API  │
│(AI + Embeds) │
└──────────────┘
```

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Task CRUD via Dashboard (Priority: P1)

As an authenticated user, I can create, view, edit, delete, and complete tasks through
a clean dashboard interface. I can set a title, description, priority, tags, and
optionally a reminder time. Tasks are visible immediately after creation and persist
across sessions.

**Why this priority**: Core task management is the foundational capability. Every other
feature depends on tasks existing. Without this, no other user story is testable.

**Independent Test**: Create a task with title, description, and priority; verify it
appears in the list; edit the title; mark it complete; delete it. The dashboard must
reflect each state change immediately without page refresh.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they submit the task
   creation form with a title and priority, **Then** the task appears in the list with
   correct values and a `created_at` timestamp.
2. **Given** an existing task, **When** the user updates the title or description,
   **Then** the task list reflects the new values and `updated_at` is refreshed.
3. **Given** an existing task, **When** the user clicks the complete toggle, **Then**
   the task is marked completed and visually distinguished from active tasks.
4. **Given** an existing task, **When** the user deletes it, **Then** the task is
   removed from the list and a confirmation is shown.
5. **Given** a user with no tasks, **When** they open the dashboard, **Then** they see
   an empty state prompt encouraging task creation.

---

### User Story 2 – AI Chatbot Task Management (Priority: P2)

As an authenticated user, I can manage tasks using natural language through a floating
chatbot UI. I can type commands like "Create a task to review pull requests tomorrow"
or "Mark my gym task complete" and the chatbot understands my intent and executes the
correct operation.

**Why this priority**: The AI chatbot differentiates this product. Users who prefer
natural language interaction must be able to manage all core task operations without
touching the dashboard forms.

**Independent Test**: Open the chatbot, type "Add a task called buy groceries", verify
the task appears in the dashboard. Then type "Mark buy groceries as done", verify
completion. All without using dashboard forms.

**Acceptance Scenarios**:

1. **Given** the chatbot is open, **When** a user types "Create a task to buy milk",
   **Then** a task titled "Buy milk" is created and the chatbot confirms with the
   task title and creation timestamp.
2. **Given** an existing task, **When** the user types "Mark my buy milk task complete",
   **Then** the task is marked complete and the chatbot confirms the action.
3. **Given** an ambiguous request, **When** the user types "delete it" with multiple
   tasks present, **Then** the chatbot asks for clarification listing matching tasks.
4. **Given** the user types "Show my high priority tasks", **Then** the chatbot lists
   all tasks with priority "high" in a readable format.
5. **Given** a request to set a reminder, **When** the user types "Remind me about gym
   at 8am tomorrow", **Then** the chatbot sets the `reminder_at` field and confirms
   the reminder time.

---

### User Story 3 – Task Reminders (Priority: P3)

As a user, I can set a reminder timestamp on any task. When that time arrives, the
system triggers a reminder notification event. The reminder is stored with the task
and displayed in the UI.

**Why this priority**: Reminders add time-awareness to tasks. This is a key productivity
feature, but core CRUD and chatbot must be working before reminders add real value.

**Independent Test**: Create a task with a `reminder_at` set 1 minute in the future.
Wait for the reminder to fire. Verify the `task-reminders` event is published and the
reminder is acknowledged in the system.

**Acceptance Scenarios**:

1. **Given** a task with `reminder_at` set, **When** that timestamp is reached,
   **Then** a reminder event is published to `task-reminders` and processed.
2. **Given** a user attempts to set `reminder_at` to a past timestamp, **Then**
   the system rejects it with a clear validation error.
3. **Given** a reminder event is published, **When** the reminder service processes it,
   **Then** the chatbot interface displays a reminder notification to the user.

---

### User Story 4 – Recurring Task Engine (Priority: P4)

As a user, I can mark tasks as recurring (daily, weekly, or monthly). When I complete
a recurring task, the system automatically generates the next instance with an
incremented due date.

**Why this priority**: Recurring tasks automate repetitive work. Valuable, but dependent
on core task CRUD and completion being fully stable first.

**Independent Test**: Create a task with `recurring_interval = daily`. Complete it.
Verify a new task with the same title and next day's due date is automatically created.

**Acceptance Scenarios**:

1. **Given** a recurring daily task, **When** a user marks it complete, **Then** a new
   task with the same attributes and tomorrow's due date is created automatically.
2. **Given** a recurring weekly task, **When** completed, **Then** the next instance
   is created with a due date 7 days ahead.
3. **Given** a recurring monthly task, **When** completed, **Then** the next instance
   is created one calendar month ahead.
4. **Given** a non-recurring task is completed, **Then** no new task is generated.

---

### User Story 5 – Audit Log System (Priority: P5)

As a system operator, every task action (create, update, delete, complete) is recorded
in an audit log. Audit events are published to the `audit-events` Kafka topic and
stored persistently for compliance review.

**Why this priority**: Audit logging is a cross-cutting concern needed for compliance
and debugging. Important but non-blocking for user-facing features.

**Independent Test**: Create, update, and delete a task. Query audit records and verify
all three actions appear with correct `event_type`, `task_id`, `user_id`, and
`timestamp`.

**Acceptance Scenarios**:

1. **Given** a task is created, **When** the creation succeeds, **Then** an audit
   event with `event_type: task_created` is published to `audit-events` and persisted.
2. **Given** a task is deleted, **When** the deletion succeeds, **Then** an audit
   event with `event_type: task_deleted` is recorded with the task's final state.
3. **Given** audit events are stored, **When** queried by `user_id` and time range,
   **Then** all matching events are returned in chronological order.

---

### Edge Cases

- What happens when a chatbot intent cannot be mapped to a known action? The chatbot
  responds politely explaining it cannot perform the request and suggests supported
  commands.
- What happens when a reminder fires for a task that has since been deleted? The
  reminder event is discarded gracefully with a log entry; no error is surfaced to
  the user.
- What happens when a recurring task is deleted before completion? No next instance
  is generated; the recurring chain terminates silently.
- What happens when the Kafka broker is unreachable? The task operation succeeds in
  the database and the event is retried once; if still failing, a warning is logged
  and the user action is not blocked.
- What happens when a user submits two identical tasks? Both are created; no
  automatic deduplication is performed.
- What happens when `reminder_at` equals `created_at`? The system rejects it since
  the reminder must be strictly in the future.
- What happens when a task has tags with special characters? Tags are stored as-is
  but trimmed of leading/trailing whitespace.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Task Management

- **FR-001**: System MUST allow authenticated users to create tasks with `title`,
  `description`, `priority` (low / medium / high), and optional `tags` (array of
  strings).
- **FR-002**: System MUST assign a unique `id`, `created_at`, and `updated_at` to
  every task automatically on creation.
- **FR-003**: System MUST allow users to list all their tasks with optional filters
  for `completed` status, `priority`, and `tag`.
- **FR-004**: System MUST allow users to retrieve a single task by `id`.
- **FR-005**: System MUST allow users to update any field of a task; `updated_at`
  MUST be refreshed on every successful update.
- **FR-006**: System MUST allow users to delete a task; deleted tasks MUST NOT
  appear in list responses.
- **FR-007**: System MUST allow users to mark a task complete by setting
  `completed = true`.
- **FR-008**: System MUST support optional `reminder_at` (ISO 8601 datetime) and
  `recurring_interval` (`daily` | `weekly` | `monthly` | `null`) on every task.
- **FR-009**: Users MUST only be able to access and modify their own tasks; access
  to another user's tasks MUST be rejected with HTTP 403.

#### AI Chatbot

- **FR-010**: The chatbot MUST accept free-text messages and respond with natural
  language confirmations of the action taken.
- **FR-011**: The chatbot MUST detect intent from: `create_task`, `update_task`,
  `delete_task`, `complete_task`, `list_tasks`.
- **FR-012**: The chatbot MUST extract task entities from natural language: title,
  priority, due date references, and reminder time references.
- **FR-013**: When intent is ambiguous or a required entity is missing, the chatbot
  MUST ask one clarifying question before proceeding.
- **FR-014**: The chatbot MUST maintain conversation history within a session so
  that follow-up messages reference previous context (e.g., "mark it done").
- **FR-015**: The chatbot MUST use Cohere (via `COHERE_API_KEY`) for intent/entity
  extraction and natural language response generation.
- **FR-016**: The chatbot MUST support reminder setting via natural language (e.g.,
  "remind me tomorrow at 9am").

#### Event-Driven Architecture

- **FR-017**: System MUST publish to the `task-events` Kafka topic whenever a task
  is created, updated, deleted, or completed.
- **FR-018**: System MUST publish to the `task-reminders` Kafka topic when a
  reminder is triggered.
- **FR-019**: System MUST publish to the `audit-events` Kafka topic for every task
  state change, including the full task snapshot in the event payload.
- **FR-020**: All Kafka events MUST conform to the canonical schema:
  `{ event_type, task_id, user_id, timestamp, payload }`.
- **FR-021**: Event consumers MUST be idempotent; duplicate messages MUST be
  handled without creating duplicate side effects.
- **FR-022**: Kafka event publishing MUST be performed through Dapr pub/sub;
  direct Kafka SDK usage is prohibited.

#### Reminder System

- **FR-023**: System MUST validate that `reminder_at` is a future timestamp at the
  time of task creation or update; past timestamps MUST be rejected with HTTP 400.
- **FR-024**: When `reminder_at` is reached, the reminder service MUST publish an
  event to `task-reminders` and notify the user via the chatbot interface.
- **FR-025**: The reminder service MUST schedule reminders using the Dapr Jobs API.
- **FR-026**: If a task with a pending reminder is deleted, the corresponding Dapr
  Job MUST be cancelled to prevent orphaned reminders.

#### Recurring Task Engine

- **FR-027**: When a task with a non-null `recurring_interval` is marked complete,
  the system MUST automatically create a new task instance.
- **FR-028**: The new recurring instance MUST inherit all parent fields (title,
  description, priority, tags, `recurring_interval`) except `id`, `created_at`,
  `updated_at`, and `completed`.
- **FR-029**: The new instance due date MUST be calculated as:
  - `daily`: +1 day from parent completion date
  - `weekly`: +7 days from parent completion date
  - `monthly`: +1 calendar month from parent completion date

#### Audit Log System

- **FR-030**: System MUST record an audit event for every task action with fields:
  `event_type`, `task_id`, `user_id`, `timestamp`, and `payload` (task snapshot).
- **FR-031**: Audit events MUST be published to `audit-events` Kafka topic AND
  persisted to the database audit log table.
- **FR-032**: Audit records MUST be queryable by `user_id` and time range.

#### Frontend

- **FR-033**: Frontend MUST display a task dashboard listing all user tasks grouped
  by completion status (active vs. completed).
- **FR-034**: Frontend MUST provide a task creation form and task edit interface
  supporting all task fields.
- **FR-035**: Frontend MUST display a floating chatbot icon that expands into a
  chat panel with scrollable conversation history.
- **FR-036**: Frontend MUST visually distinguish overdue tasks (where `reminder_at`
  has passed and task is still incomplete).
- **FR-037**: Frontend MUST communicate with the backend exclusively through the
  `NEXT_PUBLIC_API_URL` environment variable; no hard-coded URLs are permitted.

#### Security

- **FR-038**: All API endpoints except `GET /health` MUST require authentication
  via Better Auth; unauthenticated requests MUST receive HTTP 401.
- **FR-039**: All secrets MUST be provided via environment variables; they MUST NOT
  appear in source code, Dockerfiles, or version control.
- **FR-040**: All API error responses MUST return structured JSON:
  `{ "error": "<message>" }` with an appropriate HTTP status code.

#### Deployment

- **FR-041**: Backend MUST start with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  and be reachable at `https://web-production-7458d.up.railway.app/`.
- **FR-042**: Frontend MUST be deployed on Vercel with `NEXT_PUBLIC_API_URL` set to
  the Railway backend URL.
- **FR-043**: `GET /health` MUST return HTTP 200 with `{ "status": "ok" }`.

### Key Entities

- **Task**: Core unit of work. `id` (UUID), `user_id` (UUID), `title` (string),
  `description` (string, optional), `priority` (low | medium | high), `tags`
  (string array), `completed` (boolean), `created_at` (datetime), `updated_at`
  (datetime), `recurring_interval` (daily | weekly | monthly | null), `reminder_at`
  (datetime, optional).

- **ChatMessage**: A single conversation turn. `id` (UUID), `user_id` (UUID),
  `role` (user | assistant), `content` (string), `created_at` (datetime).

- **AuditEvent**: Immutable record of a task action. `id` (UUID), `event_type`
  (task_created | task_updated | task_deleted | task_completed), `task_id` (UUID),
  `user_id` (UUID), `timestamp` (datetime), `payload` (JSON task snapshot).

- **KafkaEvent**: Wire format for all published messages. `event_type` (string),
  `task_id` (UUID), `user_id` (UUID), `timestamp` (ISO 8601), `payload` (JSON object).

- **User**: Managed by Better Auth. `id` (UUID), `email`, `created_at`.

---

## API Definitions

### Task Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/health` | Service health check | No |
| GET | `/tasks` | List authenticated user's tasks | Yes |
| POST | `/tasks` | Create a new task | Yes |
| GET | `/tasks/{id}` | Retrieve task by ID | Yes |
| PUT | `/tasks/{id}` | Update task by ID | Yes |
| DELETE | `/tasks/{id}` | Delete task by ID | Yes |

### Chat Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/{user_id}/chat` | Send message to AI chatbot | Yes |
| GET | `/api/{user_id}/chat/history` | Retrieve conversation history | Yes |

### Query Parameters — GET /tasks

| Parameter | Type | Description |
|-----------|------|-------------|
| `completed` | boolean | Filter by completion status |
| `priority` | string | Filter: low / medium / high |
| `tag` | string | Filter by tag value |

### Task Request Body (POST / PUT)

```json
{
  "title": "string (required on create)",
  "description": "string (optional)",
  "priority": "low | medium | high (default: medium)",
  "tags": ["string"],
  "completed": "boolean (default: false)",
  "recurring_interval": "daily | weekly | monthly | null",
  "reminder_at": "ISO 8601 datetime (optional, must be future)"
}
```

### Error Response Format

```json
{ "error": "Human-readable error message" }
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong user) |
| 404 | Task not found |
| 422 | Unprocessable entity |
| 500 | Internal server error |

---

## Event Schema Definitions

All events published to any Kafka topic MUST use this canonical format:

```json
{
  "event_type": "task_created | task_updated | task_deleted | task_completed | task_reminded",
  "task_id": "UUID",
  "user_id": "UUID",
  "timestamp": "ISO 8601 datetime",
  "payload": {
    "task_id": "UUID",
    "title": "string",
    "priority": "low | medium | high",
    "completed": "boolean",
    "reminder_at": "ISO 8601 datetime or null",
    "recurring_interval": "daily | weekly | monthly | null"
  }
}
```

### Topic → Event Type Mapping

| Topic | Event Types |
|-------|-------------|
| `task-events` | `task_created`, `task_updated`, `task_deleted`, `task_completed` |
| `task-reminders` | `task_reminded` |
| `audit-events` | `task_created`, `task_updated`, `task_deleted`, `task_completed` |

---

## AI Chatbot Workflow

```
User Message
    │
    ▼
[Intent & Entity Extraction] ← Cohere API
    │
    ├── create_task  → title, priority, tags, reminder_at
    ├── update_task  → task_id or title, updated fields
    ├── delete_task  → task_id or title
    ├── complete_task → task_id or title
    └── list_tasks   → filters (priority, status)
         │
         ▼
[Ambiguity Check]
    ├── Missing required entity? → Ask clarifying question → Wait
    └── All entities resolved?   → Proceed
         │
         ▼
[Task Operation] ← Backend API endpoint
    ├── Success → Publish Kafka event → Compose confirmation
    └── Error   → Log → Return user-friendly message
         │
         ▼
[Conversation Persistence] → Dapr state store
    │
    ▼
[Response Generation] ← Cohere API
    │
    ▼
User sees natural language confirmation
```

### Intent → API Mapping

| Intent | API Call |
|--------|----------|
| `create_task` | `POST /tasks` |
| `update_task` | `PUT /tasks/{id}` |
| `delete_task` | `DELETE /tasks/{id}` |
| `complete_task` | `PUT /tasks/{id}` with `{ "completed": true }` |
| `list_tasks` | `GET /tasks` with extracted filters |

---

## Frontend Component Structure

```
frontend/
├── app/
│   ├── page.tsx                      # Landing / redirect to dashboard
│   ├── dashboard/page.tsx            # Task dashboard (list + filters)
│   ├── tasks/new/page.tsx            # Task creation form
│   ├── tasks/[id]/edit/page.tsx      # Task edit form
│   └── layout.tsx                    # Root layout (auth + chatbot injected)
│
├── components/
│   ├── tasks/
│   │   ├── TaskCard.tsx              # Single task display with actions
│   │   ├── TaskList.tsx              # Filtered task list
│   │   ├── TaskForm.tsx              # Shared create/edit form
│   │   └── TaskFilters.tsx           # Priority/status filter bar
│   │
│   ├── chatbot/
│   │   ├── ChatbotIcon.tsx           # Floating action button (bottom-right)
│   │   ├── ChatWindow.tsx            # Expandable chat panel
│   │   ├── ChatMessage.tsx           # Single message bubble (user/assistant)
│   │   └── ChatInput.tsx             # Text input + send button
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Badge.tsx                 # Priority / tag / status badges
│
├── lib/
│   ├── api.ts                        # Centralized API client (NEXT_PUBLIC_API_URL)
│   └── auth.ts                       # Better Auth client helpers
│
└── hooks/
    ├── useTasks.ts                    # Task CRUD + state hooks
    └── useChat.ts                     # Chatbot session management
```

### Chatbot UI Behaviour

- A floating icon is visible on all authenticated pages (bottom-right corner).
- Clicking opens a slide-up chat panel (mobile) or side panel (desktop).
- The panel shows conversation history, most recent at bottom, auto-scrolled.
- A text input and send button accept free-text messages.
- Each assistant response confirms the action with task details.
- Panel closes on second icon click or Escape key.

---

## Deployment Configuration

### Backend (Railway)

| Setting | Value |
|---------|-------|
| Platform | Railway |
| Production URL | `https://web-production-7458d.up.railway.app/` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health endpoint | `GET /health` → HTTP 200 `{ "status": "ok" }` |
| Local Dapr run | `dapr run --app-id todo-backend` |

### Frontend (Vercel)

| Setting | Value |
|---------|-------|
| Platform | Vercel |
| Framework | Next.js |
| Env variable | `NEXT_PUBLIC_API_URL=https://web-production-7458d.up.railway.app/` |

### Required Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `COHERE_API_KEY` | Backend | Cohere API for chat + embeddings |
| `DATABASE_URL` | Backend | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Backend | Session signing secret |
| `REDPANDA_BOOTSTRAP_SERVERS` | Backend | Kafka broker address |
| `REDPANDA_USERNAME` | Backend | SASL username |
| `REDPANDA_PASSWORD` | Backend | SASL password |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend base URL |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create, view, edit, delete, and complete tasks entirely
  through the dashboard within 2 seconds of each action, without page reload.
- **SC-002**: Users can perform all 5 core task operations through the chatbot using
  natural language, with zero dashboard form interaction required.
- **SC-003**: 95% of valid chatbot messages produce a correct intent match and
  successfully execute the associated task operation.
- **SC-004**: Reminder notifications appear in the chatbot interface within 60 seconds
  of the scheduled `reminder_at` time.
- **SC-005**: Completing a recurring task generates the next instance within 5 seconds,
  with the correct next due date calculated automatically.
- **SC-006**: Every task state change produces an audit record retrievable by `user_id`
  and time range; zero audit events are lost under normal operating conditions.
- **SC-007**: All 5 event types (`task_created`, `task_updated`, `task_deleted`,
  `task_completed`, `task_reminded`) are observable in Redpanda after corresponding
  user actions.
- **SC-008**: The frontend task dashboard loads in under 3 seconds on a standard
  broadband connection.
- **SC-009**: All frontend API requests reach the Railway backend through
  `NEXT_PUBLIC_API_URL` with no hard-coded URLs in source code.
- **SC-010**: Zero secrets appear in the source repository, build artifacts, or
  container images; all verified via environment variable inspection.

---

## Assumptions

- Authentication (signup/login) is handled by Better Auth from Phase III/IV; this
  spec does not re-specify auth flows.
- The Neon PostgreSQL schema already contains a `tasks` table; this spec extends it
  with `recurring_interval` and `reminder_at` columns via idempotent migrations.
- Dapr is available in the runtime environment; this spec adds pub/sub and Jobs
  building blocks.
- Redpanda Cloud credentials and topic creation are managed outside this spec;
  the 3 required topics (`task-events`, `task-reminders`, `audit-events`) must
  already exist or be created in Redpanda Console.
- Conversation history is stored in Dapr state store scoped to the session; no
  long-term chat history database table is required for Phase V.
- Priority defaults to `medium` when not specified.
- The chatbot operates in English only.

---

## Scope Boundaries

### In Scope

- Task CRUD with tags, priority, `reminder_at`, `recurring_interval`
- AI chatbot with Cohere for all 5 task intents
- Task reminders via Dapr Jobs → `task-reminders` topic
- Recurring tasks (daily, weekly, monthly) auto-generation on completion
- Audit logging to `audit-events` topic and database table
- Event publishing via Dapr pub/sub to Redpanda (3 topics)
- Next.js frontend: task dashboard + chatbot UI
- Backend on Railway; frontend on Vercel
- Better Auth session authentication
- Structured error responses

### Out of Scope

- Push notifications (browser/mobile) — reminder is chatbot-internal only
- Task sharing between users
- File attachments on tasks
- Sub-tasks or task hierarchies
- Multi-language chatbot support
- Long-term chat history persistence in the database
- Real-time dashboard updates via WebSocket
- Admin or operator UI
- Billing or subscription features
