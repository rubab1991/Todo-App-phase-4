---
description: "Phase V – Event-Driven AI Todo Application implementation tasks"
---

# Tasks: Phase V – Event-Driven AI Todo Application

**Input**: Spec from `specs/001-phase-v-event-driven/spec.md`
**Prerequisites**: spec.md ✅ (plan.md generated inline from codebase analysis)
**Branch**: `001-phase-v-event-driven`

**Codebase state at task generation**:
- Backend: FastAPI on Railway — core CRUD, events, recurring, audit, chatbot agents **already implemented**
- Frontend: Next.js task dashboard (CRUD + WebSocket) **already implemented**; chatbot UI **not yet built**
- Gaps identified: topic naming alignment (`reminders` → `task-reminders`, missing `audit-events` publish),
  recurring engine field-name alignment, chatbot UI components, and env/deployment verification

**Organization**: Tasks are grouped by user story. Each story is independently testable.

---

## Phase 1: Setup — Backend Verification (Railway)

**Purpose**: Confirm the Railway deployment is healthy and all existing endpoints are reachable.

- [X] T001 Verify Railway backend health endpoint returns HTTP 200 at `https://web-production-7458d.up.railway.app/health` and inspect response `{"status": "healthy"}` — document result in `backend/src/api/main.py` comment if any fix needed
- [X] T002 Verify CORS middleware in `backend/src/api/main.py` includes the Vercel frontend origin (or `"*"`) so browser requests are not blocked
- [X] T003 [P] Verify environment variable loading in `backend/src/config.py` — confirm `COHERE_API_KEY`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `REDPANDA_BOOTSTRAP_SERVERS`, `REDPANDA_USERNAME`, `REDPANDA_PASSWORD` are all loaded; add any missing variable with a clear error if absent

**Checkpoint**: Railway backend is healthy, CORS is configured, all env vars are present.

---

## Phase 2: Event System Alignment (Redpanda)

**Purpose**: Align Kafka topic names with the spec (`task-reminders`, `audit-events`) and ensure
the canonical event schema (`event_type`, `task_id`, `user_id`, `timestamp`, `payload`) is
consistently used across all publishers.

- [X] T004 Update topic constant `TOPIC_REMINDERS = "reminders"` to `TOPIC_TASK_REMINDERS = "task-reminders"` in `backend/src/services/event_publisher.py` and update all callers to use the new constant name
- [X] T005 Add `TOPIC_AUDIT_EVENTS = "audit-events"` constant to `backend/src/services/event_publisher.py` and implement `publish_audit_event(event_type, task_data, user_id)` that publishes to the `audit-events` topic using the canonical schema
- [X] T006 Create `backend/src/events/schema.py` defining the canonical `TaskEvent` Pydantic model with fields: `event_type` (str), `task_id` (str), `user_id` (str), `timestamp` (str ISO 8601), `payload` (dict)
- [X] T007 Update `backend/src/routes/events.py` Dapr subscription declaration: rename `"reminders"` subscription topic to `"task-reminders"` and update route path from `/dapr/events/reminders` to `/dapr/events/task-reminders`
- [X] T008 Update reminder event handler in `backend/src/routes/events.py` — rename `handle_reminders` to `handle_task_reminders` and change the route decorator to `@router.post("/events/task-reminders")`
- [X] T009 Call `publish_audit_event` from `backend/src/routes/tasks.py` in `create_task`, `update_task`, `delete_task`, and `toggle_task_completion` handlers so audit events are published to the `audit-events` topic in addition to the existing DB write

**Checkpoint**: All three topics (`task-events`, `task-reminders`, `audit-events`) receive events.
Verify in Redpanda Console after creating and completing a task.

---

## Phase 3: Recurring Task Engine

**Purpose**: Verify recurring task engine works end-to-end with the correct field names from
the task dict produced by `_task_to_dict`.

