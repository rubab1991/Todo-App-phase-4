---
id: 4
title: Create SQLModel ORM Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "database", "orm", "sqlmodel"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/sqlmodel-orm/skill.md
tests:
 - none
---

## Prompt

create a skill ---
name: sqlmodel-orm
description: Design and maintain SQLModel ORM schemas. Use when working on data models or schema changes.
---

# SQLModel ORM Design

## Instructions
Define database models aligned with specs.

1. **Model Design**
   - Use SQLModel for all tables
   - Define relationships clearly
   - Keep models minimal and clean

2. **Data Integrity**
   - Enforce user ownership via user_id
   - Use appropriate field constraints
   - Support future schema evolution

3. **Alignment**
   - Match API request/response models
   - Reflect `/specs/database/schema.md`

## Constraints
- No business logic
- No migrations without spec updates
- No raw SQL unless specified  and save it to .claude/skills/sqlmodel-orm

## Response snapshot

Created the sqlmodel-orm skill file with instructions for designing and maintaining SQLModel ORM schemas. The skill includes guidelines for model design (using SQLModel for all tables, clear relationships, minimal and clean models), data integrity (enforcing user ownership via user_id, appropriate field constraints, supporting future schema evolution), and alignment (matching API request/response models, reflecting database specifications).

## Outcome

- ✅ Impact: Created ORM skill to guide database model development with integrity and consistency
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/sqlmodel-orm/skill.md
- 🔁 Next prompts: Use the ORM skill to define database models for the todo application
- 🧠 Reflection: The ORM skill will ensure consistent database design practices and data integrity

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the ORM skill to create the initial database models