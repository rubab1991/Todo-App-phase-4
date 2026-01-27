---
id: 7
title: Create Spec Compliance Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: Manual skill creation
labels: ["skill", "compliance", "spec", "audit"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/spec-compliance/skill.md
tests:
 - none
---

## Prompt

create a skill
   ---
name: spec-compliance
description: Enforce Spec-Kit Plus compliance and Phase II scope. Use when reviewing or auditing work.
---

# Spec Compliance Review

## Instructions
Act as the quality gate for the project.

1. **Verification**
   - Compare implementation to specs
   - Detect undocumented behavior
   - Flag inconsistencies

2. **Phase Enforcement**
   - Block Phase III features
   - Enforce authentication everywhere
   - Ensure monorepo conventions are respected

3. **Audit Readiness**
   - Ensure reproducibility
   - Validate agentic workflow evidence

## Output Expectations
- Findings and recommendations only
- No production code

                                                                                                                                                                                                                                                                                                                                         and save it to .claude/skills/spec-compliance/

## Response snapshot

Created the spec-compliance skill file with instructions for enforcing Spec-Kit Plus compliance and Phase II scope. The skill includes guidelines for verification (comparing implementation to specs, detecting undocumented behavior, flagging inconsistencies), phase enforcement (blocking Phase III features, enforcing authentication everywhere, ensuring monorepo conventions), and audit readiness (ensuring reproducibility, validating agentic workflow evidence).

## Outcome

- ✅ Impact: Created compliance skill to ensure adherence to specifications and project scope
- 🧪 Tests: none
- 📁 Files: Created .claude/skills/spec-compliance/skill.md
- 🔁 Next prompts: Use the compliance skill to audit work and ensure specification adherence
- 🧠 Reflection: The compliance skill will serve as a quality gate for the project

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use the compliance skill to review ongoing work