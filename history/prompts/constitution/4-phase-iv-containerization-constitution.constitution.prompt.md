---
id: 4
title: Phase IV Containerization Constitution
stage: constitution
date: 2026-02-19
surface: agent
model: claude-opus-4-6
feature: none
branch: 001-backend-fix-integration
user: rubab_bukhari
command: /sp.constitution
labels: ["constitution", "phase-iv", "docker", "kubernetes", "helm", "infrastructure"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - n/a
---

## Prompt

You are the Constitution for Phase IV of the Todo AI Chatbot project.

Phase IV governs containerization and Kubernetes deployment using:
- Docker Desktop
- Docker AI Agent (Gordon)
- Kubernetes (Minikube)
- Helm Charts
- kubectl-ai
- Kagent
- Spec-Driven Development with Blueprints

This constitution ensures infrastructure automation follows strict governance, reproducibility, and AI-assisted DevOps best practices.

---

## 1. Core Infrastructure Principles

1. Infrastructure must be defined declaratively.
2. All deployments must be reproducible.
3. All containers must be versioned and tagged.
4. Kubernetes manifests must be Helm-managed.
5. No manual kubectl edits in production.
6. AI tools assist — but humans validate.

---

## 2. Containerization Rules (Docker + Gordon)

1. Both frontend and backend must be containerized.
2. Dockerfiles must:
   - Use slim base images
   - Expose required ports
   - Use non-root users
   - Minimize layers
3. Gordon may generate Dockerfiles.
4. Generated Dockerfiles must be reviewed before build.
5. Images must be tagged:
   - todo-frontend:v1
   - todo-backend:v1

If Gordon is unavailable:
- Use Docker CLI
- Or generate Dockerfiles via Claude Code

---

## 3. Kubernetes Governance (Minikube)

1. Local cluster must use Minikube.
2. Deployments must include:
   - Deployment
   - Service
   - ConfigMap
   - Secret
3. Backend and frontend must run as separate deployments.
4. Replicas:
   - Frontend: 2 replicas
   - Backend: 2 replicas
5. Resource limits must be defined.
6. No privileged containers allowed.

---

## 4. Helm Chart Requirements

1. All Kubernetes manifests must be Helm-managed.
2. Helm charts must:
   - Support configurable replica count
   - Support configurable image tag
   - Support configurable environment variables
3. Values must include:
   - DATABASE_URL
   - BETTER_AUTH_SECRET
   - COHERE_API_KEY
4. Secrets must not be hardcoded in templates.

---

## 5. AI DevOps Governance

### Gordon
- Used for Dockerfile generation
- Used for optimization suggestions
- Must not auto-deploy without review

### kubectl-ai
- Used for:
  - Deployment suggestions
  - Scaling
  - Debugging
- Suggestions must be validated before execution

### Kagent
- Used for:
  - Cluster health analysis
  - Resource optimization
- Must not auto-modify cluster state

AI tools assist but never replace declarative infrastructure.

---

## 6. Spec-Driven Infrastructure

Infrastructure must follow Spec → Plan → Tasks → Implementation flow.

Blueprints must define:
- Container build strategy
- Deployment topology
- Scaling rules
- Resource allocation
- Secret management

Infrastructure must be:
- Version controlled
- Repeatable
- Documented

---

## 7. Security Rules

1. Secrets must be stored as Kubernetes Secrets.
2. No API keys in container images.
3. No hardcoded credentials in Helm templates.
4. Pods must define resource requests and limits.
5. RBAC must restrict access.

---

## 8. Deployment Flow

1. Build Docker images.
2. Validate images locally.
3. Create Helm charts.
4. Deploy to Minikube.
5. Verify pods are running.
6. Expose frontend via Minikube service.
7. Validate chatbot functionality.

---

## 9. Observability & Debugging

Use:
- kubectl-ai for pod debugging
- kagent for cluster health
- kubectl logs for container logs

No direct container modifications.

---

## 10. Success Criteria

Phase IV is successful when:

- Frontend and backend are containerized.
- Helm chart deploys successfully on Minikube.
- Pods are healthy.
- Services are reachable.
- Todo chatbot functions correctly inside Kubernetes.
- Infrastructure is reproducible.

---

This constitution governs all infrastructure decisions for Phase IV.

All AI agents, blueprints, and automation must comply with this governance.

## Response snapshot

Updated constitution from v2.0.1 (Phase III) to v3.0.0 (Phase IV). MAJOR version bump due to introduction of entirely new governance scope: containerization (Docker + Gordon), Kubernetes (Minikube), Helm chart management, and AI DevOps governance (Gordon, kubectl-ai, Kagent). Added 7 new core principles (VII–XIII) covering declarative infrastructure, container governance, Kubernetes governance, Helm chart governance, AI DevOps governance, deployment flow, and observability. Preserved all Phase III content (agents, MCP tools, conversation flow). Added Infrastructure Standards and Infrastructure Requirements sections. Updated Security & Compliance with Kubernetes-specific rules. Added Amendment Procedure and Compliance Review to Governance section.

## Outcome

- ✅ Impact: Constitution updated to v3.0.0 with full Phase IV infrastructure governance
- 🧪 Tests: n/a (governance document)
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: /sp.specify for Phase IV features, /sp.plan for infrastructure blueprint
- 🧠 Reflection: Clean transition from Phase III to Phase IV; all existing principles preserved while adding infrastructure-specific governance

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS — no unresolved placeholders, version matches report, dates in ISO format
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Validate plan-template.md Constitution Check gates reference new infrastructure principles
