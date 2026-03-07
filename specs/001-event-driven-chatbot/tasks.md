# Tasks: Phase V – Advanced Event-Driven Todo Chatbot System

**Feature Branch**: `001-event-driven-chatbot`
**Input**: Design documents from `/specs/001-event-driven-chatbot/`
**Prerequisites**: spec.md (6 user stories P1–P6), Phase V constitution
**Generated**: 2026-03-07

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label [US1]–[US6]
- File paths relative to repo root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify all scaffolding is in place; install missing dependencies; ensure Dapr + Minikube toolchain is ready.

- [x] T001 Verify Python backend structure exists at `backend/src/` with `models/`, `routes/`, `services/`, `agents/`, `api/` subdirectories
- [x] T002 [P] Add `websockets==12.0` to `backend/requirements.txt` and reinstall via `pip install -r backend/requirements.txt`
- [x] T003 [P] Verify Node.js frontend at `frontend/` with `app/`, `components/tasks/`, `lib/`, `types/` directories
- [x] T004 [P] Confirm Dapr CLI is installed (`dapr --version`) and Minikube is available (`minikube version`)
- [x] T005 [P] Create `backend/src/utils/__init__.py` if missing and add `backend/src/utils/tags.py` tag normalisation utility (lowercase, trim, deduplicate)
- [x] T006 [P] Create `backend/src/services/recurring_engine.py` file scaffold with module docstring and imports placeholder
- [x] T007 [P] Create Render deployment manifest at `infra/render/render.yaml` with service definition for FastAPI backend
- [x] T008 [P] Create Vercel deployment config at `frontend/vercel.json` with build output, environment variable declarations

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema current, Dapr components deployed, K8s secrets applied. Nothing in Phase 3+ can run until these pass.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T009 Write Alembic (or SQLModel `create_db_and_tables`) migration to add columns `tags TEXT`, `recurring_interval TEXT`, `reminder_at TEXT` to `tasks` table in Neon DB — verify via `backend/src/db.py` `create_db_and_tables` call
- [x] T010 Apply K8s secrets to Minikube cluster: `kubectl apply -f infra/k8s/secrets.yaml` — verify `kubectl get secret redpanda-secrets -n todo`
- [x] T011 [P] Deploy Redis state store to Minikube: `kubectl apply -f infra/k8s/redis.yaml` — verify pod running in `todo` namespace
- [x] T012 Deploy Dapr components: `kubectl apply -f infra/dapr/components/` — verify `dapr components -k -n todo` lists `kafka-pubsub`, `statestore`, `kubernetes`
- [x] T013 [P] Apply Dapr configuration: `kubectl apply -f infra/k8s/dapr-config.yaml`
- [x] T014 Verify Dapr `/dapr/subscribe` endpoint is reachable by starting backend locally (`uvicorn src.api.main:app`) and `GET /dapr/subscribe` returns 3 topic entries
- [x] T015 [P] Verify `backend/src/services/event_publisher.py` `publish_task_event()` gracefully skips when Dapr sidecar is unavailable (ConnectError path)
- [x] T016 [P] Verify `backend/src/services/dapr_jobs.py` `schedule_reminder()` gracefully skips when Dapr sidecar unavailable
- [x] T017 Add `DAPR_HTTP_PORT` and `DAPR_APP_ID` to `backend/.env.example` with documented defaults

**Checkpoint**: DB schema current, Dapr components live in cluster, secrets applied — user story work can now begin.

---

## Phase 3: User Story 1 – Task Priority and Tagging (Priority: P1) 🎯 MVP

**Goal**: Users can create, update, and retrieve tasks with priority levels (Low/Medium/High) and free-form tags. Tags are normalised (lowercase, trimmed, deduplicated).

**Independent Test**: Create a task via chatbot "Create a high-priority task: submit report, tagged Work and urgent." — verify DB record has `priority="high"` and `tags='["work","urgent"]'`. Then request "show all high-priority tasks" and confirm only high tasks returned.

### Implementation for User Story 1

