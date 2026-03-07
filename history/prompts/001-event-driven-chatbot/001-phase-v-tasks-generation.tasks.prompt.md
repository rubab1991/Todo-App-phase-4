---
id: "001"
title: "Phase V Tasks Generation"
stage: tasks
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 001-event-driven-chatbot
branch: 001-event-driven-chatbot
user: rubab_bukhari
command: sp.tasks
labels: ["tasks", "phase-v", "event-driven", "dapr", "redpanda", "recurring-tasks", "reminders", "real-time", "kubernetes"]
links:
  spec: specs/001-event-driven-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-event-driven-chatbot/tasks.md
tests: []
---

## Prompt

/sp.tasks
Phase V Tasks – Todo App (Claude Ready)

Objective:
Complete Phase V Todo App implementation using Claude Code, following the constitution, with all features, event-driven architecture, Dapr integration, Redpanda credentials, Render deployment, and Minikube local testing.

1️⃣ Frontend (Next.js → Vercel): Scaffold, Task UI CRUD, real-time updates, Dapr service invocation, WebSocket/Dapr PubSub, Dapr state store, Vercel deploy.

2️⃣ Backend (FastAPI → Render): Scaffold, Task CRUD, Recurring Task Engine (subscribe task-events, auto-create next occurrences), Reminder/Notification Service (subscribe reminders, Dapr Jobs API), Audit/Activity Log (subscribe task-events), Dapr Pub/Sub (task-events, reminders, task-updates), Dapr Jobs API, Dapr Secrets API, Render deploy.

3️⃣ Redpanda Cloud: Create topics task-events, reminders, task-updates. Producer publishes all task ops. Secure credentials via Dapr.

4️⃣ Dapr Integration: Pub/Sub (Redpanda), State Store, Service Invocation, Jobs API, Secrets Management.

5️⃣ Kubernetes (Minikube): Deploy backend/frontend/Dapr sidecars, verify pub/sub, test scheduled reminders, verify recurring tasks, verify real-time sync, validate secrets.

6️⃣ Testing & Verification: CRUD, recurring tasks, reminders, audit logs, real-time sync, secure credentials.

7️⃣ Submission: GitHub repo with /specs, CLAUDE.md, README.md, Minikube instructions, Vercel+Render URLs, demo video.

## Response

Generated `specs/001-event-driven-chatbot/tasks.md` with 80 tasks across 10 phases:

**Phase 1 – Setup (T001–T008, 8 tasks)**: Verify project scaffolding, install websockets, confirm Dapr/Minikube toolchain, scaffold recurring engine, create render.yaml and vercel.json.

**Phase 2 – Foundational (T009–T017, 9 tasks)**: DB migration for new columns (tags, recurring_interval, reminder_at), K8s secrets apply, Redis + Dapr components deploy, verify graceful Dapr-unavailable paths.

**Phase 3 – US1 Priority & Tags (T018–T026, 9 tasks)**: Tag normalisation utility, intent analyzer tag/priority extraction, task executor updates, frontend TaskForm tags input, TaskCard priority badge, types update.

**Phase 4 – US2 Search & Filter (T027–T033, 7 tasks)**: Intent analyzer search/filter parsing, task executor search call, "no results" response composer, frontend filter controls, search bar, api-client query params.

**Phase 5 – US3 Sorting (T034–T037, 4 tasks)**: Intent analyzer sort extraction, task executor sort params, frontend sort controls.

**Phase 6 – US4 Due Dates & Reminders (T038–T046, 9 tasks)**: reminder_at validation (must be future), intent analyzer date parsing, task executor date fields, frontend datetime pickers, overdue visual distinction.

**Phase 7 – US5 Recurring Tasks (T047–T055, 9 tasks)**: compute_next_due_date() in recurring_engine.py, handle_recurring_task_completion(), events.py integration, delete safeguard, intent analyzer recurrence patterns, frontend interval selector.

**Phase 8 – US6 Real-Time (T056–T061, 6 tasks)**: Verify WebSocket endpoint, events.py broadcast, WS reconnect + state refetch, keepalive tuning, Minikube smoke test.

**Phase 9 – Infrastructure & Deployment (T062–T072, 11 tasks)**: render.yaml, vercel.json, AuditLog model + service, Dapr secrets API integration, Docker build, full Minikube deploy, Redpanda topic verify, Render + Vercel deploy.

**Phase 10 – Polish (T073–T080, 8 tasks)**: Tag edge cases, event failure logging, reminder rejection message, empty search, README, Minikube judge docs, e2e smoke test, CLAUDE.md update.

Total: 80 tasks, 34 parallelizable. MVP = Phase 1–3 (US1). Dependency graph included.

## Outcome

- `specs/001-event-driven-chatbot/tasks.md` created at 80 tasks
- All tasks follow `- [ ] TXXX [P?] [USN?] Description file/path` format
- Dependency graph maps US1→US2→US3 and US4→US5, US6 independent
- MVP scope: Phases 1–3 (Priority & Tags end-to-end)
- 34 parallel opportunities identified across all phases
