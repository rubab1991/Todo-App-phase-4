---
id: 5
title: Phase IV K8s Tasks Regeneration
stage: tasks
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: 004-k8s-local-deployment
branch: 004-k8s-local-deployment
user: rubab_bukhari
command: /sp.tasks
labels: ["tasks","kubernetes","helm","docker","minikube","ai-devops","containerization"]
links:
  spec: specs/004-k8s-local-deployment/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-k8s-local-deployment/tasks.md
tests:
  - null
---

## Prompt

/sp.task /sp.tasks
# Phase IV – Local Kubernetes Deployment Tasks
ID: phase4-infra-tasks

Objective:
Deploy the Phase III Todo AI Chatbot on Minikube using Docker, Helm, kubectl-ai, and Kagent under Spec-Driven workflow.

---

## EPIC 1 — Environment Setup

### Task 1.1 — Verify Docker Desktop & Gordon
- Confirm Docker Desktop version ≥ 4.53
- Enable Docker AI (Gordon) in Settings > Beta Features
- Run:
  docker ai "What can you do?"
- Output: Capability summary saved in /docs/docker-ai.md

### Task 1.2 — Install & Validate Minikube
- Install Minikube if not present
- Run:
  minikube start
  minikube status
- Output: Running cluster with 1 node

### Task 1.3 — Validate kubectl & Helm
- Run:
  kubectl get nodes
  helm version
- Output: Confirm CLI connectivity

### Task 1.4 — Install kubectl-ai & Kagent
- Install both tools
- Validate:
  kubectl-ai "What can you do?"
  kagent "analyze the cluster"
- Output: Tool capability confirmation

---

## EPIC 2 — Containerization

### Task 2.1 — Generate Backend Dockerfile (via Gordon)
- Base: python:3.11-slim
- Install dependencies
- Expose port 8000
- Use non-root user
- Output file: backend/Dockerfile

### Task 2.2 — Generate Frontend Dockerfile (via Gordon)
- Base: node:20-alpine
- Install dependencies
- Expose port 3000
- Output file: frontend/Dockerfile

### Task 2.3 — Build Images
- Run:
  docker build -t todo-backend:v1 ./backend
  docker build -t todo-frontend:v1 ./frontend
- Output: Two local images

### Task 2.4 — Local Container Testing
- Run containers with .env
- Validate backend health endpoint
- Validate frontend renders UI

Success Criteria:
- Both containers run without errors

---

## EPIC 3 — Kubernetes Manifests & Helm Charts

### Task 3.1 — Create Helm Chart Structure
- Directory:
  infra/helm/backend
  infra/helm/frontend
- Files:
  Chart.yaml
  values.yaml
  templates/

### Task 3.2 — Backend Deployment Template
- 2 replicas
- Resource requests & limits
- Secret-based env vars
- ClusterIP service

### Task 3.3 — Frontend Deployment Template
- 2 replicas
- NodePort service
- Configurable image tag

### Task 3.4 — Kubernetes Secrets
- Create secret manifest:
  COHERE_API_KEY
  DATABASE_URL
  BETTER_AUTH_SECRET
- Ensure no secrets in values.yaml

### Task 3.5 — Validate Helm Templates
- Run:
  helm template ./infra/helm/backend
  helm template ./infra/helm/frontend
- Output: Valid YAML manifests

---

## EPIC 4 — Deployment to Minikube

### Task 4.1 — Install Backend Chart
- helm install todo-backend ./infra/helm/backend

### Task 4.2 — Install Frontend Chart
- helm install todo-frontend ./infra/helm/frontend

### Task 4.3 — Verify Pods & Services
- kubectl get pods
- kubectl get svc
- Confirm:
  - 2 replicas per deployment
  - Services reachable

### Task 4.4 — Test NodePort Access
- minikube service todo-frontend
- Confirm frontend loads in browser

---

## EPIC 5 — Functional Validation

### Task 5.1 — Backend Connectivity
- Confirm frontend can call backend API

### Task 5.2 — AI Integration Test
- Test chatbot:
  - Add task
  - List tasks
  - Complete task
  - Delete task
- Confirm Cohere API responding

### Task 5.3 — Stateless Validation
- Delete a backend pod
- Confirm system recovers without losing functionality

---

## EPIC 6 — AI-Assisted Optimization

### Task 6.1 — Use kubectl-ai for Scaling
- kubectl-ai "scale backend to 3 replicas"
- Confirm scaling success

### Task 6.2 — Use Kagent for Health Analysis
- kagent "analyze cluster health"
- Document recommendations

### Task 6.3 — Apply Resource Optimization
- Update Helm values if recommended
- Re-deploy via helm upgrade

---

## EPIC 7 — Documentation & Governance

### Task 7.1 — Commit Infrastructure Code
- Dockerfiles
- Helm charts
- Secret templates (without values)

### Task 7.2 — Write README
Include:
- Prerequisites
- Deployment steps
- How to scale
- How to destroy cluster

### Task 7.3 — Security Review
- Verify:
  - No hardcoded secrets
  - Resource limits defined
  - Images use non-root user
  - RBAC restrictions documented

---

## Definition of Done

- Minikube cluster running
- Frontend + Backend deployed with 2 replicas
- Helm fully manages deployments
- Secrets stored securely
- Chatbot fully functional
- AI-assisted tooling used and documented
- Deployment reproducible from scratch

## Response snapshot

Regenerated `specs/004-k8s-local-deployment/tasks.md` with 56 tasks across 7 phases, incorporating the user's Phase IV EPIC-based task list alongside the existing SDD-RI design artifacts (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md).

Key additions from the EPIC list vs. prior tasks.md:
- **T009**: Gordon Docker AI capability test → `docs/docker-ai.md`
- **T010–T011**: kubectl-ai and Kagent installation/validation (Phase 2 Foundational)
- **T032**: `helm template` validation before deployment (Epic 3.5)
- **T044–T045**: kubectl-ai scaling command with human-reviewed application (Epic 6.1)
- **T046–T047**: Kagent health analysis + apply AI-recommended Helm resource updates (Epic 6.2–6.3)
- **T054**: Comprehensive README at `docs/README-k8s.md` with prerequisites, deployment, scaling, teardown (Epic 7.2)
- **T055**: Explicit security review checklist — no hardcoded secrets, resource limits, non-root users, no privileged containers (Epic 7.3)

Phase 1 (T001–T003) and Phase 2 (T004–T008) remain marked [x] (previously completed).

## Outcome

- ✅ Impact: tasks.md updated with 56 tasks (7 phases, 4 user stories) fully traceable to spec.md, plan.md, and research.md; all EPIC requirements incorporated; existing completed tasks preserved
- 🧪 Tests: No tests requested; manual validation via docker run, kubectl get pods, helm test, curl endpoints
- 📁 Files: specs/004-k8s-local-deployment/tasks.md (updated)
- 🔁 Next prompts: `/sp.implement` to begin execution starting from T009 (Gordon capability test), or run `T012–T015` (Dockerfiles + builds) as the immediate MVP focus
- 🧠 Reflection: EPIC-based task list aligned well with SDD-RI US-based structure; key gap filled was AI tool installation/validation in Foundational phase and `helm template` validation before deployment

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): run /sp.implement to start executing T009 onward
