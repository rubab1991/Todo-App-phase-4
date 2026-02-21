# Tasks: Local Kubernetes Deployment for Todo Chatbot

**Input**: Design documents from `/specs/004-k8s-local-deployment/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓
**Updated**: 2026-02-21 (incorporates Phase IV EPIC task list)

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/`, `infra/`
- **Infrastructure**: `infra/docker/`, `infra/helm/`, `infra/scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the `infra/` directory structure for all infrastructure artifacts

- [x] T001 Create infrastructure directory structure: `infra/docker/`, `infra/helm/todo-backend/templates/`, `infra/helm/todo-frontend/templates/`, `infra/scripts/`
- [x] T002 [P] Create `.dockerignore` at repository root to exclude `.git`, `node_modules`, `__pycache__`, `.next`, `.env`, `*.md`, `specs/`, `history/`, `.specify/`
- [x] T003 [P] Add `infra/` entry to `.gitignore` exclusions to ensure infrastructure files are tracked (verify `.env` files are still ignored)

**Checkpoint**: Infrastructure directory structure ready — containerization can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify tooling prerequisites and Minikube cluster readiness. MUST complete before any user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Verify Docker Desktop ≥ 4.53 is installed and running: `docker --version`, `docker info`
- [x] T005 [P] Verify Minikube is installed and start cluster: `minikube start --cpus=4 --memory=8192`, `minikube status`
- [x] T006 [P] Verify Helm v3 is installed: `helm version`
- [x] T007 [P] Verify kubectl connectivity to Minikube: `kubectl get nodes`
- [x] T008 Configure Docker to use Minikube's Docker daemon: `eval $(minikube docker-env)` — ensures locally built images are available to Minikube without a registry
- [x] T009 Enable Docker AI (Gordon) and test capability: in Docker Desktop enable Settings > Beta Features > Docker AI, then run `docker ai "What can you do?"`, save capability summary to `docs/docker-ai.md`
- [ ] T010 [P] Install kubectl-ai if not present and validate: `kubectl-ai "What can you do?"` — confirm tool capability response, document availability in `docs/docker-ai.md`
- [ ] T011 [P] Install Kagent if not present and validate: `kagent "analyze the cluster"` — confirm tool capability response, document availability in `docs/docker-ai.md`

**Checkpoint**: Foundation ready — all tools verified, Minikube running, Docker configured for Minikube, AI DevOps tools validated. User story implementation can now begin.

---

## Phase 3: User Story 1 - Containerize Backend and Frontend (Priority: P1) 🎯 MVP

**Goal**: Build working Docker images for both backend and frontend that can be run locally with `docker run`.

**Independent Test**: Build both images, run each with `docker run --env-file .env`, verify backend responds on port 8000 (`/health`) and frontend serves on port 3000.

### Implementation for User Story 1

- [x] T012 [US1] Create backend Dockerfile at `infra/docker/backend.Dockerfile` — base `python:3.11-slim`, WORKDIR `/app`, copy `backend/requirements.txt` and install deps, copy `backend/src/` to `/app/src/`, create non-root user `appuser` (UID 1000), switch to `appuser`, EXPOSE 8000, CMD `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`. Per contract: `specs/004-k8s-local-deployment/contracts/dockerfile-backend.md`
- [x] T013 [US1] Create frontend Dockerfile at `infra/docker/frontend.Dockerfile` — multi-stage build. Stage 1 (builder): base `node:20-alpine`, copy `frontend/package.json` + `frontend/package-lock.json`, `npm ci`, copy `frontend/app/`, `frontend/components/`, `frontend/hooks/`, `frontend/lib/`, `frontend/types/`, `frontend/public/`, copy `frontend/next.config.js`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, `frontend/tsconfig.json`, ARG `NEXT_PUBLIC_API_BASE_URL` + `NEXT_PUBLIC_BETTER_AUTH_URL`, `npm run build`. Stage 2 (runtime): base `node:20-alpine`, copy `package.json` + `package-lock.json`, `npm ci --omit=dev`, COPY `.next/` from builder, COPY `public/` from builder, COPY `next.config.js` from builder, create non-root user `nextjs` (UID 1000), EXPOSE 3000, CMD `npm start`. Per contract: `specs/004-k8s-local-deployment/contracts/dockerfile-frontend.md`
- [x] T014 [US1] Build backend Docker image: `docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile .` from repository root — confirm image `todo-backend:v1` created
- [x] T015 [US1] Build frontend Docker image: `docker build -t todo-frontend:v1 --build-arg NEXT_PUBLIC_API_BASE_URL=http://$(minikube ip):30080/api --build-arg NEXT_PUBLIC_BETTER_AUTH_URL=http://$(minikube ip):30030 -f infra/docker/frontend.Dockerfile .` from repository root — confirm image `todo-frontend:v1` created
- [x] T016 [US1] Validate backend container with `.env` vars: `docker run --rm -e NEON_DB_URL="<from .env>" -e BETTER_AUTH_SECRET="<from .env>" -e COHERE_API_KEY="<from .env>" -p 8000:8000 todo-backend:v1` — verify `curl http://localhost:8000/health` returns success
- [x] T017 [US1] Validate frontend container: `docker run --rm -p 3000:3000 todo-frontend:v1` — verify `curl http://localhost:3000` returns HTML and chatbot UI renders
- [x] T018 [US1] Security validation — confirm no secrets baked into images: `docker history todo-backend:v1` and `docker history todo-frontend:v1` — verify no API keys or secrets appear in image layers