- [X] T010 Audit field name usage in `backend/src/services/recurring_engine.py` — `handle_recurring_task_completion` currently reads `isComplete`, `recurringInterval`, `userId`, `dueDate`, `createdAt`; confirm these match the camelCase keys returned by `_task_to_dict` in `backend/src/routes/tasks.py` and fix any mismatches
- [X] T011 Verify `compute_next_due_date` handles `None` `current_due` correctly by defaulting to the completion date (today); add a regression guard comment in `backend/src/services/recurring_engine.py`
- [X] T012 Verify `handle_recurring_task_completion` is invoked from the `task-events` consumer in `backend/src/routes/events.py` for `event_type == "task.updated"` with `isComplete == True`; fix conditional guard if needed
- [ ] T013 [P] Manual test: create a daily recurring task via `POST /api/{user_id}/tasks` with `{ "title": "Daily standup", "recurringInterval": "daily", "dueDate": "2026-03-10" }`, complete it via `PATCH /api/{user_id}/tasks/{id}/complete`, then `GET /api/{user_id}/tasks` and confirm a new task with `dueDate = 2026-03-11` exists

**Checkpoint**: Completing a recurring task automatically spawns the next instance.

---

## Phase 4: Reminder System

**Purpose**: Validate reminder timestamp rules and confirm Dapr Jobs API is wired to the
correct `task-reminders` topic after the topic rename in Phase 2.

- [X] T014 Verify `validate_reminder_at` in `backend/src/utils/validation.py` rejects past timestamps with a clear message and accepts future ones; ensure the function is called in both `create_task` and `update_task` in `backend/src/routes/tasks.py`
- [X] T015 Update `publish_reminder_event` call in `backend/src/routes/tasks.py` to use the renamed constant `TOPIC_TASK_REMINDERS` (after T004); confirm imports reference the updated constant
- [X] T016 Verify `schedule_reminder` in `backend/src/services/dapr_jobs.py` sets `APP_ID = os.getenv("DAPR_APP_ID", "todo-backend")` and the job callback route `/dapr/jobs/reminder` exists in `backend/src/routes/events.py`; fix if missing
- [ ] T017 [P] Manual test: create a task with `reminderAt` set 2 minutes in the future via `POST /api/{user_id}/tasks`; wait; confirm the WebSocket broadcasts a `type: "reminder"` message and a `task-reminders` event appears in Redpanda Console

**Checkpoint**: Reminders fire at the scheduled time and are visible to the user.

---

## Phase 5: Audit Log System

**Purpose**: Ensure every task action produces a persisted DB record AND a `audit-events`
Kafka message.

- [X] T018 Verify `record_event` in `backend/src/services/audit_service.py` correctly maps `event_data["task"]["id"]` to `task_id` for string IDs (the `_task_to_dict` produces string ids); add null-safe cast if needed
- [X] T019 Verify the `AuditLog` model in `backend/src/models/audit_log.py` has all required fields: `id`, `event_type`, `task_id`, `user_id`, `timestamp` (or `created_at`), `snapshot` (JSON payload); add any missing fields with an idempotent Alembic migration or SQLModel `create_all`
- [ ] T020 [P] Manual test: create and delete a task; query the audit_logs table directly (or via a temporary `GET /api/audit` debug endpoint) and confirm records exist for `task.created` and `task.deleted` events with correct `task_id` and `user_id`

**Checkpoint**: Audit DB records and `audit-events` Kafka messages exist for every task action.

---

## Phase 6: AI Chatbot — Backend

**Purpose**: Verify the chatbot pipeline (intent analysis → task execution → response) works
end-to-end against the Railway backend.

- [X] T021 [P] [US2] Verify `backend/src/agents/intent_analyzer.py` supports all 5 intents: `create_task`, `update_task`, `delete_task`, `complete_task`, `list_tasks`; add any missing intent with Cohere prompt update
- [X] T022 [P] [US2] Verify `backend/src/agents/task_executor.py` maps each intent to the correct backend API call; confirm `complete_task` calls `PATCH /{user_id}/tasks/{id}/complete` and not PUT
- [X] T023 [P] [US2] Verify `backend/src/agents/response_composer.py` generates a natural language confirmation that includes task title, status, and reminder/due date when relevant
- [X] T024 [US2] Verify `backend/src/api/chat_router.py` exposes `POST /api/{user_id}/chat` and `GET /api/{user_id}/chat/history`; confirm route is registered in `backend/src/api/main.py` under the `chat_router` include
- [ ] T025 [US2] Test chatbot end-to-end: `POST /api/{user_id}/chat` with `{ "message": "Create a task to buy groceries" }` and confirm response contains the task title confirmation and the task appears in `GET /api/{user_id}/tasks`

**Checkpoint**: Chatbot creates, lists, completes, and deletes tasks via natural language through the API.

---

