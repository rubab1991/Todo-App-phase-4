---
id: 2
title: Create Phase2 Orchestrator Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "orchestration", "phase2"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/phase2-orchestrator/skill.md
tests:
 - none
---

## Prompt

Create a skill name: phase2-orchestrator
description: Coordinate spec-driven development across frontend, backend, database, and auth layers. Use when managing cross-stack work.
---

# Phase II Orchestrator

## Instructions
Coordinate implementation using Spec-Kit Plus as the single source of truth.

1. **Spec Governance**
   - Read from `/specs/**`
   - Enforce `/sp.constitution`
   - Prevent undocumented behavior

2. **Agent Delegation**
   - Decide which specialized agent should act
   - Sequence work across layers
   - Resolve cross-agent conflicts

3. **Phase Control**
   - Enforce Phase II boundaries
   - Block Phase III features
   - Ensure reproducibility of agentic workflow

## Output Expectations
- Clear delegation instructions
- No production code
- Explicit spec references and save it to .claude/skills/phase2-orchestrator/

## Response snapshot

Created the phase2-orchestrator skill file with instructions for coordinating spec-driven development across frontend, backend, database, and auth layers. The skill includes governance rules, agent delegation guidelines, and phase control measures to ensure adherence to the project constitution.

## Outcome

- ✅ Impact: Created orchestration skill to coordinate cross-stack development
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/phase2-orchestrator/skill.md
- 🔁 Next prompts: Use the orchestrator skill to coordinate feature implementation
- 🧠 Reflection: The orchestrator skill will help maintain consistency across all development layers

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the orchestrator skill to begin feature implementation