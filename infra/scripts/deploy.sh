#!/usr/bin/env bash
# deploy.sh — Deploy todo-backend and todo-frontend to Minikube via Helm
# Usage: ./infra/scripts/deploy.sh [VERSION]
# Example: ./infra/scripts/deploy.sh v2
# Default version: v1
#
# Prerequisites:
#   - Minikube running: minikube start --cpus=4 --memory=8192
#   - Docker configured: eval $(minikube docker-env)
#   - Images built: ./infra/scripts/build-images.sh
#   - Secrets populated in environment or prompted below

set -euo pipefail

VERSION="${1:-v1}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HELM_DIR="${REPO_ROOT}/infra/helm"

echo "=========================================="
echo "  Todo AI Chatbot — Kubernetes Deployer"
echo "  Version: ${VERSION}"
echo "=========================================="

# Verify prerequisites
echo ""
echo "[1/6] Verifying prerequisites..."
minikube status &>/dev/null || { echo "ERROR: Minikube not running. Run: minikube start --cpus=4 --memory=8192"; exit 1; }
kubectl cluster-info &>/dev/null || { echo "ERROR: kubectl cannot reach cluster"; exit 1; }
helm version &>/dev/null || { echo "ERROR: Helm not found"; exit 1; }
echo "  ✓ Minikube, kubectl, Helm all available"

# Create Kubernetes secret (skip if already exists)
echo ""
echo "[2/6] Checking for Kubernetes secret 'todo-secrets'..."
if kubectl get secret todo-secrets &>/dev/null; then
  echo "  ✓ Secret 'todo-secrets' already exists — skipping creation"
else
  echo "  Secret 'todo-secrets' not found. Creating..."
  echo ""

  # Prompt for secret values if not in environment
  if [[ -z "${NEON_DB_URL:-}" ]]; then
    read -rsp "  Enter NEON_DB_URL (input hidden): " NEON_DB_URL
    echo ""
  fi
  if [[ -z "${BETTER_AUTH_SECRET:-}" ]]; then
    read -rsp "  Enter BETTER_AUTH_SECRET (input hidden): " BETTER_AUTH_SECRET
    echo ""
  fi
  if [[ -z "${COHERE_API_KEY:-}" ]]; then
    read -rsp "  Enter COHERE_API_KEY (input hidden): " COHERE_API_KEY
    echo ""
  fi

  kubectl create secret generic todo-secrets \
    --from-literal="NEON_DB_URL=${NEON_DB_URL}" \
    --from-literal="BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}" \
    --from-literal="COHERE_API_KEY=${COHERE_API_KEY}"
  echo "  ✓ Secret 'todo-secrets' created"
fi

# Deploy or upgrade backend
echo ""
echo "[3/6] Deploying backend (version: ${VERSION})..."
if helm status todo-backend &>/dev/null; then
  echo "  Upgrading existing release..."
  helm upgrade todo-backend "${HELM_DIR}/todo-backend" --set "image.tag=${VERSION}"
else
  echo "  Installing new release..."
  helm install todo-backend "${HELM_DIR}/todo-backend" --set "image.tag=${VERSION}"
fi
echo "  ✓ Backend Helm release deployed"

# Deploy or upgrade frontend
echo ""
echo "[4/6] Deploying frontend (version: ${VERSION})..."
if helm status todo-frontend &>/dev/null; then
  echo "  Upgrading existing release..."
  helm upgrade todo-frontend "${HELM_DIR}/todo-frontend" --set "image.tag=${VERSION}"
else
  echo "  Installing new release..."
  helm install todo-frontend "${HELM_DIR}/todo-frontend" --set "image.tag=${VERSION}"
fi
echo "  ✓ Frontend Helm release deployed"

# Wait for pods
echo ""
echo "[5/6] Waiting for pods to be ready (timeout: 120s)..."
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
echo "  ✓ All pods ready"

# Print service URLs
echo ""
echo "[6/6] Retrieving service URLs..."
BACKEND_URL="$(minikube service todo-backend --url 2>/dev/null || echo 'Run: minikube service todo-backend --url')"
FRONTEND_URL="$(minikube service todo-frontend --url 2>/dev/null || echo 'Run: minikube service todo-frontend --url')"

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo ""
echo "  Services:"
echo "    Frontend: ${FRONTEND_URL}"
echo "    Backend:  ${BACKEND_URL}"
echo ""
echo "  Verify with:"
echo "    kubectl get pods"
echo "    kubectl get svc"
echo ""
echo "  Validate with:"
echo "    ./infra/scripts/validate.sh"
echo "=========================================="
