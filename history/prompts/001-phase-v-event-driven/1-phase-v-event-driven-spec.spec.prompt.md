---
id: 1
title: Phase V Event-Driven Todo Spec
stage: spec
date: 2026-03-10
surface: agent
model: claude-sonnet-4-6
feature: 001-phase-v-event-driven
branch: 001-phase-v-event-driven
user: architext
command: /sp.specify
labels: ["spec","phase-v","event-driven","task-management","chatbot","reminders","recurring","audit"]
links:
  spec: specs/001-phase-v-event-driven/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-phase-v-event-driven/spec.md
  - specs/001-phase-v-event-driven/checklists/requirements.md
tests:
  - N/A
---

## Prompt

You are implementing Phase V of the AI Todo Application according to the established
constitution. Generate a detailed technical specification that defines all remaining
features, integrations, and infrastructure needed to complete Phase V.

PROJECT OVERVIEW: AI-powered Todo Application with event-driven architecture. Users can
manage tasks through standard UI actions and AI chatbot. System supports Task CRUD,
AI task creation/editing, task reminders, recurring tasks, event streaming, audit
logging, and cloud deployment.

CURRENT DEPLOYMENT STATE: Backend on Railway at
https://web-production-7458d.up.railway.app/. Frontend on Vercel. Frontend uses
NEXT_PUBLIC_API_URL.

SYSTEM ARCHITECTURE: Next.js + TypeScript frontend. FastAPI backend on Railway. Cohere
AI. Redpanda Cloud (Kafka). Dapr. Minikube for local Kubernetes.

FEATURES:
1. Task Management System (CRUD, tags, priority, REST endpoints)
2. AI Chatbot (Cohere, intent detection, entity extraction)
3. Event-Driven Architecture (task-events, task-reminders, audit-events topics)
4. Reminder System (Dapr Jobs API, future-only timestamps)
5. Recurring Task Engine (daily/weekly/monthly auto-generation)
6. Audit Log System (audit-events topic + database)
7. Frontend (Next.js dashboard + chatbot UI)
8. Deployment (Railway backend, Vercel frontend)
9. Security (env vars: COHERE_API_KEY, DATABASE_URL, BETTER_AUTH_SECRET,
   REDPANDA_BOOTSTRAP_SERVERS, REDPANDA_USERNAME, REDPANDA_PASSWORD)
10. Error Handling (structured JSON errors)

## Response snapshot

Created comprehensive Phase V specification at
`specs/001-phase-v-event-driven/spec.md` on branch `001-phase-v-event-driven`.

Spec includes:
- System architecture ASCII diagram
- 5 prioritized user stories (P1–P5) with acceptance scenarios and independent tests
- 7 edge cases
- 43 functional requirements across 7 domains (FR-001 to FR-043)
- 5 key entities (Task, ChatMessage, AuditEvent, KafkaEvent, User)
- Full API definitions (endpoints, request/response schemas, HTTP status codes)
- Canonical Kafka event schema + topic-to-event-type mapping
- AI chatbot workflow diagram + intent-to-API mapping
- Frontend component structure
- Chatbot UI behaviour specification
- Deployment configuration (Railway + Vercel)
- Environment variables table
- 10 measurable, technology-agnostic success criteria (SC-001 to SC-010)
- Assumptions section
- Scope boundaries (in scope / out of scope)

Quality checklist: all items pass. No NEEDS CLARIFICATION markers. Ready for /sp.plan.

## Outcome

- ✅ Impact: Full Phase V spec created; ready for planning and task generation
- 🧪 Tests: N/A (spec stage)
- 📁 Files: specs/001-phase-v-event-driven/spec.md,
  specs/001-phase-v-event-driven/checklists/requirements.md
- 🔁 Next prompts: /sp.plan, /sp.clarify
- 🧠 Reflection: Comprehensive spec with no ambiguities; all 10 Phase V systems
  fully specified with measurable outcomes

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Quality checklist — all PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.plan to generate architecture plan
