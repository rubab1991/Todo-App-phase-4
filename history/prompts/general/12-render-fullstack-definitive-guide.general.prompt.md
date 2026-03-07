---
id: "12"
title: "Render Full-Stack Definitive Deployment Guide"
stage: general
date: "2026-03-01"
surface: agent
model: claude-sonnet-4-6
feature: "none"
branch: 007-render-event-deploy
user: rubab_bukhari
command: "manual"
labels: ["render", "docker", "deployment", "fullstack", "auth", "jwt", "neon", "cohere"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - infra/render/render.yaml
tests: []
---

## Root cause of "app not showing"

1. NEXT_PUBLIC_API_BASE_URL defaults to localhost if not set as plain build-time var → all API calls fail silently
2. BETTER_AUTH_SECRET must be set on backend (empty string = 500 error on every API call)
3. JWT secret must be identical on both frontend (Next.js API routes) and backend (python-jose)
4. NEON_DB_URL must be set with exact postgres:// URL (asyncpg strips sslmode itself)
5. COHERE_API_KEY must be set or chat fails

## Auth Architecture (custom, not better-auth library)

Frontend /signup + /signin call Next.js server API routes → sign JWT with BETTER_AUTH_SECRET → store in localStorage.
Frontend calls backend /api/{userId}/tasks with Authorization: Bearer {jwt}.
Backend verifies JWT with same BETTER_AUTH_SECRET.
UserID is deterministic: user_{sha256(email).slice(0,16)}.

## Outcome

Definitive guide produced with exact env vars, correct types (plain vs secret), deploy order.
