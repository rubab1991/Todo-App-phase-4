---
id: 5
title: Phase V Event-Driven Todo Constitution
stage: constitution
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 007-render-event-deploy
user: rubab_bukhari
command: /sp.constitution
labels: ["constitution","phase-v","event-driven","dapr","kafka","redpanda","render","vercel"]
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

Phase V – Advanced Event-Driven Todo Chatbot Deployment
1. Purpose

This constitution defines the development rules, architecture constraints, infrastructure standards, and evaluation criteria for implementing Phase V of the Todo Chatbot application.

Phase V transforms the application from a simple task manager into a cloud-native, event-driven distributed system powered by Kafka, Dapr, and Kubernetes concepts.

The system must implement advanced task functionality and deploy using modern cloud infrastructure and microservices architecture.

All development must strictly follow spec-driven development using the Agentic Dev Stack workflow.

[... full constitution input as provided by user, covering: Event Schema, Dapr Runtime Integration (pub/sub, state management, service invocation, jobs API, secrets), Local Infrastructure (Minikube), Deployment Strategy (Vercel, Render, Redpanda Cloud), CI/CD Pipeline (GitHub Actions), Observability, Repository Structure, Demo Requirements, and Definition of Completion.]

## Response snapshot

Updated `.specify/memory/constitution.md` from version 3.0.0 to 4.0.0 (MAJOR bump).

Added new sections:
- XIV. Event-Driven Architecture Governance (Dapr pub/sub, no direct Kafka SDK, idempotent consumers)
- XV. Dapr Runtime Governance (pub/sub, state store, service invocation, jobs API, secrets)
- XVI. Redpanda / Kafka Governance (topic naming, Dapr-only access, Redpanda Cloud for prod)
- XVII. Advanced Task Features (reminders via Dapr Jobs, due dates, canonical Event Schema)
- XVIII. CI/CD Pipeline Governance (GitHub Actions, test-gate on deploy)

Updated principles:
- VI renamed to "Extensibility and Event-Driven Readiness"
- XII Deployment Flow updated to Vercel + Render + Redpanda Cloud targets
- XIII Observability expanded with Kafka and reminder logging

Updated agent roster: added Reminder Scheduler Agent (h).
Updated Conversation & Task Flow: now 12-step with Dapr state store and Kafka publish.
Updated Natural Language → Tool Mapping: added remind/due date intents.
Updated Success Criteria with event-driven and infrastructure requirements.

## Outcome

- ✅ Impact: Constitution bumped to v4.0.0; Phase V event-driven architecture, Dapr building blocks, Redpanda Cloud, Vercel, Render, and GitHub Actions CI/CD are now constitutionally governed.
- 🧪 Tests: N/A (constitution document update)
- 📁 Files: .specify/memory/constitution.md (overwritten)
- 🔁 Next prompts: /sp.specify (define Phase V feature spec), /sp.plan (architecture plan), /sp.adr (Dapr runtime decision, Kafka event schema)
- 🧠 Reflection: MAJOR version bump correctly reflects paradigm shift from container-only to event-driven distributed system. Dapr building blocks enumerated explicitly to prevent direct SDK usage drift.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): No unresolved placeholders; version/date consistent; all sections declarative MUST/SHOULD language
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.specify for reminder feature to validate Event Schema alignment with constitution