- [x] T018 [P] [US1] Implement tag normalisation in `backend/src/utils/tags.py`: `normalise_tags(tags: list[str]) -> list[str]` — lowercase, strip whitespace, deduplicate, sort
- [x] T019 [US1] Apply `normalise_tags()` in `backend/src/routes/tasks.py` `_encode_tags()` helper and in `create_task` / `update_task` endpoints
- [x] T020 [US1] Extend `backend/src/agents/intent_analyzer.py` to extract `priority` ("high"/"medium"/"low" keywords) and `tags` (words after "tagged" or "tag:" or "#word") from user messages
- [x] T021 [US1] Update `backend/src/agents/task_executor.py` `add_task` branch to pass `priority` and `tags` extracted from intent result to the task creation API call
- [x] T022 [US1] Update `backend/src/agents/task_executor.py` `update_task` branch to pass `priority` and `tags` when present in intent result
- [x] T023 [P] [US1] Update `frontend/components/tasks/task-form.tsx` to add tags input (comma-separated chips) and priority dropdown — emit `tags: string[]` and `priority` in `taskData`
- [x] T024 [P] [US1] Update `frontend/components/tasks/task-card.tsx` to display priority badge (colour-coded: red=high, yellow=medium, green=low) and tag chips
- [x] T025 [P] [US1] Update `frontend/types/index.ts` `Task` interface to include `tags: string[]`, `recurringInterval?: string | null`, `reminderAt?: string | null`
- [x] T026 [US1] Update `frontend/lib/api-client.ts` task creation and update functions to include `tags` and `priority` fields in request body

**Checkpoint**: Priority + tags round-trip end-to-end (chatbot → backend → DB → frontend display).

---

## Phase 4: User Story 2 – Search and Filtering (Priority: P2)

**Goal**: Users can search tasks by keyword and filter by priority, tag, and completion status through both the chatbot and the task list UI.

**Independent Test**: Populate 5 tasks with mixed titles/tags/priorities, then send "show all high-priority tasks tagged work" — verify only matching tasks are returned. Send "search grocery" — verify keyword match. Send a filter with no matches — verify "no matching tasks" message.

### Implementation for User Story 2

- [x] T027 [US2] Extend `backend/src/agents/intent_analyzer.py` to detect `search_tasks` intent — extract `search_query`, `filter_priority`, `filter_tag`, `filter_status` from natural language
- [x] T028 [US2] Add `search_tasks` handler in `backend/src/agents/task_executor.py` that calls `GET /{user_id}/tasks?search=&priority=&tag=&status=` with extracted params
- [x] T029 [US2] Update `backend/src/agents/response_composer.py` to handle empty results: return "No tasks found matching your criteria." message
- [x] T030 [P] [US2] Update `frontend/components/tasks/filter-controls.tsx` to add tag filter input, priority filter dropdown, and status toggle (all/active/completed)
- [x] T031 [P] [US2] Add search bar component in `frontend/app/tasks/page.tsx` that passes `search` query param to `taskApi.getAllTasks()`
- [x] T032 [US2] Update `frontend/lib/api-client.ts` `getAllTasks()` to accept and forward `search`, `priority`, `tag`, `status` query params to backend
- [x] T033 [US2] Add "no results" empty state to `frontend/components/tasks/task-list.tsx` when filtered `tasks.length === 0`

**Checkpoint**: Search "grocery" returns only matching tasks; filter by tag "work" returns only tagged tasks; empty results shows friendly message.

---

## Phase 5: User Story 3 – Task Sorting (Priority: P3)

**Goal**: Users can sort their task list by due date, priority, or creation date in ascending or descending order via chatbot command or UI controls.

**Independent Test**: Create 3 tasks with different priorities. Request "sort by priority descending" — verify High appears first. Request "sort by due date ascending" — verify nearest date first.

### Implementation for User Story 3

