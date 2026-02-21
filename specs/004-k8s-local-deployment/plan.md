# Implementation Plan: Local Kubernetes Deployment for Todo Chatbot

**Branch**: `004-k8s-local-deployment` | **Date**: 2026-02-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-k8s-local-deployment/spec.md`

## Summary

Deploy the Phase III Todo AI Chatbot on a local Minikube Kubernetes cluster. This involves fixing and rebuilding Docker images for the FastAPI backend (with OpenAI Agents SDK + Cohere) and the Next.js frontend, creating Helm charts for declarative deployment, managing secrets via Kubernetes Secrets, and validating end-to-end chatbot functionality inside the cluster. Existing `deploy/` Dockerfiles require significant corrections before containerization can proceed.

## Technical Context

**Language/Version**: Python 3.11 (backend), Node.js 20 / TypeScript 5.9 (frontend)
**Primary Dependencies**: FastAPI 0.104.1, SQLModel 0.0.16, Next.js 16.1.3, React 19.2.3, Cohere 5.5.4, OpenAI 1.3.5, Better Auth 0.2.0
**Storage**: Neon Serverless PostgreSQL (external, accessed via asyncpg)
**Testing**: Manual validation (docker run, kubectl get pods, helm test, curl endpoints)
**Target Platform**: Local Minikube cluster (Linux containers on Docker Desktop)
**Project Type**: Web application (frontend + backend monorepo)
**Performance Goals**: All 4 pods running within 2 minutes of Helm install; images build in under 5 minutes each
**Constraints**: Minikube local only; no cloud registry; secrets via K8s Secrets only; non-root containers; no privileged mode
**Scale/Scope**: 2 replicas each (backend + frontend = 4 pods total); single Minikube node

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Statelessness | PASS | No runtime state in containers; DB is external Neon PostgreSQL |
| II. User-Centric Security | PASS | Auth preserved; JWT validation unchanged in containers |
| III. Consistency | PASS | Same codebase containerized; no behavioral changes |
| IV. Tool-First Execution | PASS | MCP tools unchanged; containerization is infrastructure-only |
| V. Spec-Driven Development | PASS | Full spec at specs/004-k8s-local-deployment/spec.md |
| VI. Cloud-Native Readiness | PASS | Kubernetes + Helm deployment is the goal of this feature |
| VII. Declarative Infrastructure | PASS | All manifests Helm-managed, version-controlled |
| VIII. Container Governance | PASS | Slim bases, non-root, tagged images, human review |
| IX. Kubernetes Governance | PASS | Minikube, separate deployments, 2 replicas, resource limits |
| X. Helm Chart Governance | PASS | Configurable values.yaml with secrets via K8s Secrets |
| XI. AI DevOps Governance | PASS | AI tools assist only; human review enforced |
| XII. Deployment Flow | PASS | Follows build → validate → chart → deploy → verify → expose → test |
| XIII. Observability | PASS | kubectl logs, kubectl-ai debugging, no direct container mods |

**All gates PASS. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/004-k8s-local-deployment/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (infrastructure contracts)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/main.py          # FastAPI entry point (src.api.main:app)
│   ├── agents/              # AI agents (intent, executor, composer, etc.)
│   ├── models/              # SQLModel entities (task, user, conversation, message)
│   ├── services/            # Business logic
│   ├── middleware/           # Auth, rate limiting
│   ├── mcp/                 # MCP tool integration
│   ├── db.py                # Async database session (Neon PostgreSQL)
│   ├── auth.py              # JWT token handling
│   └── config.py            # Settings (env vars)
├── requirements.txt
└── .env

frontend/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   ├── tasks/page.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── api/auth/            # Auth API routes
├── components/              # React components
├── hooks/
├── lib/
├── types/
├── package.json
├── next.config.js
├── tailwind.config.js
└── .env

infra/                       # NEW — Infrastructure artifacts
├── helm/
│   ├── todo-backend/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       ├── secret.yaml
│   │       └── _helpers.tpl
│   └── todo-frontend/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── configmap.yaml
│           └── _helpers.tpl
├── docker/
│   ├── backend.Dockerfile    # Fixed backend Dockerfile
│   └── frontend.Dockerfile   # Fixed frontend Dockerfile
└── scripts/
    ├── deploy.sh             # Full deployment automation
    ├── build-images.sh       # Docker build script
    └── validate.sh           # Post-deploy validation
```

**Structure Decision**: Web application structure (frontend + backend) with a new `infra/` directory at repository root for all infrastructure artifacts. Existing `deploy/` directory Dockerfiles are broken and will be superseded by corrected versions in `infra/docker/`. Helm charts stored in `infra/helm/` per constitution requirement.

## Complexity Tracking

> No constitution violations detected. All gates pass.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| New `infra/` directory | Supersedes broken `deploy/` | Existing Dockerfiles have wrong entry points, missing files, incorrect base images |
| Separate Helm charts | One per service | Constitution IX requires separate deployments; separate charts enable independent lifecycle |
| No local PostgreSQL | External Neon only | Phase III uses Neon; docker-compose local PG is unnecessary and was never connected |
