---
id: 4
title: Docker Recovery Host Daemon Rebuild
stage: general
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 004-k8s-local-deployment
branch: 004-k8s-local-deployment
user: rubab_bukhari
command: general
labels: ["docker","minikube","recovery","helm","containerization","phase-3"]
links:
  spec: specs/004-k8s-local-deployment/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - infra/helm/todo-backend/Chart.yaml
  - infra/helm/todo-backend/values.yaml
  - infra/helm/todo-backend/templates/_helpers.tpl
  - infra/helm/todo-backend/templates/deployment.yaml
  - infra/helm/todo-backend/templates/service.yaml
  - infra/helm/todo-backend/templates/configmap.yaml
  - infra/helm/todo-backend/templates/secret.yaml
  - infra/helm/todo-frontend/Chart.yaml
  - infra/helm/todo-frontend/values.yaml
  - infra/helm/todo-frontend/templates/_helpers.tpl
  - infra/helm/todo-frontend/templates/deployment.yaml
  - infra/helm/todo-frontend/templates/service.yaml
  - infra/helm/todo-frontend/templates/configmap.yaml
  - ~/.docker/config.json (removed credsStore: desktop.exe)
tests:
  - docker images todo-backend:v1 (verified 479MB image exists)
  - minikube image load todo-backend:v1 (in progress)
  - docker build todo-frontend:v1 (in progress)
---

## Prompt

We are currently stuck in Phase 3 (Containerization).

The frontend Docker build is hanging because it is being executed inside the Minikube docker-env, and the system has limited memory (~2.8GB total). This causes Docker DNS instability and resource starvation.

You must:

1. Abort any ongoing Docker build running inside minikube docker-env.
2. Exit the minikube docker context using:
   eval $(minikube docker-env -u)

3. Rebuild both backend and frontend images using the HOST Docker daemon (not inside Minikube).

4. After successful build, load images into Minikube using:
   minikube image load <image-name>

5. Verify images exist in Minikube.

6. Update Helm values.yaml to ensure:
   imagePullPolicy: Never

7. Continue Phase 3 implementation without modifying the Spec-Driven Development process.

Constraints:
- Do NOT rebuild Minikube.
- Do NOT increase Minikube memory.
- Do NOT build images inside minikube docker-env again.
- Keep everything compliant with the existing spec, plan, and tasks.
- Maintain agentic workflow discipline (no manual shortcuts).

After recovery, proceed to Phase 4 deployment tasks.

Explain each step before executing it.

## Response snapshot

Recovery workflow executed in order:

1. **Verified no hanging builds**: No `docker build` processes running; no Minikube docker-env vars (`DOCKER_TLS_VERIFY`, `DOCKER_CERT_PATH`, `MINIKUBE_ACTIVE_DOCKERD`) were set — already on host daemon.

2. **Fixed WSL2 credential helper blocker**: Docker config had `credsStore: desktop.exe` which is a Windows binary incompatible with WSL2. Removed `credsStore` key from `~/.docker/config.json` to allow anonymous pulls of public images.

3. **Built `todo-backend:v1`**: `docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile .` — SUCCESS (479MB, exit code 0).

4. **Building `todo-frontend:v1`**: Multi-stage build running in background.

5. **Loading `todo-backend:v1` into Minikube**: `minikube image load todo-backend:v1` running in background.

6. **Created all Helm chart files** (T016-T028):
   - `Chart.yaml` for both charts
   - `values.yaml` with `imagePullPolicy: Never` for both
   - `templates/_helpers.tpl`, `deployment.yaml`, `service.yaml`, `configmap.yaml`, `secret.yaml` for backend
   - `templates/_helpers.tpl`, `deployment.yaml`, `service.yaml`, `configmap.yaml` for frontend

7. **Key deviation from contract**: Contract specifies `pullPolicy: IfNotPresent` but recovery mandate requires `Never`. Applied `Never` as instructed — correct for `minikube image load` workflow.

## Outcome

- ✅ Impact: Unblocked Phase 3 build by switching from Minikube docker-env to host daemon; fixed WSL2 credsStore issue; backend image built successfully; Helm charts fully scaffolded
- 🧪 Tests: docker images todo-backend:v1 → 479MB confirmed; frontend build + minikube load in progress
- 📁 Files: 13 new infrastructure files created across infra/helm/
- 🔁 Next prompts: Complete frontend build verification; load frontend image into Minikube; create K8s secret; helm install both charts; validate pods
- 🧠 Reflection: Root cause was double failure: Minikube docker-env memory starvation + WSL2 credsStore incompatibility. Both fixed without touching Minikube config.

## Evaluation notes (flywheel)

- Failure modes observed: WSL2 Docker credential helper (desktop.exe) blocks all builds even on host daemon; Minikube docker-env causes DNS instability under low memory
- Graders run and results (PASS/FAIL): docker build backend PASS; frontend build in progress; minikube load in progress
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Verify frontend build completes without npm ci OOM; if OOM, reduce replicaCount in values.yaml to 1
