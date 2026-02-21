#!/usr/bin/env bash
# build-images.sh — Build Docker images for todo-backend and todo-frontend
# Usage: ./infra/scripts/build-images.sh [VERSION]
# Example: ./infra/scripts/build-images.sh v2
# Default version: v1

set -euo pipefail

VERSION="${1:-v1}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "=========================================="
echo "  Todo AI Chatbot — Image Builder"
echo "  Version: ${VERSION}"
echo "  Repo root: ${REPO_ROOT}"
echo "=========================================="

# Configure Docker to use Minikube's Docker daemon
# This ensures images are available to Minikube without a registry
echo ""
echo "[1/4] Configuring Docker to use Minikube's Docker daemon..."
if ! minikube status &>/dev/null; then
  echo "ERROR: Minikube is not running. Start it with:"
  echo "  minikube start --cpus=4 --memory=8192"
  exit 1
fi

eval "$(minikube docker-env)"
echo "  ✓ Docker configured for Minikube"

# Get Minikube IP for NEXT_PUBLIC_* vars
MINIKUBE_IP="$(minikube ip)"
BACKEND_NODEPORT="30080"
FRONTEND_NODEPORT="30030"

echo ""
echo "[2/4] Building backend image: todo-backend:${VERSION}..."
docker build \
  -t "todo-backend:${VERSION}" \
  -f "${REPO_ROOT}/infra/docker/backend.Dockerfile" \
  "${REPO_ROOT}"
echo "  ✓ Built todo-backend:${VERSION}"

echo ""
echo "[3/4] Building frontend image: todo-frontend:${VERSION}..."
docker build \
  -t "todo-frontend:${VERSION}" \
  --build-arg "NEXT_PUBLIC_API_BASE_URL=http://${MINIKUBE_IP}:${BACKEND_NODEPORT}/api" \
  --build-arg "NEXT_PUBLIC_BETTER_AUTH_URL=http://${MINIKUBE_IP}:${FRONTEND_NODEPORT}" \
  -f "${REPO_ROOT}/infra/docker/frontend.Dockerfile" \
  "${REPO_ROOT}"
echo "  ✓ Built todo-frontend:${VERSION}"

echo ""
echo "[4/4] Verifying images..."
docker images | grep -E "todo-backend|todo-frontend" | head -10

echo ""
echo "=========================================="
echo "  Build complete!"
echo ""
echo "  Images built:"
echo "    todo-backend:${VERSION}"
echo "    todo-frontend:${VERSION}"
echo ""
echo "  Next step: ./infra/scripts/deploy.sh ${VERSION}"
echo "=========================================="
