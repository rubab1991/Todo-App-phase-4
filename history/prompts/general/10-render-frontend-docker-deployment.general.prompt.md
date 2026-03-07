---
id: "10"
title: "Render Frontend Docker Deployment"
stage: general
date: "2026-03-01"
surface: agent
model: claude-sonnet-4-6
feature: "none"
branch: 007-render-event-deploy
user: rubab_bukhari
command: "manual"
labels: ["render", "docker", "deployment", "frontend", "nextjs", "next-public-env"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - infra/render/render.yaml
tests: []
---

## Prompt

Deploy frontend Next.js app on Render using Docker.
- Repository: rubab1991/Todo-app-fullstack
- Branch: 004-k8s-local-deployment
- Service Name: Todo-app-fullstack-frontend
- Runtime: Docker
- Region: Oregon (US West)
- Root Directory: /frontend
- Dockerfile Path: .
- Env Vars: NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_BETTER_AUTH_URL, BETTER_AUTH_SECRET
- Instance Type: Starter
- Only deploy frontend (backend already deployed)

## Response

Explored frontend Dockerfile (3-stage Node 20 build, CMD node server.js, port 3000, standalone output).
Key finding: NEXT_PUBLIC_* vars are build-time ARGs baked into JS bundle — must be plain vars (not secrets).
Updated infra/render/render.yaml frontend block with:
- Service name: Todo-app-fullstack-frontend
- Region: oregon, plan: starter, branch: 004-k8s-local-deployment
- dockerFilePath: ./frontend/Dockerfile, dockerContext: ./frontend
- NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_BETTER_AUTH_URL as sync:false plain vars
- BETTER_AUTH_SECRET as sync:false secret
Provided complete step-by-step dashboard deployment guide with NEXT_PUBLIC_* warning.

## Outcome

render.yaml updated. Step-by-step deployment instructions provided.
Critical warning documented: NEXT_PUBLIC_ vars must be plain Build & Deploy vars, not secrets.