## Phase 7: Frontend — Task Dashboard (US1)

**Purpose**: Verify the existing task dashboard is fully functional against the Railway backend.
Enhance reminder display for overdue tasks.

- [X] T026 [US1] Verify `frontend/.env.local` (or `frontend/.env`) contains `NEXT_PUBLIC_API_URL=https://web-production-7458d.up.railway.app/` and that `frontend/lib/api-client.ts` reads this variable; create/update `.env.local` if missing
- [ ] T027 [P] [US1] Verify `frontend/components/tasks/task-card.tsx` renders task title, description, priority badge, tags, due date, and reminder_at; add visual overdue indicator (e.g. red border) when `reminderAt` is in the past and `isComplete` is false
- [ ] T028 [P] [US1] Verify `frontend/components/tasks/task-form.tsx` includes fields for: title (required), description, priority select, tags input, due date picker, reminderAt datetime-local picker, and recurringInterval select; add any missing fields
- [ ] T029 [US1] Verify `frontend/components/tasks/filter-controls.tsx` supports filtering by status (all/active/completed), priority, and tag; confirm search input triggers re-fetch with backend query param
- [ ] T030 [US1] Run the frontend locally (`npm run dev` in `frontend/`) and manually test: create a task, edit it, mark complete, delete it — confirm each action reflects in the dashboard without full page reload

**Checkpoint**: Task dashboard fully functional with reminder/overdue display.

---

## Phase 8: Chatbot UI (US2)

**Purpose**: Build the floating chatbot icon and chat window; connect to the backend chat API.
This is the primary new frontend work.

- [X] T031 [US2] Create `frontend/lib/chatbot-api.ts` exporting `sendChatMessage(userId: string, message: string, token: string): Promise<{response: string}>` and `getChatHistory(userId: string, token: string): Promise<ChatMessage[]>` using `NEXT_PUBLIC_API_URL`
- [X] T032 [US2] Create `frontend/components/chatbot/chatbot-button.tsx` — a fixed-position (bottom-right) circular button that toggles chat window open/closed; use `useState` for open/closed state lifted from parent or use a context
- [X] T033 [US2] Create `frontend/components/chatbot/chat-message.tsx` — renders a single chat bubble; user messages right-aligned (purple), assistant messages left-aligned (white/gray); shows message content and timestamp
- [X] T034 [US2] Create `frontend/components/chatbot/chat-input.tsx` — text input + send button at the bottom of the chat panel; supports Enter key to send; disables during pending request; clears input on send
- [X] T035 [US2] Create `frontend/components/chatbot/chat-window.tsx` — expandable panel (slide-up on mobile, side panel on desktop) containing: conversation history (auto-scroll to bottom), `ChatInput`, and a close button; fetches chat history on mount using `getChatHistory`; appends new messages via `sendChatMessage`; dispatches `tasks-updated` window event after every assistant response so the task list refreshes
- [X] T036 [US2] Create `frontend/components/chatbot/chatbot-provider.tsx` — a client component wrapping `ChatbotButton` and `ChatWindow` together with shared open/close state; export as `ChatbotProvider`
- [X] T037 [US2] Add `<ChatbotProvider />` to `frontend/app/layout.tsx` so the chatbot icon appears on all authenticated pages (wrap in a conditional that only renders when user is authenticated using the auth session)
- [ ] T038 [US2] Manual test: open chatbot, type "Add a task called buy milk", confirm the task appears in the dashboard list, type "Mark buy milk complete", confirm the task shows as completed

**Checkpoint**: Chatbot UI is visible on all authenticated pages; natural language creates and manages tasks.

---

## Phase 9: Frontend Deployment (Vercel)

**Purpose**: Ensure frontend is correctly configured and deployable to Vercel.

- [X] T039 [P] Verify or create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=https://web-production-7458d.up.railway.app/`; confirm it is listed in `.gitignore` and is NOT committed to the repository
- [X] T040 [P] Verify `frontend/.env.example` (or similar) documents `NEXT_PUBLIC_API_URL` as a required variable for Vercel deployment configuration
- [X] T041 Run `npm run build` in `frontend/` and confirm zero TypeScript errors and a successful production build before Vercel deployment
- [ ] T042 Deploy frontend to Vercel: ensure `NEXT_PUBLIC_API_URL` is set as a Vercel environment variable in the Vercel project settings; confirm the deployed URL loads the dashboard and chatbot