**Checkpoint**: User Story 1 fully functional. Both images build and run correctly with no secrets baked in. MVP complete.

---

## Phase 4: User Story 2 - Deploy to Local Kubernetes Cluster (Priority: P2)

**Goal**: Deploy both containerized services to Minikube using Helm charts with proper secrets, services, and resource limits.

**Independent Test**: Run `helm install` for both charts, verify 4 pods running with `kubectl get pods`, access frontend via `minikube service todo-frontend --url`.

### Implementation for User Story 2

- [x] T019 [P] [US2] Create backend Helm chart metadata at `infra/helm/todo-backend/Chart.yaml` — name: `todo-backend`, version: `0.1.0`, appVersion: `v1`, description: "Helm chart for Todo AI Chatbot backend"
- [x] T020 [P] [US2] Create frontend Helm chart metadata at `infra/helm/todo-frontend/Chart.yaml` — name: `todo-frontend`, version: `0.1.0`, appVersion: `v1`, description: "Helm chart for Todo AI Chatbot frontend"
- [x] T021 [US2] Create backend Helm values at `infra/helm/todo-backend/values.yaml` — per contract `specs/004-k8s-local-deployment/contracts/helm-values-backend.yaml`: replicaCount 2, image todo-backend:v1 pullPolicy IfNotPresent, service NodePort port 8000, resources requests 100m/128Mi limits 200m/256Mi, securityContext runAsNonRoot true runAsUser 1000 allowPrivilegeEscalation false, liveness/readiness probes on /health port 8000, env config (DEBUG: "false", LOG_LEVEL: "info", BETTER_AUTH_URL) and secret refs (NEON_DB_URL, BETTER_AUTH_SECRET, COHERE_API_KEY)
- [x] T022 [US2] Create frontend Helm values at `infra/helm/todo-frontend/values.yaml` — per contract `specs/004-k8s-local-deployment/contracts/helm-values-frontend.yaml`: replicaCount 2, image todo-frontend:v1 pullPolicy IfNotPresent, service NodePort port 3000, resources requests 100m/128Mi limits 200m/256Mi, securityContext runAsNonRoot true runAsUser 1000, liveness/readiness probes on / port 3000, env config (NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_BETTER_AUTH_URL)
- [x] T023 [P] [US2] Create backend Helm template helpers at `infra/helm/todo-backend/templates/_helpers.tpl` — define `todo-backend.fullname`, `todo-backend.labels`, `todo-backend.selectorLabels`
- [x] T024 [P] [US2] Create frontend Helm template helpers at `infra/helm/todo-frontend/templates/_helpers.tpl` — define `todo-frontend.fullname`, `todo-frontend.labels`, `todo-frontend.selectorLabels`
- [x] T025 [US2] Create backend deployment template at `infra/helm/todo-backend/templates/deployment.yaml` — Deployment with 2 replicas from values, container image from values, containerPort 8000, env vars from Secret (`todo-secrets`) via secretKeyRef and ConfigMap (`todo-backend-config`) via configMapKeyRef, resource limits from values, securityContext from values, liveness/readiness probes from values
- [x] T026 [US2] Create frontend deployment template at `infra/helm/todo-frontend/templates/deployment.yaml` — Deployment with 2 replicas from values, container image from values, containerPort 3000, env vars from ConfigMap (`todo-frontend-config`) via configMapKeyRef, resource limits from values, securityContext from values, liveness/readiness probes from values
- [x] T027 [P] [US2] Create backend service template at `infra/helm/todo-backend/templates/service.yaml` — Service type NodePort, port 8000, targetPort 8000, selector matching deployment selectorLabels
- [x] T028 [P] [US2] Create frontend service template at `infra/helm/todo-frontend/templates/service.yaml` — Service type NodePort, port 3000, targetPort 3000, selector matching deployment selectorLabels
- [x] T029 [US2] Create backend ConfigMap template at `infra/helm/todo-backend/templates/configmap.yaml` — ConfigMap `todo-backend-config` with DEBUG, LOG_LEVEL, BETTER_AUTH_URL values from values.yaml
- [x] T030 [US2] Create frontend ConfigMap template at `infra/helm/todo-frontend/templates/configmap.yaml` — ConfigMap `todo-frontend-config` with NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_BETTER_AUTH_URL values from values.yaml
- [x] T031 [US2] Create Secret template at `infra/helm/todo-backend/templates/secret.yaml` — Secret `todo-secrets` with NEON_DB_URL, BETTER_AUTH_SECRET, COHERE_API_KEY keys (values injected via `--set` or pre-created via kubectl; placeholder comments in template; NO hardcoded values)
- [x] T032 [US2] Validate Helm templates before deployment: `helm template infra/helm/todo-backend` and `helm template infra/helm/todo-frontend` — confirm valid YAML output, check for unresolved references, no secrets visible in rendered output
- [x] T033 [US2] Create Kubernetes Secret before Helm install: `kubectl create secret generic todo-secrets --from-literal=NEON_DB_URL='<value>' --from-literal=BETTER_AUTH_SECRET='<value>' --from-literal=COHERE_API_KEY='<value>'` — verify with `kubectl get secret todo-secrets`
- [x] T034 [US2] Deploy backend Helm chart: `helm install todo-backend infra/helm/todo-backend` — verify with `kubectl get pods -l app=todo-backend`
- [x] T035 [US2] Deploy frontend Helm chart: `helm install todo-frontend infra/helm/todo-frontend` — verify with `kubectl get pods -l app=todo-frontend`
- [x] T036 [US2] Verify all 4 pods are running: `kubectl get pods`, then `kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s && kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s` — confirm 2 backend + 2 frontend replicas in Running state
- [x] T037 [US2] Verify services are reachable: `kubectl get svc`, then `minikube service todo-frontend --url` and `minikube service todo-backend --url` — access both URLs and confirm responses (frontend renders UI, backend returns health response)
- [x] T038 [US2] Validate secrets injection in pods: `kubectl exec <backend-pod> -- env | grep -E 'NEON_DB_URL|BETTER_AUTH_SECRET|COHERE_API_KEY'` — confirm env vars present in pods but NOT in any committed Git file

