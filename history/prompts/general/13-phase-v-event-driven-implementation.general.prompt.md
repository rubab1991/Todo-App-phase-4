---
id: "013"
title: "Phase V Event-Driven Implementation"
stage: green
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 001-event-driven-chatbot
branch: 001-event-driven-chatbot
user: rubab_bukhari
command: manual
labels: ["event-driven", "dapr", "redpanda", "kafka", "websocket", "kubernetes", "phase-v"]
links:
  spec: specs/001-event-driven-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/models/task.py
  - backend/src/services/event_publisher.py
  - backend/src/services/websocket_manager.py
  - backend/src/services/dapr_jobs.py
  - backend/src/routes/tasks.py
  - backend/src/routes/websocket.py
  - backend/src/routes/events.py
  - backend/src/api/main.py
  - backend/requirements.txt
  - frontend/lib/websocket-client.ts
  - frontend/types/index.ts
  - frontend/app/tasks/page.tsx
  - infra/dapr/components/kafka-pubsub.yaml
  - infra/dapr/components/statestore.yaml
  - infra/dapr/components/secretstore.yaml
  - infra/k8s/namespace.yaml
  - infra/k8s/secrets.yaml
  - infra/k8s/backend-deployment.yaml
  - infra/k8s/frontend-deployment.yaml
  - infra/k8s/dapr-config.yaml
  - infra/k8s/redis.yaml
  - infra/helm/todo-backend/templates/deployment.yaml
  - infra/helm/todo-backend/values.yaml
  - infra/scripts/deploy-phase5.sh
tests:
  - backend/tests/integration/test_concurrent_users.py
  - backend/tests/integration/test_conversation_persistence.py
  - backend/tests/integration/test_intent_detection.py
---

## Prompt

Phase V Constitution – Todo App (Claude Ready)

Objective: Automate the complete Phase V Todo App implementation using Claude Code with:
- Frontend: Next.js → Vercel
- Backend: FastAPI → Render
- Event Streaming: Redpanda Cloud (Kafka compatible)
- Runtime: Dapr
- Kubernetes: Minikube (local)

The app must include Intermediate and Advanced features, event-driven architecture, and real-time updates, while securely integrating provided credentials.

Full constitution provided including Redpanda Cloud credentials, Render API key, Dapr component definitions, functional requirements (task priorities, tags, search/filter/sort, recurring tasks, due dates/reminders, event-driven notifications, real-time sync), and deployment targets.

## Response

Implemented complete Phase V event-driven architecture:

**Backend:**
- `task.py` model: added `tags` (JSON string), `recurring_interval`, `reminder_at` fields
- `event_publisher.py`: Dapr pub/sub HTTP client — publishes to task-events, task-updates, reminders topics on Redpanda Cloud
- `websocket_manager.py`: per-user WebSocket connection pool for real-time broadcasting
- `dapr_jobs.py`: Dapr Jobs API HTTP client for scheduling/cancelling reminders
- `tasks.py`: full rewrite with search/filter/sort query params, event publishing on all CRUD ops, Dapr job scheduling for reminders, tags encoding/decoding
- `websocket.py`: `/ws/{user_id}` WebSocket endpoint with keepalive
- `events.py`: Dapr `/dapr/subscribe` declaration + topic handlers (task-updates → WS broadcast, reminders → WS push, task-events → audit log, jobs/reminder → job callback)
- `main.py`: wired up ws_router, events_router alongside existing routes
- `requirements.txt`: added `websockets==12.0`

**Dapr Components:**
- `kafka-pubsub.yaml`: Kafka pub/sub via Redpanda using SCRAM-SHA-256 auth, credentials from K8s secret `redpanda-secrets`
- `statestore.yaml`: Redis state store for conversation/task cache
- `secretstore.yaml`: Kubernetes secret store

**Kubernetes:**
- `namespace.yaml`, `secrets.yaml` (redpanda-secrets, render-secrets, redis-secrets)
- `backend-deployment.yaml`: Dapr sidecar annotations (dapr.io/enabled, app-id, app-port)
- `frontend-deployment.yaml`: Dapr sidecar + WS env vars
- `dapr-config.yaml`: tracing + metrics config
- `redis.yaml`: in-cluster Redis for state store

**Helm:**
- Updated `deployment.yaml` with Dapr sidecar annotations
- Updated `values.yaml`: image tag v2, resource limits, dapr section

**Frontend:**
- `websocket-client.ts`: TypeScript WS client with auto-reconnect, exponential backoff, singleton pattern
- `types/index.ts`: added `TaskV2` (with tags, recurringInterval, reminderAt) and `TaskUpdateEvent` types
- `app/tasks/page.tsx`: WebSocket `useEffect` hook — live task add/update/delete, browser Notification API for reminders

**Deploy script:**
- `deploy-phase5.sh`: full Minikube+Dapr+K8s deploy automation

All credentials secured via K8s secrets + Dapr secretstore. Never hardcoded.

## Outcome

- All 8 Python files pass `ast.parse()` syntax check
- Dapr components reference K8s secrets correctly
- K8s manifests include Dapr sidecar annotations
- Frontend WebSocket client handles reconnection and real-time event routing
- Deploy script automates full Minikube deployment
