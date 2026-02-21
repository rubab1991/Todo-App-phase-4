# Research: Local Kubernetes Deployment for Todo Chatbot

**Feature**: 004-k8s-local-deployment
**Date**: 2026-02-19

## Research Findings

### R1: Existing Dockerfile Issues

**Decision**: Rewrite both Dockerfiles from scratch in `infra/docker/`

**Rationale**: The existing `deploy/Dockerfile.backend` has critical issues:
- References `src.main:app` but actual entry point is `src.api.main:app`
- References `pyproject.toml` and `alembic.ini` which do not exist in the repo
- Attempts alembic migrations but no migration system is set up
- Uses `gcc` and `postgresql-client` packages unnecessarily for runtime

The existing `deploy/Dockerfile.frontend` has issues:
- Uses `node:18-alpine` but project requires Node.js 20 (Next.js 16 compatibility)
- Missing `next.config.js`, `tailwind.config.js`, `postcss.config.js` in builder stage
- Missing `public/` directory copy in builder stage

**Alternatives considered**:
- Fix existing Dockerfiles in place → Rejected: too many issues; cleaner to start fresh with correct paths
- Use Gordon to generate → Acceptable fallback but manual creation ensures correctness

### R2: Backend Container Strategy

**Decision**: Single-stage build with `python:3.11-slim`

**Rationale**:
- Python apps don't benefit from multi-stage builds like compiled languages
- Slim base reduces image size (vs full python:3.11)
- Non-root user `appuser` created with `useradd`
- Entry point: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`
- Environment variables injected at runtime via K8s Secrets/ConfigMaps (NOT baked into image)

**Key findings from codebase analysis**:
- `backend/src/config.py` reads: `neon_db_url`, `database_url`, `better_auth_secret`, `cohere_api_key`, `debug`, `log_level`
- `backend/src/db.py` reads `NEON_DB_URL` directly from `os.getenv`
- The backend uses asyncpg which requires `libpq` at runtime — slim image may need `libpq-dev` or the pip package handles it

### R3: Frontend Container Strategy

**Decision**: Multi-stage build with `node:20-alpine`

**Rationale**:
- Next.js requires a build step (`npm run build`) producing `.next/` output
- Multi-stage separates build deps from runtime, reducing final image size
- Builder stage: install all deps, copy all source, run `npm run build`
- Runtime stage: install production deps only, copy `.next/`, `public/`, `next.config.js`
- Must copy `tailwind.config.js` and `postcss.config.js` to builder (Tailwind needs them at build time)
- Standalone output mode not configured; use standard `npm start`

**Key frontend files required for build**:
- `package.json`, `package-lock.json`
- `app/`, `components/`, `hooks/`, `lib/`, `types/`, `public/`
- `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`

### R4: Frontend Environment Variables at Build Time

**Decision**: Use build args for `NEXT_PUBLIC_*` variables; runtime vars for server-side

**Rationale**:
- Next.js inlines `NEXT_PUBLIC_*` variables at build time
- Inside Kubernetes, the frontend needs to reach the backend via the K8s service name
- `NEXT_PUBLIC_API_BASE_URL` must be set at build time to the backend service URL
- In Minikube: backend service accessible at `http://todo-backend:8000/api` (ClusterIP) from within the cluster
- For browser-side requests: frontend needs to proxy or the user accesses via NodePort

**Challenge**: `NEXT_PUBLIC_*` vars are baked into the JS bundle. For K8s, the frontend makes API calls from the browser (client-side), so the URL must be accessible from outside the cluster. Solution: Use Minikube's NodePort for the backend too, or configure the frontend as a proxy.

**Resolution**: Backend exposed via NodePort as well. `NEXT_PUBLIC_API_BASE_URL` set to the Minikube backend NodePort URL at build time (or use a ConfigMap-driven approach with runtime injection).

### R5: Helm Chart Architecture

**Decision**: Two separate Helm charts: `todo-backend` and `todo-frontend`

**Rationale**:
- Constitution X requires Helm-managed manifests
- Constitution IX requires separate deployments for backend and frontend
- Each chart contains: Deployment, Service, ConfigMap, Secret templates
- `values.yaml` provides configurability for replicas, image tag, env vars
- Secrets created as separate K8s Secret resources, referenced via `secretKeyRef` in deployments

**Chart structure per service**:
- `Chart.yaml`: name, version, appVersion
- `values.yaml`: replica count, image repo/tag, resource limits, env vars
- `templates/deployment.yaml`: Pod spec with env from secrets/configmaps
- `templates/service.yaml`: ClusterIP or NodePort
- `templates/configmap.yaml`: Non-sensitive config
- `templates/secret.yaml`: Sensitive values (base64 encoded)
- `templates/_helpers.tpl`: Template helpers

### R6: Resource Limits

**Decision**: Conservative defaults for local Minikube

**Rationale**:
- Backend: requests 128Mi/100m, limits 256Mi/200m
- Frontend: requests 128Mi/100m, limits 256Mi/200m
- Total for 4 pods: ~1GB RAM, 800m CPU — well within Minikube defaults (2 CPU, 4GB RAM)
- Configurable via `values.yaml`

### R7: Service Networking in Minikube

**Decision**: Backend uses ClusterIP; Frontend uses NodePort

**Rationale**:
- Backend only needs to be reachable from within the cluster (by frontend pods) → ClusterIP
- Frontend needs to be accessible from the developer's browser → NodePort
- `minikube service todo-frontend` exposes the NodePort URL
- For API calls from the browser: backend also needs a NodePort (or frontend acts as API proxy)

**Updated decision**: Both services use NodePort for Minikube local access. The frontend's browser-side JS needs to reach the backend directly. Alternative: implement API proxy in Next.js (already has `app/api/` routes).

### R8: Database Connectivity from Kubernetes

**Decision**: Neon PostgreSQL is external; pods connect via `NEON_DB_URL` env var

**Rationale**:
- No local PostgreSQL needed (unlike the broken docker-compose.yml which had a local PG)
- Neon is internet-accessible; Minikube pods have internet access by default
- `NEON_DB_URL` injected via Kubernetes Secret
- No special networking configuration needed

### R9: AI DevOps Tools Availability

**Decision**: All AI tools (Gordon, kubectl-ai, Kagent) are optional; manual CLI is the primary path

**Rationale**:
- Gordon requires Docker Desktop with AI features enabled — may not be available
- kubectl-ai and Kagent are separate tools that may not be installed
- All infrastructure artifacts are created manually first
- AI tools can be used to optimize/validate after manual creation
- Constitution XI requires human review regardless