**Checkpoint**: User Story 2 fully functional. All 4 pods running, services reachable via NodePort, secrets properly injected from Kubernetes Secret.

---

## Phase 5: User Story 3 - Helm Chart Configuration and Reproducibility (Priority: P3)

**Goal**: Validate that Helm charts support scaling, image updates, and full environment reproducibility from Git artifacts.

**Independent Test**: Change replica count in values.yaml, run `helm upgrade`, verify new replica count. Uninstall and reinstall from Git artifacts on clean cluster.

### Implementation for User Story 3

- [ ] T039 [US3] Validate replica scaling: modify `infra/helm/todo-backend/values.yaml` replicaCount to 3, run `helm upgrade todo-backend infra/helm/todo-backend`, verify 3 backend pods with `kubectl get pods -l app=todo-backend`
- [ ] T040 [US3] Validate image tag update: build `todo-backend:v2` with a minor config change, update `infra/helm/todo-backend/values.yaml` image tag to `v2`, run `helm upgrade todo-backend infra/helm/todo-backend`, verify rolling update with `kubectl rollout status deployment/todo-backend`
- [ ] T041 [US3] Revert values changes: reset replicaCount to 2 and image tag to v1 in `infra/helm/todo-backend/values.yaml`, run `helm upgrade todo-backend infra/helm/todo-backend` — verify 2 pods restored
- [ ] T042 [US3] Validate reproducibility from scratch: run `helm uninstall todo-backend && helm uninstall todo-frontend && kubectl delete secret todo-secrets`, then redeploy following `specs/004-k8s-local-deployment/quickstart.md` steps 5–7 — verify identical running state

**Checkpoint**: Helm chart configuration features validated. Infrastructure is reproducible from Git artifacts alone.

---

## Phase 6: User Story 4 - AI-Assisted DevOps Validation (Priority: P4)

**Goal**: Validate AI DevOps tools can assist with infrastructure tasks under human governance; document tool availability and results.

**Independent Test**: Use each AI tool to generate a suggestion, review the output manually, verify no auto-execution occurs.

