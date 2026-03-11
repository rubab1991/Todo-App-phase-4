---
id: 3
title: Phase V Chatbot UI Implementation
stage: green
date: 2026-03-10
surface: agent
model: claude-sonnet-4-6
feature: 001-phase-v-event-driven
branch: 001-event-driven-chatbot
user: DELL
command: /sp.implement
labels: ["chatbot-ui","event-driven","fastapi","nextjs","cohere","dapr","kafka"]
links:
  spec: specs/001-phase-v-event-driven/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/config.py
  - backend/src/services/event_publisher.py
  - backend/src/events/__init__.py
  - backend/src/events/schema.py
  - backend/src/routes/events.py
  - backend/src/routes/tasks.py
  - backend/src/api/chat_router.py
  - frontend/.env.local
  - frontend/.env.example
  - frontend/lib/chatbot-api.ts
  - frontend/components/chatbot/chatbot-button.tsx
  - frontend/components/chatbot/chat-message.tsx
  - frontend/components/chatbot/chat-input.tsx
  - frontend/components/chatbot/chat-window.tsx
  - frontend/components/chatbot/chatbot-provider.tsx
  - frontend/app/providers.tsx
  - specs/001-phase-v-event-driven/tasks.md
tests:
  - Next.js production build (node node_modules/next/dist/bin/next build) — PASS, zero TypeScript errors
---

## Prompt

/sp.implement

## Response snapshot

Executed Phase V implementation across 41 tasks (T001–T041). Primary work:

**Backend fixes (Phases 1–6)**:
- Added missing Redpanda env vars to `backend/src/config.py` (`redpanda_bootstrap_servers`, `redpanda_username`, `redpanda_password`)
- Rewrote `event_publisher.py`: renamed `TOPIC_REMINDERS` → `TOPIC_TASK_REMINDERS = "task-reminders"`, added `TOPIC_AUDIT_EVENTS = "audit-events"`, added `publish_audit_event()` with canonical schema, updated `publish_task_event` to include canonical fields
- Created `backend/src/events/schema.py` with `TaskEvent` Pydantic model
- Updated `backend/src/routes/events.py`: Dapr subscription topic `reminders` → `task-reminders`, handler renamed to `handle_task_reminders`
- Updated `backend/src/routes/tasks.py`: all 4 CRUD handlers now call `publish_audit_event()` in addition to existing DB write
- Added `GET /api/{user_id}/chat/history` endpoint to `backend/src/api/chat_router.py` (was missing; queries `messages` table filtered by `user_id`, ordered by timestamp)

**Chatbot UI (Phase 8 — primary new work)**:
- `frontend/lib/chatbot-api.ts`: `sendChatMessage()` + `getChatHistory()` using `NEXT_PUBLIC_API_BASE_URL`
- `frontend/components/chatbot/chatbot-button.tsx`: floating FAB (bottom-right, `z-50`), purple→blue gradient, toggles chat bubble↔X icon
- `frontend/components/chatbot/chat-message.tsx`: `ChatMessageBubble`, user right-aligned purple, assistant left-aligned white, shows timestamp
- `frontend/components/chatbot/chat-input.tsx`: auto-growing textarea, Enter to send, Shift+Enter for newline, animated spinner, purple send button
- `frontend/components/chatbot/chat-window.tsx`: 380px wide / 520px tall panel, loads history on mount, auto-scrolls, dispatches `tasks-updated` event after assistant response, 3-dot typing animation
- `frontend/components/chatbot/chatbot-provider.tsx`: combines button + window with shared `isOpen` state
- `frontend/app/providers.tsx`: replaced `ChatContainer` with `AuthenticatedChatbot` wrapper that reads `useAuth()` and renders `ChatbotProvider` only when authenticated

**Frontend env (Phase 9)**:
- Created `frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL`
- Created `frontend/.env.example` documenting required Vercel env vars

**Build**: `next build` succeeded — zero TypeScript errors, all 9 routes compile.

## Outcome

- ✅ Impact: Chatbot UI fully built and wired to Railway backend; all three Kafka topics aligned (`task-events`, `task-reminders`, `audit-events`); audit events published on every task action; production build passes
- 🧪 Tests: Next.js production build PASS (zero TS errors, 9 routes)
- 📁 Files: 17 files created/modified across backend and frontend
- 🔁 Next prompts: T042 (deploy to Vercel), T043–T047 (E2E smoke tests across all 5 user stories)
- 🧠 Reflection: `check-prerequisites.sh` consistently fails due to multiple `001-` prefixed spec directories; bypassed by reading files directly. Existing `ChatContainer` (src/components) was replaced rather than duplicated to avoid two floating chat buttons. `GET /chat/history` endpoint was missing from `chat_router.py` and was added with DB query. `NEXT_PUBLIC_API_BASE_URL` (not `NEXT_PUBLIC_API_URL`) is the actual env var name in the codebase.

## Evaluation notes (flywheel)

- Failure modes observed: `check-prerequisites.sh` multi-prefix collision; `ChatContainer` pre-existing duplicate chatbot; missing history endpoint in chat_router
- Graders run and results (PASS/FAIL): next build — PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): add E2E Playwright test for chatbot create-task flow
