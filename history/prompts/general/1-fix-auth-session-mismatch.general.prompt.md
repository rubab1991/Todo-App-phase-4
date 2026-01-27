---
id: 1
title: Fix Auth Session Mismatch After Login Redirect
stage: general
date: 2026-01-19
model: claude-sonnet-4-5-20250929
surface: agent
feature: none
branch: 001-backend-fix-integration
user: unknown
labels: [auth, session, integration, fix]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
---

# Fix Auth Session Mismatch After Login Redirect

## Command
```
/sp.implement
```

## Context
Fixed an issue where after successful login/signup, the frontend showed "Please sign in to view tasks" despite the user being authenticated. The problem was that auth requests were incorrectly being sent to the FastAPI backend instead of Next.js.

## Solution Applied

### Changes Made:

1. **Created Next.js API Routes for Better Auth** (`/api/auth/route.ts`):
   - Added proper GET and POST handlers for Better Auth
   - Implemented cookie handling for authentication sessions
   - Connected to the Better Auth server configuration

2. **Updated Environment Variables** (`.env`):
   - Changed `BETTER_AUTH_URL` from `http://localhost:8000` to `http://localhost:3000`
   - Changed `NEXT_PUBLIC_BETTER_AUTH_URL` from `http://localhost:8000` to `http://localhost:3000`
   - Auth requests now go to Next.js server instead of FastAPI backend

3. **Created Better Auth Server Configuration** (`lib/better-auth-server.ts`):
   - Set up proper Better Auth configuration for Next.js
   - Connected to the Neon database as configured

4. **Fixed API Client Authentication** (`lib/api-client.ts`):
   - Updated to accept JWT token parameter for authorization
   - Modified all task API functions to accept and use the token
   - Removed incorrect localStorage token retrieval

5. **Updated Tasks Page** (`app/tasks/page.tsx`):
   - Modified all API calls to pass the JWT token from the session
   - Ensured proper authentication headers are sent to FastAPI backend

## Outcome
- Frontend now sends auth requests to Next.js (port 3000) instead of FastAPI (port 8000)
- Tasks page correctly recognizes authenticated state and loads tasks after login
- Session state is properly maintained and accessible
- Authentication flow is properly structured with Next.js handling auth and FastAPI handling tasks

## Files Modified
- frontend/app/api/auth/route.ts
- frontend/lib/better-auth-server.ts
- frontend/lib/api-client.ts
- frontend/app/tasks/page.tsx
- frontend/.env
- frontend/hooks/use-auth.ts
- frontend/app/signin/page.tsx
- frontend/app/signup/page.tsx

## Verification
All tasks from the backend FastAPI implementation have been completed successfully, and the authentication flow issue has been resolved. The system now properly routes authentication requests to Next.js and task requests to FastAPI.