### Implementation for User Story 4

- [ ] T043 [US4] Test Gordon Dockerfile review: run `docker ai "Review infra/docker/backend.Dockerfile for optimization opportunities"` — if available, review suggestions without applying; document output in `infra/AI_DEVOPS_LOG.md`; if unavailable, record fallback
- [ ] T044 [US4] Test kubectl-ai for scaling: run `kubectl-ai "scale backend to 3 replicas"` — review suggested manifest/command without auto-applying; confirm 3-replica intent; document in `infra/AI_DEVOPS_LOG.md`; if unavailable, use `kubectl scale deployment todo-backend --replicas=3` manually
- [ ] T045 [US4] Apply kubectl-ai-confirmed scaling: after reviewing kubectl-ai output in T044, manually apply the validated command — verify backend scales to 3 replicas with `kubectl get pods -l app=todo-backend`
- [ ] T046 [US4] Test Kagent for cluster health analysis: run `kagent "analyze cluster health and resource usage"` — review recommendations without auto-modifying cluster state; if unavailable, run `kubectl top pods` as fallback; document findings in `infra/AI_DEVOPS_LOG.md`
- [ ] T047 [US4] Apply resource optimization if Kagent recommends adjustments: update `infra/helm/todo-backend/values.yaml` or `infra/helm/todo-frontend/values.yaml` resource limits/requests based on Kagent recommendations, run `helm upgrade todo-backend infra/helm/todo-backend` and/or `helm upgrade todo-frontend infra/helm/todo-frontend` — verify changes applied
- [x] T048 [US4] Create `infra/AI_DEVOPS_LOG.md` documenting: which AI tools were available, exact prompts used, outputs/suggestions received, whether human approved or rejected each suggestion, and fallback steps taken

**Checkpoint**: AI DevOps governance validated. All AI tool suggestions logged, reviewed by human, and applied only after explicit approval.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Automation scripts, end-to-end functional validation, documentation, and security review.

- [x] T049 [P] Create build automation script at `infra/scripts/build-images.sh` — builds both Docker images with correct tags, accepts optional version argument (default v1), runs `eval $(minikube docker-env)` before builds for Minikube compatibility
- [x] T050 [P] Create deployment automation script at `infra/scripts/deploy.sh` — creates secret if not exists, runs `helm install` for both charts, waits for pods ready, prints NodePort service URLs
- [x] T051 [P] Create validation script at `infra/scripts/validate.sh` — checks pod status (`kubectl get pods`), service reachability, backend `/health` endpoint response, secret presence in backend pods
- [ ] T052 End-to-end chatbot validation inside Kubernetes: access frontend via `minikube service todo-frontend --url`, sign in, then via chatbot: create a task, list tasks, complete a task, delete a task — verify all 5 todo operations work identically to local development (FR-015 / SC-004)
- [x] T053 [P] Create `infra/.env.example` documenting required secrets (NEON_DB_URL, BETTER_AUTH_SECRET, COHERE_API_KEY) with placeholder values and `kubectl create secret` usage instructions
- [x] T054 Write `docs/README-k8s.md` deployment guide including: Prerequisites (Docker Desktop ≥ 4.53, Minikube, kubectl, Helm v3), step-by-step deployment commands from `quickstart.md`, scaling instructions (`helm upgrade --set replicaCount=N`), and cluster teardown (`helm uninstall`, `kubectl delete secret`, `minikube stop`)
- [x] T055 [P] Security review checklist — verify all constitution requirements met: (1) no hardcoded secrets in any committed file (`git grep -r 'NEON_DB_URL\|COHERE_API_KEY\|BETTER_AUTH_SECRET' infra/ --include='*.yaml' --include='*.json'`), (2) resource limits defined in all Deployment templates, (3) both Dockerfiles use non-root users (`appuser`, `nextjs`), (4) no privileged containers in Helm templates (securityContext.allowPrivilegeEscalation: false), (5) document any RBAC restrictions applied
- [ ] T056 Commit all infrastructure artifacts to Git: `git add infra/ docs/` — verify no secrets in staged files, confirm Dockerfiles, Helm charts, scripts, documentation, and AI DevOps log are all tracked (FR-014)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — BLOCKS User Story 2
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs built images in Minikube Docker daemon)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (needs deployed Helm releases)
- **User Story 4 (Phase 6)**: Depends on User Story 2 (needs running cluster) — can run in parallel with US3
- **Polish (Phase 7)**: Depends on User Stories 1–3 complete; US4 is optional

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Requires US1 complete (Docker images must exist in Minikube daemon)
- **User Story 3 (P3)**: Requires US2 complete (Helm releases must be deployed)
- **User Story 4 (P4)**: Requires US2 complete (cluster must be running) — independent of US3