- [x] T034 [US3] Extend `backend/src/agents/intent_analyzer.py` to detect sort instructions — extract `sort_by` ("priority"/"due_date"/"created_at") and `sort_order` ("asc"/"desc") from phrases like "sorted by due date", "by priority descending"
- [x] T035 [US3] Update `backend/src/agents/task_executor.py` `list_tasks` handler to pass `sort_by` and `sort_order` params when present in intent result
- [x] T036 [P] [US3] Update `frontend/components/tasks/filter-controls.tsx` to add sort-by dropdown (Due Date / Priority / Created) and sort-order toggle (Asc/Desc)
- [x] T037 [US3] Update `frontend/app/tasks/page.tsx` to propagate `sortBy` and `sortOrder` state to `taskApi.getAllTasks()` call

**Checkpoint**: Clicking "Sort by Priority ↓" in UI returns tasks High→Medium→Low; chatbot "list by due date" returns nearest first.

---

## Phase 6: User Story 4 – Due Dates and Reminders (Priority: P4)

**Goal**: Users can attach a due date and a reminder time to tasks. Reminders fire at the scheduled time via Dapr Jobs API. Overdue tasks are visually distinguished. Past-due reminder input is rejected.

**Independent Test**: Create task "file taxes, due 2026-04-15, remind me 2026-04-10T09:00:00Z". Verify Dapr job is scheduled (`dapr jobs get reminder-<id>-<user> -k`). Verify `reminderAt` field persists on task. Set a past reminder time — verify chatbot rejects it with an error message.

### Implementation for User Story 4

- [x] T038 [US4] Add `validate_reminder_at()` in `backend/src/utils/validation.py`: reject datetimes in the past; return descriptive error message
- [x] T039 [US4] Call `validate_reminder_at()` in `backend/src/routes/tasks.py` `create_task` and `update_task` before persisting `reminder_at`
- [x] T040 [US4] Extend `backend/src/agents/intent_analyzer.py` to parse date/time expressions for `due_date` and `reminder_at` — support ISO format, "April 15th", "tomorrow 9am", relative expressions
- [x] T041 [US4] Update `backend/src/agents/task_executor.py` to pass `dueDate` and `reminderAt` in task creation/update calls; surface validation errors back to chatbot response
- [x] T042 [US4] Confirm `backend/src/routes/tasks.py` `toggle_task_completion` calls `cancel_reminder()` when task is marked complete (already implemented — verify logic)
- [x] T043 [US4] Confirm `backend/src/routes/tasks.py` `delete_task` calls `cancel_reminder()` before deleting (already implemented — verify logic)
- [x] T044 [P] [US4] Update `frontend/components/tasks/task-form.tsx` to add `datetime-local` input for due date and separate `datetime-local` input for reminder time
- [x] T045 [P] [US4] Update `frontend/components/tasks/task-card.tsx` to highlight overdue tasks in red/amber if `dueDate` is in the past and task is not complete
- [x] T046 [US4] Update `frontend/lib/api-client.ts` task create/update functions to include `reminderAt` field in request payload

**Checkpoint**: Create task with future reminder → Dapr job appears. Complete task → Dapr job cancelled. Overdue task shows red badge in UI.

---

## Phase 7: User Story 5 – Recurring Tasks (Priority: P5)

**Goal**: Completing a recurring task automatically spawns the next instance with the correct computed due date. Supports daily, weekly, and monthly cadences. Works even without a due date.

**Independent Test**: Create daily recurring task "team standup" due 2026-03-10. Mark complete. Verify a new task "team standup" is created with due date 2026-03-11 and same `recurringInterval`. Repeat for weekly and monthly.

### Implementation for User Story 5

