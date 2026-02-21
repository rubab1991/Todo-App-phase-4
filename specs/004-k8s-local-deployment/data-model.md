# Data Model: Local Kubernetes Deployment for Todo Chatbot

**Feature**: 004-k8s-local-deployment
**Date**: 2026-02-19

## Overview

This feature does not introduce new application-level data models. The existing Phase III data models (User, Task, Conversation, Message) remain unchanged. This document defines the **infrastructure entities** managed by this feature.

## Infrastructure Entities

### Container Image

Represents a packaged Docker image for deployment.

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Image name (e.g., `todo-backend`, `todo-frontend`) |
| tag | string | Version tag (e.g., `v1`, `v2`) |
| base_image | string | Base Docker image (e.g., `python:3.11-slim`, `node:20-alpine`) |
| exposed_port | integer | Port the application listens on (8000 or 3000) |
| user | string | Non-root user running the process (e.g., `appuser`) |

### Helm Release

Represents a deployed Helm chart instance.

| Attribute | Type | Description |
|-----------|------|-------------|
| release_name | string | Helm release name (e.g., `todo-backend`, `todo-frontend`) |
| chart_path | string | Path to Helm chart (e.g., `infra/helm/todo-backend`) |
| namespace | string | Kubernetes namespace (default: `default`) |
| values | object | Configurable values (replicas, image tag, env vars) |

### Kubernetes Deployment

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Deployment name |
| replicas | integer | Number of pod replicas (default: 2) |
| image | string | Container image reference |
| resource_requests | object | CPU/memory requests (100m/128Mi) |
| resource_limits | object | CPU/memory limits (200m/256Mi) |
| env_from_secret | list | Secret keys injected as env vars |
| env_from_configmap | list | ConfigMap keys injected as env vars |

### Kubernetes Secret

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Secret name (e.g., `todo-secrets`) |
| data | object | Key-value pairs (base64 encoded) |

**Required keys**:
- `NEON_DB_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Authentication secret
- `COHERE_API_KEY` — Cohere API key

### Kubernetes ConfigMap

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | ConfigMap name (e.g., `todo-config`) |
| data | object | Key-value pairs (plaintext) |

**Required keys**:
- `DEBUG` — Debug mode flag (default: `false`)
- `LOG_LEVEL` — Log level (default: `info`)
- `BETTER_AUTH_URL` — Auth service URL

### Kubernetes Service

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Service name |
| type | string | `ClusterIP` or `NodePort` |
| port | integer | Service port |
| target_port | integer | Container port |
| node_port | integer | External port (NodePort only, optional) |

## Entity Relationships

```text
Helm Release (todo-backend)
├── Deployment (todo-backend)
│   ├── Pod replica 1
│   └── Pod replica 2
├── Service (todo-backend, NodePort)
├── ConfigMap (todo-backend-config)
└── Secret (todo-secrets) [shared]

Helm Release (todo-frontend)
├── Deployment (todo-frontend)
│   ├── Pod replica 1
│   └── Pod replica 2
├── Service (todo-frontend, NodePort)
├── ConfigMap (todo-frontend-config)
└── Secret (todo-secrets) [shared]
```

## Existing Application Models (Unchanged)

These exist in `backend/src/models/` and are NOT modified by this feature:

- **User**: id, email, created_at, updated_at
- **Task**: id, title, description, status, completed, priority, due_date, user_id (FK)
- **Conversation**: id, title, user_id (FK), created_at, updated_at
- **Message**: id, role, content, conversation_id (FK), user_id (FK), timestamp