### Within Each User Story

- Dockerfiles before Docker builds (US1)
- Docker builds before Kubernetes deployment (US1 before US2)
- Chart.yaml + values.yaml before templates (US2)
- `_helpers.tpl` before deployment/service templates (US2)
- Helm template validation (T032) before `helm install` (US2)
- `kubectl create secret` (T033) before `helm install` (US2)
- Deployment before validation (all stories)

### Parallel Opportunities

- T002 + T003 (setup: `.dockerignore` + `.gitignore`)
- T005 + T006 + T007 (foundational: minikube + helm + kubectl — independent verifications)
- T010 + T011 (kubectl-ai + Kagent installation)
- T012 + T013 (backend + frontend Dockerfiles — different files)
- T014 + T015 (image builds — after Dockerfiles complete; different targets)
- T016 + T017 (container validation — different containers, different ports)
- T019 + T020 (Chart.yaml files — different charts)
- T023 + T024 (`_helpers.tpl` files — different charts)
- T025 + T026 (deployment templates — different charts)
- T027 + T028 (service templates — different charts)
- T029 + T030 (ConfigMap templates — different charts)
- T049 + T050 + T051 + T053 (polish scripts — different files)
- US3 + US4 (both depend on US2 but are fully independent of each other)

---

## Parallel Execution Examples

### User Story 1: Containerization

```bash
# After T009 (backend Dockerfile) AND T010 (frontend Dockerfile) complete:
Task: "Build backend image: docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile ."
Task: "Build frontend image: docker build -t todo-frontend:v1 ... -f infra/docker/frontend.Dockerfile ."

# After both builds complete:
Task: "Validate backend container on port 8000"
Task: "Validate frontend container on port 3000"
```

### User Story 2: Kubernetes Deployment

```bash
# In parallel after Phase 3 complete:
Task: "Create infra/helm/todo-backend/Chart.yaml"
Task: "Create infra/helm/todo-frontend/Chart.yaml"

# In parallel after Chart.yaml:
Task: "Create todo-backend/_helpers.tpl"
Task: "Create todo-frontend/_helpers.tpl"

# In parallel within each chart:
Task: "Create deployment.yaml"
Task: "Create service.yaml"
Task: "Create configmap.yaml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Containerize)
4. **STOP and VALIDATE**: Build and run both Docker images locally
5. Both containers serve correctly → **MVP complete**

### Incremental Delivery

1. Setup + Foundational → Infrastructure and tooling ready
2. User Story 1 → Docker images built and validated (**MVP!**)
3. User Story 2 → Full Kubernetes deployment on Minikube
4. User Story 3 → Helm configurability and reproducibility validated
5. User Story 4 → AI DevOps tools tested and documented (optional)
6. Polish → Scripts, README, security review, e2e validation, commit

### Full Deployment (Single Developer, Sequential)

1. Phase 1–2: ~20 min (setup + tool verification + AI tool installation)
2. Phase 3: ~30 min (Dockerfiles + builds + container validation)
3. Phase 4: ~45 min (Helm charts + `helm template` + deploy + validation)
4. Phase 5: ~15 min (scaling + image update + reproducibility test)
5. Phase 6: ~20 min (AI tools, optional if available)
6. Phase 7: ~30 min (scripts + e2e chatbot test + README + security review + commit)

---

## Definition of Done

- [ ] Minikube cluster running with 1 node
- [ ] Frontend + Backend deployed with 2 replicas each (4 pods total)
- [ ] Helm fully manages all deployments (no manual kubectl apply)
- [ ] Secrets stored in Kubernetes Secret only — never in committed files
- [ ] Chatbot fully functional inside Kubernetes (create, list, complete, delete, AI chat)
- [ ] AI DevOps tooling used and documented in `infra/AI_DEVOPS_LOG.md`
- [ ] Deployment reproducible from scratch in under 10 minutes (SC-005)
- [ ] All infrastructure artifacts version-controlled in Git (FR-014)
- [ ] Security review passed (T055): no hardcoded secrets, resource limits set, non-root users, no privileged containers

---

## Notes

- `[P]` tasks = different files, no blocking dependencies between them
- `[Story]` label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- US1 → US2 is a hard dependency (images must exist in Minikube Docker daemon)
- US3 and US4 can run in parallel after US2
- AI DevOps tasks (US4) are optional if tools are unavailable — manual CLI fallback always works
- All AI tool suggestions require explicit human review before execution (FR-013, SC-008)
