---
id: 6
title: Create Auth Security Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "auth", "security", "jwt", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/auth-security/skill.md
tests:
 - none
---

## Prompt

create a skill  ---
name: auth-security
description: Secure authentication and authorization using Better Auth and JWT. Use when implementing or validating auth flows.
---

# Authentication & Security

## Instructions
Enforce secure identity and access control.

1. **Frontend Auth**
   - Configure Better Auth
   - Enable JWT issuance
   - Define token expiry

2. **Backend Verification**
   - Validate JWT signature
   - Decode user identity
   - Match token user with request context

3. **Security Rules**
   - All APIs require JWT
   - Unauthorized requests return 401
   - Enforce strict user isolation

## Constraints
- No custom auth systems
- No insecure fallbacks
- No shared sessions

    and save it to .claude/skills/auth-security/

## Response snapshot

Created the auth-security skill file with instructions for implementing secure authentication and authorization using Better Auth and JWT. The skill includes guidelines for frontend auth (configuring Better Auth, enabling JWT issuance, defining token expiry), backend verification (validating JWT signature, decoding user identity, matching token user with request context), and security rules (all APIs require JWT, unauthorized requests return 401, enforcing strict user isolation).

## Outcome

- ✅ Impact: Created auth security skill to guide secure authentication and authorization implementation
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/auth-security/skill.md
- 🔁 Next prompts: Use the auth security skill to implement authentication flows for the todo application
- 🧠 Reflection: The auth security skill will ensure consistent and secure authentication practices

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the auth security skill to configure Better Auth