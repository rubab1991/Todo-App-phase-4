---
id: 6
title: Update Railway Deployment Constitution
stage: constitution
date: 2026-03-10
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 001-event-driven-chatbot
user: architext
command: /sp.constitution
labels: ["constitution","railway","deployment","kafka","dapr","phase-v"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

You are implementing Phase V of an Event-Driven AI Todo Application.
Follow this constitution strictly when generating, modifying, or organizing code.

PROJECT PURPOSE: Build a production-ready AI powered Todo application with event-driven
architecture including AI Chatbot, event-driven backend, task reminders, recurring tasks,
audit logs, cloud deployment, and scalable architecture using Dapr.

SYSTEM ARCHITECTURE:
- Frontend: Next.js on Vercel
- Backend: FastAPI on Railway (https://web-production-7458d.up.railway.app/)
- Events: Redpanda Cloud (Kafka compatible)
- Runtime: Dapr
- Kubernetes: Minikube for local development

AI MODEL: Cohere (COHERE_API_KEY). OpenAI Agents SDK for orchestration.

TOPICS: task-events, task-updates, task-reminders, audit-events

BACKEND RULES: uvicorn app.main:app --host 0.0.0.0 --port $PORT

DAPR: dapr run --app-id todo-backend

FRONTEND ENV: NEXT_PUBLIC_API_URL

## Response snapshot

Updated constitution from v4.0.0 → v4.1.0 (MINOR bump).

Changes applied:
- All "Render" backend deployment references replaced with "Railway"
- Production URL added: https://web-production-7458d.up.railway.app/
- Kafka topics enumerated explicitly: task-events, task-updates, task-reminders,
  audit-events (replacing generic naming convention)
- Backend start command codified: uvicorn app.main:app --host 0.0.0.0 --port $PORT
- NEXT_PUBLIC_API_URL documented in Frontend Standards
- Local Dapr run command added: dapr run --app-id todo-backend
- Sync Impact Report updated in HTML comment header

File written: .specify/memory/constitution.md

## Outcome

- ✅ Impact: Constitution v4.1.0 written; all Railway/Render discrepancies resolved
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: /sp.specify or /sp.plan for a Phase V feature
- 🧠 Reflection: MINOR bump correctly applied; no template changes required

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