- [x] T047 [US5] Implement `compute_next_due_date(current_due: str | None, interval: str, created_at: datetime) -> str` in `backend/src/services/recurring_engine.py` — handle daily (+1 day), weekly (+7 days), monthly (same day next month), and None due_date (use today + interval)
- [x] T048 [US5] Implement `handle_recurring_task_completion(task_data: dict) -> dict | None` in `backend/src/services/recurring_engine.py` — if `recurring_interval` set and event_type is `task.updated` with `isComplete=true`, create next instance via internal API call
- [x] T049 [US5] Update `backend/src/routes/events.py` `handle_task_events()` to call `handle_recurring_task_completion()` when `event_type == "task.updated"` and task `isComplete` is true
- [x] T050 [US5] Add safeguard in `backend/src/services/recurring_engine.py`: if task was explicitly deleted (`event_type == "task.deleted"`), do NOT create next instance
- [x] T051 [US5] Extend `backend/src/agents/intent_analyzer.py` to detect recurrence patterns — extract `recurringInterval` from phrases: "every day", "daily", "every week", "weekly", "every month", "monthly"
- [x] T052 [US5] Update `backend/src/agents/task_executor.py` `add_task` branch to include `recurringInterval` in task creation payload
- [x] T053 [P] [US5] Update `frontend/components/tasks/task-form.tsx` to add recurring interval selector (None / Daily / Weekly / Monthly) emitting `recurringInterval` in `taskData`
- [x] T054 [P] [US5] Update `frontend/components/tasks/task-card.tsx` to display a recurrence indicator icon/badge when `recurringInterval` is set
- [x] T055 [US5] Update `frontend/lib/api-client.ts` task create/update to include `recurringInterval` field

**Checkpoint**: Complete a daily recurring task → within 10 seconds a new instance appears in the task list with next due date.

---

## Phase 8: User Story 6 – Real-Time Multi-Client Updates (Priority: P6)

**Goal**: Task changes made on one client appear on all other connected clients of the same user within 3 seconds, without manual refresh. Reconnecting clients receive current state.

**Independent Test**: Open two browser tabs for the same user. Create a task in Tab A → Tab B updates within 3 seconds. Complete a task in Tab B → Tab A reflects it. Close and reopen Tab B → task list is current.

### Implementation for User Story 6

- [x] T056 [US6] Verify `backend/src/routes/websocket.py` `/ws/{user_id}` endpoint is registered in `backend/src/api/main.py` and accessible
- [x] T057 [US6] Verify `backend/src/routes/events.py` `handle_task_updates()` broadcasts to `ws_manager.broadcast_to_user()` on every task-updates event
- [x] T058 [US6] Update `frontend/lib/websocket-client.ts` reconnect handler: on reconnect, dispatch a `ws-reconnected` CustomEvent so the page can trigger a full task refetch
- [x] T059 [US6] Update `frontend/app/tasks/page.tsx` WebSocket `useEffect` to listen for `ws-reconnected` event and call `fetchTasks()` to restore current state after reconnection
- [x] T060 [P] [US6] Update `frontend/lib/websocket-client.ts` keepalive ping interval to 25 seconds to stay within most proxy/load-balancer idle timeouts
- [ ] T061 [US6] Add Minikube validation step in `infra/scripts/deploy-phase5.sh` to open 2 curl WebSocket connections and verify broadcast reaches both (smoke test)

**Checkpoint**: Two browser sessions show same task list; create in one → other updates within 3s; reload updates to current state.

---

## Phase 9: Infrastructure, Deployment & Audit

**Purpose**: All services deployed to production targets; audit log operational; secrets fetched via Dapr; documentation complete.

