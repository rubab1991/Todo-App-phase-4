#!/usr/bin/env bash
# validate.sh — Post-deployment validation for Todo AI Chatbot on Minikube
# Usage: ./infra/scripts/validate.sh
#
# Checks:
#   1. All 4 pods are in Running state
#   2. Services are reachable via NodePort
#   3. Backend /health endpoint responds
#   4. Frontend / returns HTML
#   5. Secrets are injected in backend pods (not hardcoded)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PASS=0
FAIL=0

check() {
  local description="$1"
  local result="$2"
  if [[ "${result}" == "PASS" ]]; then
    echo "  ✅ ${description}"
    ((PASS++))
  else
    echo "  ❌ ${description}: ${result}"
    ((FAIL++))
  fi
}

echo "=========================================="
echo "  Todo AI Chatbot — Deployment Validator"
echo "=========================================="

# Check 1: Pod status
echo ""
echo "[1/5] Checking pod status..."
BACKEND_PODS="$(kubectl get pods -l app=todo-backend --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l | tr -d ' ')"
FRONTEND_PODS="$(kubectl get pods -l app=todo-frontend --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l | tr -d ' ')"

[[ "${BACKEND_PODS}" -ge 2 ]] && check "Backend: ${BACKEND_PODS} running pod(s)" "PASS" || check "Backend pods" "Expected ≥2, got ${BACKEND_PODS}"
[[ "${FRONTEND_PODS}" -ge 2 ]] && check "Frontend: ${FRONTEND_PODS} running pod(s)" "PASS" || check "Frontend pods" "Expected ≥2, got ${FRONTEND_PODS}"

kubectl get pods 2>/dev/null

# Check 2: Services exist
echo ""
echo "[2/5] Checking services..."
kubectl get svc todo-backend &>/dev/null && check "Service todo-backend exists" "PASS" || check "Service todo-backend" "NOT FOUND"
kubectl get svc todo-frontend &>/dev/null && check "Service todo-frontend exists" "PASS" || check "Service todo-frontend" "NOT FOUND"

# Check 3: Backend health endpoint
echo ""
echo "[3/5] Checking backend health endpoint..."
BACKEND_URL="$(minikube service todo-backend --url 2>/dev/null | head -1)"
if [[ -n "${BACKEND_URL}" ]]; then
  HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/health" --max-time 10 2>/dev/null || echo "TIMEOUT")"
  [[ "${HTTP_STATUS}" == "200" ]] && check "Backend /health → HTTP ${HTTP_STATUS}" "PASS" || check "Backend /health" "HTTP ${HTTP_STATUS} (expected 200)"
else
  check "Backend service URL" "Could not get URL"
fi

# Check 4: Frontend serves HTML
echo ""
echo "[4/5] Checking frontend serves HTML..."
FRONTEND_URL="$(minikube service todo-frontend --url 2>/dev/null | head -1)"
if [[ -n "${FRONTEND_URL}" ]]; then
  HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}" --max-time 15 2>/dev/null || echo "TIMEOUT")"
  [[ "${HTTP_STATUS}" == "200" ]] && check "Frontend / → HTTP ${HTTP_STATUS}" "PASS" || check "Frontend /" "HTTP ${HTTP_STATUS} (expected 200)"
  # Verify it's actually HTML
  CONTENT_TYPE="$(curl -s -I "${FRONTEND_URL}" --max-time 15 2>/dev/null | grep -i 'content-type' | head -1 || echo "")"
  [[ "${CONTENT_TYPE}" == *"text/html"* ]] && check "Frontend content-type is text/html" "PASS" || check "Frontend content-type" "${CONTENT_TYPE}"
else
  check "Frontend service URL" "Could not get URL"
fi

# Check 5: Secrets are injected in backend pods (not hardcoded)
echo ""
echo "[5/5] Checking secret injection in backend pods..."
BACKEND_POD="$(kubectl get pods -l app=todo-backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")"
if [[ -n "${BACKEND_POD}" ]]; then
  # Check env vars exist (confirms secrets injected)
  NEON_PRESENT="$(kubectl exec "${BACKEND_POD}" -- env 2>/dev/null | grep -c 'NEON_DB_URL' || echo "0")"
  AUTH_PRESENT="$(kubectl exec "${BACKEND_POD}" -- env 2>/dev/null | grep -c 'BETTER_AUTH_SECRET' || echo "0")"
  COHERE_PRESENT="$(kubectl exec "${BACKEND_POD}" -- env 2>/dev/null | grep -c 'COHERE_API_KEY' || echo "0")"
  [[ "${NEON_PRESENT}" -ge 1 ]] && check "NEON_DB_URL injected in pod" "PASS" || check "NEON_DB_URL" "NOT FOUND in pod env"
  [[ "${AUTH_PRESENT}" -ge 1 ]] && check "BETTER_AUTH_SECRET injected in pod" "PASS" || check "BETTER_AUTH_SECRET" "NOT FOUND in pod env"
  [[ "${COHERE_PRESENT}" -ge 1 ]] && check "COHERE_API_KEY injected in pod" "PASS" || check "COHERE_API_KEY" "NOT FOUND in pod env"
else
  check "Backend pod accessible for env check" "No running pod found"
fi

# Summary
echo ""
echo "=========================================="
echo "  Validation Summary"
echo "  PASS: ${PASS} | FAIL: ${FAIL}"
if [[ "${FAIL}" -eq 0 ]]; then
  echo "  ✅ All checks passed!"
  echo ""
  echo "  Application URLs:"
  [[ -n "${FRONTEND_URL:-}" ]] && echo "    Frontend: ${FRONTEND_URL}"
  [[ -n "${BACKEND_URL:-}" ]] && echo "    Backend:  ${BACKEND_URL}"
else
  echo "  ❌ ${FAIL} check(s) failed — see details above"
  echo "  Troubleshoot:"
  echo "    kubectl logs <pod-name>"
  echo "    kubectl describe pod <pod-name>"
  echo "    kubectl get events --sort-by='.lastTimestamp'"
fi
echo "=========================================="

[[ "${FAIL}" -eq 0 ]] && exit 0 || exit 1
