---
id: 3
title: Create FastAPI Backend Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "backend", "fastapi", "api"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/fastapi-backend/skill.md
tests:
 - none
---

## Prompt

Create a skill
name: fastapi-backend
description: Implement secure REST APIs using FastAPI. Use when building or modifying backend endpoints.
---

# FastAPI Backend Development

## Instructions
Build secure, spec-compliant REST APIs.

1. **API Design**
   - All routes under `/api`
   - RESTful resource naming
   - JSON responses only

2. **Security**
   - Verify JWT tokens on every request
   - Extract user identity from token
   - Reject unauthenticated requests

3. **Error Handling**
   - Use HTTPException
   - Clear status codes
   - Predictable error responses

## Constraints
- Do not trust client-provided user IDs
- No frontend concerns
- No raw SQL   and save it to  .claude/skills/fastapi-backend/

## Response snapshot

Created the fastapi-backend skill file with instructions for implementing secure REST APIs using FastAPI. The skill includes guidelines for API design (all routes under /api, RESTful naming, JSON responses), security requirements (JWT verification, user identity extraction, rejecting unauthenticated requests), and error handling (using HTTPException with clear status codes).

## Outcome

- ✅ Impact: Created backend skill to guide FastAPI development with security and consistency
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/fastapi-backend/skill.md
- 🔁 Next prompts: Use the backend skill to implement API endpoints for the todo application
- 🧠 Reflection: The backend skill will ensure consistent API development practices and security measures

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the backend skill to implement the first API endpoint