- [x] T062 Create `infra/render/render.yaml` with `services` entry: `type: web`, `name: todo-backend`, `env: python`, `buildCommand: pip install -r requirements.txt`, `startCommand: uvicorn src.api.main:app --host 0.0.0.0 --port $PORT`, `envVars` referencing Render environment secrets
- [x] T063 [P] Create `frontend/vercel.json` with `buildCommand: npm run build`, `outputDirectory: .next`, `env` keys for `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_WS_URL`
- [x] T064 Implement audit log DB model `AuditLog` in `backend/src/models/audit_log.py` (id, event_type, task_id, user_id, snapshot JSON, created_at) — add to `create_db_and_tables`
- [x] T065 [P] Implement `backend/src/services/audit_service.py` `record_event(event_data: dict)` — persist `AuditLog` entry from task-events Dapr subscription
- [x] T066 Update `backend/src/routes/events.py` `handle_task_events()` to call `audit_service.record_event()` for every incoming task event
- [x] T067 [P] Add Dapr Secrets API fetch in `backend/src/config.py`: attempt to load `NEON_DB_URL`, `COHERE_API_KEY` from Dapr secretstore `kubernetes` via `GET http://localhost:3500/v1.0/secrets/kubernetes/<key>`; fall back to env var if Dapr unavailable
- [ ] T068 Build and push Docker images to Minikube: run `infra/scripts/build-images.sh` (update image tag to `v2` in script)
- [ ] T069 Full Minikube deploy: run `infra/scripts/deploy-phase5.sh` — verify all pods `Running`, Dapr sidecars injected (`kubectl get pods -n todo`)
- [ ] T070 [P] Verify Redpanda topics exist (or auto-created): connect with `rpk topic list --brokers d6m3hgvjkk1fce8gkpfg.any.us-east-1.mpx.prd.cloud.redpanda.com:9092 --user red-panda --password co14fIOGrGltFe5wHSyH4ksaS16bpD --sasl-mechanism SCRAM-SHA-256 --tls-enabled`
- [ ] T071 Deploy backend to Render: push branch, verify Render auto-deploys using `render.yaml`; confirm `GET /health` returns `{"status":"healthy"}` on Render URL
- [ ] T072 Deploy frontend to Vercel: connect repo, set `NEXT_PUBLIC_API_BASE_URL` to Render backend URL; verify Vercel build succeeds and tasks page loads

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, error hardening, documentation, and submission artefacts.

- [x] T073 [P] Enforce tag normalisation edge cases in `backend/src/utils/tags.py`: empty string tags are dropped, tags longer than 50 chars are truncated, max 20 tags per task
- [x] T074 [P] Add event delivery failure logging in `backend/src/services/event_publisher.py`: log `WARNING` with task_id on failed publish; task operation continues (spec requires no rollback)
- [x] T075 Add reminder-in-past rejection to `backend/src/agents/response_composer.py`: surface `validate_reminder_at()` error as chatbot message "Reminder time must be in the future. Please provide a future date and time."
- [x] T076 [P] Add empty search query handling in `backend/src/routes/tasks.py`: if `search=""` treat as no search filter (return all — spec requires this)
- [ ] T077 [P] Write `README.md` at repo root with: architecture diagram (text), component list, Minikube setup steps, Vercel/Render deployment steps, Redpanda credential usage, Dapr secrets guide
- [ ] T078 [P] Write Minikube judge instructions in `docs/minikube-testing.md`: step-by-step commands to start cluster, apply manifests, run smoke tests for events/jobs/real-time sync
- [ ] T079 Run full end-to-end smoke test: CRUD → event flow → reminder trigger → recurring task spawn → real-time sync across 2 clients; document results in `docs/e2e-test-results.md`
- [ ] T080 [P] Update `CLAUDE.md` "Recent Changes" section to record Phase V additions: Dapr, Redpanda, WebSocket, recurring tasks, reminders, tags

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational) ← BLOCKS ALL USER STORIES
        ├─► Phase 3 (US1 – Priority & Tags) ← MVP
        │     └─► Phase 4 (US2 – Search & Filter) [depends on US1 metadata]
        │           └─► Phase 5 (US3 – Sorting) [depends on US1 metadata]
        ├─► Phase 6 (US4 – Due Dates & Reminders) [depends on US1 metadata]
        │     └─► Phase 7 (US5 – Recurring Tasks) [depends on US4 due dates + event pipeline]
        └─► Phase 8 (US6 – Real-Time) [depends on full event pipeline operational]
              └─► Phase 9 (Infrastructure & Deployment)
                    └─► Phase 10 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 – Priority & Tags | Phase 2 | US4, US6 backend |
