# Docker AI DevOps Tools — Capability Summary

**Feature**: 004-k8s-local-deployment
**Date**: 2026-02-21
**Task**: T009 — Gordon capability test; T010 — kubectl-ai; T011 — Kagent

---

## Gordon (Docker AI)

**Installation**: Enable via Docker Desktop → Settings → Beta Features → Docker AI

**Validation command**:
```bash
docker ai "What can you do?"
```

**Expected capabilities** (populate with actual output when Docker Desktop WSL integration is enabled):
- Generate Dockerfiles from natural language descriptions
- Optimize existing Dockerfiles for size and security
- Debug container issues from error logs
- Suggest multi-stage build strategies
- Review images for security vulnerabilities
- Explain Docker concepts and best practices

**Availability**: Requires Docker Desktop 4.53+ with WSL 2 integration enabled.

**Status**: [ ] Validated — run `docker ai "What can you do?"` and paste output here when Docker Desktop is connected to WSL.

---

## kubectl-ai

**Installation**:
```bash
# Option 1: Homebrew (macOS/Linux)
brew install kubectl-ai

# Option 2: Direct download
curl -LO https://github.com/GoogleCloudPlatform/kubectl-ai/releases/latest/download/kubectl-ai_linux_amd64.tar.gz
tar -xzf kubectl-ai_linux_amd64.tar.gz
sudo mv kubectl-ai /usr/local/bin/
```

**Validation command**:
```bash
kubectl-ai "What can you do?"
```

**Expected capabilities**:
- Generate Kubernetes manifests from natural language
- Scale deployments: `kubectl-ai "scale backend to 3 replicas"`
- Generate HorizontalPodAutoscalers
- Debug pod issues from descriptions
- Create RBAC configurations
- Suggest resource limit optimizations

**Usage in this project**:
```bash
# Scale backend to 3 replicas (requires human review before applying)
kubectl-ai "scale todo-backend deployment to 3 replicas"

# Generate HPA for backend
kubectl-ai "Generate a HorizontalPodAutoscaler for todo-backend targeting 70% CPU"
```

**Status**: [ ] Validated — run capability command and paste output here.

---

## Kagent

**Installation**:
```bash
# Via pip
pip install kagent

# Or via direct binary
curl -LO https://github.com/kagent-ai/kagent/releases/latest/download/kagent-linux-amd64
chmod +x kagent-linux-amd64
sudo mv kagent-linux-amd64 /usr/local/bin/kagent
```

**Validation command**:
```bash
kagent "analyze the cluster"
```

**Expected capabilities**:
- Analyze cluster resource usage and health
- Detect misconfigurations in deployments
- Recommend resource limit adjustments
- Identify pods in unhealthy states
- Suggest scaling strategies based on actual usage
- Report security findings in cluster

**Usage in this project**:
```bash
# Analyze overall cluster health
kagent "analyze cluster health and resource usage"

# Get optimization recommendations
kagent "what resource limits should I set for todo-backend and todo-frontend?"
```

**Status**: [ ] Validated — run capability command and paste output here.

---

## Fallback CLI Commands

When AI tools are unavailable, use these manual equivalents:

| AI Tool | Fallback Command |
|---------|-----------------|
| `kubectl-ai "scale backend to 3"` | `kubectl scale deployment todo-backend --replicas=3` |
| `kagent "analyze cluster health"` | `kubectl top pods && kubectl get events` |
| `docker ai "optimize Dockerfile"` | Manual review against Dockerfile best practices |
| `kagent "check resource usage"` | `kubectl describe nodes && kubectl top pods` |

---

## Constitution Compliance (FR-013, SC-008)

All AI tool suggestions are:
1. **Logged** in `infra/AI_DEVOPS_LOG.md`
2. **Reviewed** by a human before application
3. **Not auto-executed** — manual approval required
4. **Fallback-safe** — workflow continues with CLI commands if tools unavailable
