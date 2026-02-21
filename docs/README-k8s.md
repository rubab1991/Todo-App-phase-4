# Local Kubernetes Deployment Guide — Todo AI Chatbot

Deploy the Todo AI Chatbot on a local Minikube cluster using Docker, Helm, and Kubernetes.

---

## Prerequisites

Install and verify all tools before proceeding:

```bash
# Docker Desktop 4.53+ (https://docs.docker.com/desktop/)
docker --version           # Must show Docker Desktop 4.53+

# Minikube (https://minikube.sigs.k8s.io/docs/start/)
minikube version           # v1.38.0+

# kubectl (https://kubernetes.io/docs/tasks/tools/)
kubectl version --client   # v1.28+

# Helm v3 (https://helm.sh/docs/intro/install/)
helm version               # v3.x
```

**Minimum resources**: 4 CPU, 8 GB RAM for Minikube.

---

## Step-by-Step Deployment

### 1. Start Minikube

```bash
minikube start --cpus=4 --memory=8192
minikube status
kubectl get nodes
```

Expected: 1 node in `Ready` state.

### 2. Configure Docker to Use Minikube's Daemon

```bash
eval $(minikube docker-env)
```

This ensures locally built images are available to Minikube **without needing a registry**.

> ⚠️ Run this in every new terminal session before building images.

### 3. Build Docker Images

```bash
# From repository root
./infra/scripts/build-images.sh v1
```

Or manually:

```bash
# Backend (build context = repo root)
docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile .

# Frontend — set NEXT_PUBLIC_* vars to Minikube NodePort URLs
docker build -t todo-frontend:v1 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://$(minikube ip):30080/api \
  --build-arg NEXT_PUBLIC_BETTER_AUTH_URL=http://$(minikube ip):30030 \
  -f infra/docker/frontend.Dockerfile .
```

### 4. Create Kubernetes Secret

Secrets must be created **before** Helm install. They are never committed to Git.

```bash
kubectl create secret generic todo-secrets \
  --from-literal=NEON_DB_URL='postgresql+asyncpg://user:pass@host/db?sslmode=require' \
  --from-literal=BETTER_AUTH_SECRET='your-32-char-secret' \
  --from-literal=COHERE_API_KEY='your-cohere-api-key'

# Verify secret created
kubectl get secret todo-secrets
```

See `infra/.env.example` for value format guidance.

### 5. Deploy with Helm

```bash
# Deploy both services
helm install todo-backend infra/helm/todo-backend
helm install todo-frontend infra/helm/todo-frontend

# Or use the deployment script:
./infra/scripts/deploy.sh v1
```

### 6. Verify Deployment

```bash
# Watch pods come up (expect 4 total: 2 backend + 2 frontend)
kubectl get pods --watch

# Wait until all are ready
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s

# Check services
kubectl get svc
```

### 7. Access the Application

```bash
# Get URLs
minikube service todo-frontend --url   # Open in browser
minikube service todo-backend --url    # API base URL
```

Open the frontend URL in your browser. You should see the Todo AI Chatbot UI.

### 8. Validate Functionality

```bash
./infra/scripts/validate.sh
```

Manual validation:
1. Sign up / sign in through the UI
2. Create a task via the chatbot: *"Add task: Review Kubernetes deployment"*
3. List tasks: *"Show my tasks"*
4. Complete a task: *"Mark the Kubernetes task as done"*
5. Delete a task: *"Delete the Kubernetes task"*
6. Verify AI chat works correctly for all operations

---

## How to Scale

### Scale via Helm (recommended)

```bash
# Scale backend to 3 replicas
helm upgrade todo-backend infra/helm/todo-backend --set replicaCount=3

# Scale frontend to 3 replicas
helm upgrade todo-frontend infra/helm/todo-frontend --set replicaCount=3

# Verify
kubectl get pods
```

### Scale via kubectl

```bash
kubectl scale deployment todo-backend --replicas=3
kubectl scale deployment todo-frontend --replicas=3
```

### Update Image Version

```bash
# 1. Build new image (with Minikube Docker env active)
docker build -t todo-backend:v2 -f infra/docker/backend.Dockerfile .

# 2. Upgrade Helm release
helm upgrade todo-backend infra/helm/todo-backend --set image.tag=v2

# 3. Monitor rollout
kubectl rollout status deployment/todo-backend
```

---

## How to Destroy the Cluster

### Remove application only (keep Minikube)

```bash
helm uninstall todo-backend
helm uninstall todo-frontend
kubectl delete secret todo-secrets
```

### Full teardown

```bash
helm uninstall todo-backend 2>/dev/null || true
helm uninstall todo-frontend 2>/dev/null || true
kubectl delete secret todo-secrets 2>/dev/null || true
minikube stop
minikube delete   # WARNING: removes all cluster data
```

### Restart from scratch

```bash
minikube start --cpus=4 --memory=8192
eval $(minikube docker-env)
./infra/scripts/build-images.sh v1
./infra/scripts/deploy.sh v1
```

Full re-deployment from Git artifacts takes under 10 minutes.

---

## Troubleshooting

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| `ImagePullBackOff` | Image not in Minikube daemon | Re-run `eval $(minikube docker-env)` and rebuild |
| `CrashLoopBackOff` | App startup failure | `kubectl logs <pod-name>` |
| `Pending` pods | Insufficient resources | `kubectl describe pod <pod-name>` → check events |
| `NEON_DB_URL` error | Secret missing or wrong format | `kubectl describe secret todo-secrets` |
| Frontend can't reach backend | Wrong `NEXT_PUBLIC_API_BASE_URL` | Rebuild frontend with correct Minikube IP |
| Helm install fails | Release already exists | Use `helm upgrade` instead of `helm install` |

### Useful debugging commands

```bash
# Pod logs
kubectl logs -l app=todo-backend --tail=50
kubectl logs -l app=todo-frontend --tail=50

# Pod details
kubectl describe pod <pod-name>

# Recent cluster events
kubectl get events --sort-by='.lastTimestamp' | tail -20

# Exec into pod
kubectl exec -it <backend-pod> -- /bin/bash

# Check secret injection in pod
kubectl exec <backend-pod> -- env | grep -E 'NEON|COHERE|BETTER_AUTH'
```

---

## Architecture

```
Browser
  └─→ Minikube NodePort (frontend:30030)
        └─→ todo-frontend pods (2 replicas)
              └─→ Minikube ClusterIP/NodePort (backend:30080)
                    └─→ todo-backend pods (2 replicas)
                          └─→ Neon PostgreSQL (external)
                          └─→ Cohere API (external)
```

All secrets are injected via Kubernetes Secret `todo-secrets`. No secrets are baked into images or committed to Git.
