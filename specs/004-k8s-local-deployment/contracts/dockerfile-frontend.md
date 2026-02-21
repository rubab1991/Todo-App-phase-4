# Dockerfile Contract: Frontend

## Build Context
- **Context path**: Repository root (`.`)
- **Dockerfile path**: `infra/docker/frontend.Dockerfile`

## Specification

| Attribute | Value |
|-----------|-------|
| Base image (builder) | `node:20-alpine` |
| Base image (runtime) | `node:20-alpine` |
| Working directory | `/app` |
| User | `nextjs` (UID 1000, non-root) |
| Exposed port | 3000 |
| Entry point | `npm start` |
| Image tag | `todo-frontend:v1` |

## Build Steps (Multi-stage)

### Stage 1: Builder
1. Copy `frontend/package.json`, `frontend/package-lock.json` → install all deps
2. Copy all frontend source: `app/`, `components/`, `hooks/`, `lib/`, `types/`, `public/`
3. Copy config files: `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`
4. Set build-time env vars (ARG): `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`
5. Run `npm run build`

### Stage 2: Runtime
1. Copy `frontend/package.json`, `frontend/package-lock.json` → install production deps only
2. Copy `.next/` from builder
3. Copy `public/` from builder
4. Copy `next.config.js` from builder
5. Create non-root user `nextjs`
6. Switch to `nextjs`
7. Expose port 3000
8. CMD: `npm start`

## Build Args (set at build time)

- `NEXT_PUBLIC_API_BASE_URL` — Backend API URL (for browser-side requests)
- `NEXT_PUBLIC_BETTER_AUTH_URL` — Auth URL

## Build Command

```bash
docker build -t todo-frontend:v1 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:30080/api \
  --build-arg NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:30030 \
  -f infra/docker/frontend.Dockerfile .
```

## Validation

```bash
docker run --rm -p 3000:3000 todo-frontend:v1
# Expected: Next.js starts on port 3000
# Health check: curl http://localhost:3000
```
