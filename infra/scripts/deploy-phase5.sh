#!/usr/bin/env bash
# Phase V deployment script — Minikube + Dapr + Redpanda
set -euo pipefail

NAMESPACE="todo"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"

log() { echo "[phase5] $*"; }

# ── Prerequisites ─────────────────────────────────────────────────────────────
command -v minikube >/dev/null || { log "ERROR: minikube not found"; exit 1; }
command -v kubectl  >/dev/null || { log "ERROR: kubectl not found"; exit 1; }
command -v helm     >/dev/null || { log "ERROR: helm not found"; exit 1; }
command -v dapr     >/dev/null || { log "ERROR: dapr CLI not found. Install: https://docs.dapr.io/getting-started/install-dapr-cli/"; exit 1; }

# ── Start Minikube ────────────────────────────────────────────────────────────
log "Starting Minikube..."
minikube start --cpus=4 --memory=6g --driver=docker 2>/dev/null || log "Minikube already running"
eval "$(minikube docker-env)"

# ── Install Dapr into cluster ─────────────────────────────────────────────────
log "Initializing Dapr in Kubernetes..."
dapr init -k --wait || log "Dapr already initialized"

# ── Build Docker images ───────────────────────────────────────────────────────
log "Building backend image..."
docker build -t todo-backend:v2 -f "$INFRA_DIR/docker/backend.Dockerfile" "$(dirname "$INFRA_DIR")/backend"

log "Building frontend image..."
docker build -t todo-frontend:v2 -f "$INFRA_DIR/docker/frontend.Dockerfile" "$(dirname "$INFRA_DIR")/frontend"

# ── Apply K8s manifests ───────────────────────────────────────────────────────
log "Creating namespace..."
kubectl apply -f "$INFRA_DIR/k8s/namespace.yaml"

log "Applying secrets..."
kubectl apply -f "$INFRA_DIR/k8s/secrets.yaml"

# Apply the main K8s secrets (NEON_DB_URL etc.) if they don't exist
if ! kubectl get secret todo-secrets -n "$NAMESPACE" >/dev/null 2>&1; then
  log "WARNING: todo-secrets not found. Create it:"
  log "  kubectl create secret generic todo-secrets -n $NAMESPACE \\"
  log "    --from-literal=NEON_DB_URL=<your-neon-url> \\"
  log "    --from-literal=BETTER_AUTH_SECRET=<secret> \\"
  log "    --from-literal=COHERE_API_KEY=<key>"
fi

log "Deploying Redis (Dapr state store)..."
kubectl apply -f "$INFRA_DIR/k8s/redis.yaml"

log "Applying Dapr components..."
kubectl apply -f "$INFRA_DIR/dapr/components/"

log "Applying Dapr configuration..."
kubectl apply -f "$INFRA_DIR/k8s/dapr-config.yaml"

log "Deploying backend..."
kubectl apply -f "$INFRA_DIR/k8s/backend-deployment.yaml"

log "Deploying frontend..."
kubectl apply -f "$INFRA_DIR/k8s/frontend-deployment.yaml"

# ── Wait for rollout ──────────────────────────────────────────────────────────
log "Waiting for backend rollout..."
kubectl rollout status deployment/todo-backend -n "$NAMESPACE" --timeout=120s

log "Waiting for frontend rollout..."
kubectl rollout status deployment/todo-frontend -n "$NAMESPACE" --timeout=120s

# ── Print access info ─────────────────────────────────────────────────────────
FRONTEND_URL=$(minikube service todo-frontend -n "$NAMESPACE" --url 2>/dev/null || echo "run: minikube service todo-frontend -n $NAMESPACE --url")
log ""
log "========================================"
log " Phase V deployment complete!"
log " Frontend: $FRONTEND_URL"
log " Backend:  http://$(minikube ip):$(kubectl get svc todo-backend -n $NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo '<nodeport>')"
log "========================================"