| US2 – Search & Filter | US1 (needs tags/priority metadata) | US3 |
| US3 – Sorting | US1 (needs priority/due_date fields) | US2 |
| US4 – Due Dates & Reminders | US1 (needs task metadata model) | US1 frontend |
| US5 – Recurring Tasks | US4 (needs due_date), event pipeline | — |
| US6 – Real-Time Updates | Events pipeline (Phase 2 Dapr) | US1, US4 backend |

### Within Each User Story

- Backend models/services → routes → intent analyzer → task executor
- Frontend types → form/card components → page integration → api-client
- Core implementation before edge cases

### Parallel Opportunities

```bash
# Phase 2: Foundational — run in parallel
T010  # K8s secrets
T011  # Redis deploy
T013  # Dapr config
T015  # event_publisher graceful skip verify
T016  # dapr_jobs graceful skip verify

# Phase 3 (US1): parallel within story
T018  # tag normalisation utility
T023  # frontend TaskForm tags input
T024  # frontend TaskCard priority/tag display
T025  # frontend types update

# Phase 9: parallel deployment tasks
T062  # render.yaml
T063  # vercel.json
T064 → T065  # audit model + service
T070  # Redpanda topic verify
```

---

## Implementation Strategy

### MVP First (US1 Only — Estimated 1 session)

1. Complete Phase 1: Setup (T001–T008)
2. Complete Phase 2: Foundational (T009–T017) — **must fully pass**
3. Complete Phase 3: US1 Priority & Tags (T018–T026)
4. **STOP and VALIDATE**: Create tagged high-priority task via chatbot → appears in UI with badge
5. Deploy to Render + Vercel as MVP

### Incremental Delivery

```
MVP   → Phase 3 (US1)  → Tags + Priority end-to-end
v1.1  → Phase 4 (US2)  → Search + Filter functional
v1.2  → Phase 5 (US3)  → Sorting added
v1.3  → Phase 6 (US4)  → Due dates + Reminders fire
v1.4  → Phase 7 (US5)  → Recurring tasks auto-spawn
v1.5  → Phase 8 (US6)  → Real-time multi-client sync
v2.0  → Phase 9–10     → Full production deployment + docs
```

### Parallel Team Strategy

With 3 developers after Phase 2 completes:
- **Dev A**: US1 (T018–T026) → US2 (T027–T033)
- **Dev B**: US4 (T038–T046) → US5 (T047–T055)
- **Dev C**: US6 (T056–T061) → Phase 9 infrastructure

---

## Task Count Summary

| Phase | Tasks | Parallelizable |
|-------|-------|---------------|
| Phase 1: Setup | 8 (T001–T008) | 7 |
| Phase 2: Foundational | 9 (T009–T017) | 5 |
| Phase 3: US1 – Priority & Tags | 9 (T018–T026) | 4 |
| Phase 4: US2 – Search & Filter | 7 (T027–T033) | 2 |
| Phase 5: US3 – Sorting | 4 (T034–T037) | 1 |
| Phase 6: US4 – Due Dates & Reminders | 9 (T038–T046) | 2 |
| Phase 7: US5 – Recurring Tasks | 9 (T047–T055) | 2 |
| Phase 8: US6 – Real-Time Updates | 6 (T056–T061) | 1 |
| Phase 9: Infrastructure & Deployment | 11 (T062–T072) | 5 |
| Phase 10: Polish | 8 (T073–T080) | 5 |
| **TOTAL** | **80** | **34** |

---

## Notes

- Tasks marked ✓ in previous session: `event_publisher.py`, `websocket_manager.py`, `dapr_jobs.py`, `websocket.py`, `events.py`, `kafka-pubsub.yaml`, K8s manifests, `websocket-client.ts` — verify each before skipping
- `[P]` tasks touch different files and have no in-phase dependencies — safe to execute concurrently
- Tag normalisation (`T018`, `T019`) MUST precede any production data writes to avoid inconsistent tag formats
- Dapr sidecar unavailability MUST NOT fail task CRUD (event publish failures are advisory)
- Commit after each phase checkpoint for clean rollback points