**Checkpoint**: Frontend is live on Vercel; all API calls route to Railway backend.

---

## Phase 10: Final End-to-End Verification

**Purpose**: Full system smoke test across all 5 user stories.

- [ ] T043 [US1] Verify task CRUD from Vercel frontend: create task with reminder, edit title, mark complete, delete — confirm events appear in Redpanda Console for all 3 topics
- [ ] T044 [US2] Verify chatbot task creation from Vercel frontend: type "Create a high priority task to review PRs due tomorrow" — confirm task appears in dashboard with correct priority and due date
- [ ] T045 [US3] Verify reminder system: create a task with `reminderAt` 2 minutes in future from the UI; wait; confirm reminder notification appears in chatbot window and `task-reminders` event is in Redpanda Console
- [ ] T046 [US4] Verify recurring task engine: create a weekly recurring task, mark it complete; confirm a new task with due date +7 days is created automatically in the dashboard
- [ ] T047 [US5] Verify audit log: query audit_logs table (or `GET /api/audit` if implemented) and confirm entries for `task.created`, `task.updated`, `task.deleted`, and `task.completed` all contain correct `task_id`, `user_id`, and `timestamp`

**Checkpoint**: All 5 user stories pass end-to-end. Phase V complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Event Alignment)**: Depends on Phase 1 confirmation that backend is healthy
- **Phase 3 (Recurring)**: Depends on Phase 2 (topics must be correct before verifying recurring events)
- **Phase 4 (Reminders)**: Depends on Phase 2 (topic rename must be complete)
- **Phase 5 (Audit)**: Depends on Phase 2 (`audit-events` publish function must exist)
- **Phase 6 (Chatbot Backend)**: Depends on Phase 1 (Railway healthy); can run in parallel with Phases 3–5
- **Phase 7 (Frontend Dashboard)**: Depends on Phase 1 env var verification
- **Phase 8 (Chatbot UI)**: Depends on Phase 6 (chat API must work before building UI)
- **Phase 9 (Deployment)**: Depends on Phases 7 and 8 (both frontend systems must be working)
- **Phase 10 (Verification)**: Depends on all previous phases

### User Story Dependencies

- **US1 (Task CRUD)**: Phases 1 + 7 — independently testable via dashboard
- **US2 (Chatbot)**: Phases 6 + 8 — requires chatbot backend + UI both working
- **US3 (Reminders)**: Phases 2 + 4 — requires topic alignment
- **US4 (Recurring)**: Phases 2 + 3 — requires topic alignment and field-name fix
- **US5 (Audit)**: Phases 2 + 5 — requires audit-events publish

### Parallel Opportunities

- T003, T004–T009 can run in parallel (different files in Phase 2)
- T010–T013 (Phase 3) can run in parallel with T014–T017 (Phase 4) and T018–T020 (Phase 5)
- T021–T025 (Phase 6) can run in parallel with T026–T030 (Phase 7)
- T031–T038 (Phase 8) depends on Phase 6 being complete
- T039–T041 (Phase 9) can run in parallel after Phase 7 and 8

---

## Implementation Strategy

### MVP First (US1 — Task CRUD Dashboard)

1. Complete Phase 1 (verify Railway is healthy)
2. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` (T026)
3. Run frontend locally and test task CRUD (T030)
4. **STOP AND VALIDATE**: Task dashboard is fully operational

### Incremental Delivery

1. US1 complete → deploy dashboard to Vercel
2. Complete Phase 2 (event alignment) → verify topics in Redpanda Console
3. Complete Phase 6 (chatbot backend) → test chatbot API directly
4. Complete Phase 8 (chatbot UI) → chatbot visible on dashboard
5. Complete Phases 3–5 (recurring, reminders, audit) → full Phase V complete
6. Complete Phase 10 (E2E verification) → ship

---

## Notes

- `[P]` = task can run in parallel with other `[P]` tasks in the same phase
- `[USN]` = maps task to User Story N for traceability
- Most backend services already exist; the majority of backend tasks are **verification + gap fixes**
- The primary new implementation work is **Phase 8 (Chatbot UI)** — all 8 chatbot component files
- Always run `npm run build` before Vercel deploy to catch TypeScript errors early
- After any topic rename, verify Dapr component YAML under `dapr-components/` also uses `task-reminders`
