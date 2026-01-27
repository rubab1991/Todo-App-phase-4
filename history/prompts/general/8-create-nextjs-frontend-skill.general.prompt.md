---
id: 8
title: Create NextJS Frontend Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "frontend", "nextjs", "ui"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/nextjs-frontend/skill.md
tests:
 - none
---

## Prompt

create a skill
---
name: nextjs-frontend
description: Build and refine the Next.js App Router frontend. Use when implementing UI or frontend auth flows.
---

# Next.js Frontend Development

## Instructions
Implement frontend features strictly according to specs.

1. **UI Implementation**
   - Use App Router conventions
   - Server Components by default
   - Responsive layouts

2. **API Integration**
   - Use centralized API client
   - Attach JWT tokens to all requests
   - Handle loading and error states

3. **Authentication**
   - Integrate Better Auth
   - Handle signup, signin, logout
   - Never trust user identity from client state alone

## Constraints
- No direct database access
- No backend logic
- No undocumented APIs

                                                                                                                                                                                                                                                                                                and save it to .claude/skills/nextjs-frontend/

## Response snapshot

Created the nextjs-frontend skill file with instructions for building and refining the Next.js App Router frontend. The skill includes guidelines for UI implementation (using App Router conventions, Server Components by default, responsive layouts), API integration (using centralized API client, attaching JWT tokens to all requests, handling loading and error states), and authentication (integrating Better Auth, handling signup/signin/logout, not trusting user identity from client state alone).

## Outcome

- ✅ Impact: Created frontend skill to guide Next.js development with proper API integration and security
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/nextjs-frontend/skill.md
- 🔁 Next prompts: Use the frontend skill to implement UI components for the todo application
- 🧠 Reflection: The frontend skill will ensure consistent UI development practices and proper authentication integration

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the frontend skill to create the initial UI components