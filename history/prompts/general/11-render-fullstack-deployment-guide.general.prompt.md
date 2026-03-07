---
id: "11"
title: "Render Full-Stack Deployment Guide"
stage: general
date: "2026-03-01"
surface: agent
model: claude-sonnet-4-6
feature: "none"
branch: 007-render-event-deploy
user: rubab_bukhari
command: "manual"
labels: ["render", "docker", "deployment", "fullstack", "kafka", "redpanda", "nextjs", "fastapi", "dapr"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - infra/render/render.yaml
  - services/audit-svc/requirements.txt
tests: []
---

## Prompt

Deploy full-stack Todo app on Render: backend (FastAPI), frontend (Next.js), Kafka (Redpanda Cloud), microservices.

## Critical Bugs Fixed

1. audit-svc/requirements.txt missing confluent-kafka — code imports it but it was never installed. Added confluent-kafka>=2.3.0.
2. render.yaml used KAFKA_BOOTSTRAP_SERVER (singular) but audit-svc code reads KAFKA_BOOTSTRAP_SERVERS (plural). Corrected.
3. render.yaml missing NEON_DB_URL, BETTER_AUTH_SECRET, COHERE_API_KEY for backend.
4. render.yaml rootDir was missing — must be set so dockerfilePath resolves relative to correct folder.

## Architecture Constraint (Dapr on Render)

recurring-task-svc and notification-svc use Dapr Pub/Sub sidecars exclusively.
Render is a PaaS — no Kubernetes, no Dapr sidecars.
These services will start but receive no events on Render.
audit-svc has a dual-mode design (Dapr locally, direct Kafka on Render) — it is the only microservice that works correctly on Render.

## Response

Provided complete 5-service Render deployment workflow with:
- Backend: rootDir=backend, all secrets documented
- Frontend: NEXT_PUBLIC_* build-time ARG warning, plain vars required
- audit-svc: confluent-kafka fix, KAFKA_BOOTSTRAP_SERVERS (plural) correction, DATABASE_URL
- Dapr-only services: documented constraint, start but don't consume events

## Outcome

render.yaml fully corrected. audit-svc requirements fixed. Step-by-step guide produced.
