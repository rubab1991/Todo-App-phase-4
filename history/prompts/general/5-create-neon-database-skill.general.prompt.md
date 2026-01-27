---
id: 5
title: Create Neon Database Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "database", "neon", "persistence"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/neon-database/skill.md
tests:
 - none
---

## Prompt

create a skill  ---
name: neon-database
description: Manage persistent storage using Neon Serverless PostgreSQL. Use when configuring or reviewing database behavior.
---

# Neon Database Management

## Instructions
Ensure reliable and secure persistence.

1. **Configuration**
   - Use environment variables
   - No hardcoded credentials
   - Production-ready connection handling

2. **Persistence**
   - Ensure data durability
   - Validate correct filtering by user_id
   - Support scalability patterns

3. **Safety**
   - Protect against cross-user data leaks
   - Enforce ORM-only access

## Constraints
- No auth data management
- No direct frontend access
- No schema drift      and save it to .claude/skills/neon-database/

## Response snapshot

Created the neon-database skill file with instructions for managing persistent storage using Neon Serverless PostgreSQL. The skill includes guidelines for configuration (using environment variables, no hardcoded credentials, production-ready connection handling), persistence (ensuring data durability, validating correct filtering by user_id, supporting scalability patterns), and safety (protecting against cross-user data leaks, enforcing ORM-only access).

## Outcome

- ✅ Impact: Created database skill to guide Neon PostgreSQL configuration and management
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/neon-database/skill.md
- 🔁 Next prompts: Use the database skill to configure Neon PostgreSQL for the todo application
- 🧠 Reflection: The database skill will ensure secure and scalable database practices

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the database skill to set up the Neon PostgreSQL connection