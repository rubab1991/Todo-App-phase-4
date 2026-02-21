# Dockerfile Contract: Backend

## Build Context
- **Context path**: Repository root (`.`)
- **Dockerfile path**: `infra/docker/backend.Dockerfile`

## Specification

| Attribute | Value |
|-----------|-------|
| Base image | `python:3.11-slim` |
| Working directory | `/app` |
| User | `appuser` (UID 1000, non-root) |
| Exposed port | 8000 |
| Entry point | `uvicorn src.api.main:app --host 0.0.0.0 --port 8000` |
| Image tag | `todo-backend:v1` |

## Build Steps

1. Install system dependencies (if needed for asyncpg)
2. Copy `backend/requirements.txt` → install Python deps
3. Copy `backend/src/` → application source
4. Create non-root user `appuser`
5. Switch to `appuser`
6. Expose port 8000
7. CMD: uvicorn with correct module path

## Environment Variables (injected at runtime, NOT baked in)

- `NEON_DB_URL` — Database connection
- `BETTER_AUTH_SECRET` — Auth secret
- `BETTER_AUTH_URL` — Auth service URL
- `COHERE_API_KEY` — Cohere API key
- `DEBUG` — Debug flag
- `LOG_LEVEL` — Logging level

## Build Command

```bash
docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile .
```

## Validation

```bash
docker run --rm -e NEON_DB_URL=test -e BETTER_AUTH_SECRET=test -e COHERE_API_KEY=test \
  -p 8000:8000 todo-backend:v1
# Expected: Uvicorn starts on port 8000
# Health check: curl http://localhost:8000/health
```
