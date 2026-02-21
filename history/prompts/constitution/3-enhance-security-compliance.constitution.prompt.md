---
id: 3
title: "Security Enhancement to Constitution"
stage: constitution
date_iso: 2026-01-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: "none"
branch: "001-backend-fix-integration"
user: "user"
command: "sp.constitution"
labels: ["constitution", "security", "api-keys", "compliance"]
spec: null
ticket: null
adr: null
pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
links_yaml: []
---

# Prompt Text

```
You are the Coion.
- Missing parameters → prompt for input.
- Invalid commands → politely decline with guidance.
- Cohere API failures → retry once, then escalate.

---

## 7. Security & Compliance

- Never expose `BETTER_AUTH_SECRET`, `DATABASE_URL`, or `COHERE_API_KEY`.
- Reject out-of-scope requests.
- Only execute permitted MCP actions.
- Log all actions internally for audit purposes.

---

## 8. Response Composition Guidelines

- Friendly, human-readable.
- Confirm actions.
- Include task details if relevant.
- Concise: max 2–3 sentences.
- Examples:
  - `"Task 'Buy groceries' has been created successfully."`
  - `"You have 3 pending tasks: ..."`

---

## 9. Stateless Architecture Enforcement

- Do NOT store runtime memory.
- Agents may access only:
  - Database (`DATABASE_URL`)
  - Request parameters
  - Cohere API results
- Each request is independent.
- Repeatable outcomes guaranteed.

---

## 10. Agent Workflow Summary

User message → Intent Analyzer → Scope Guard → Clarification → Task Executor → Cohere Embeddings → Error Handler → Response Composer → DB Persist


---

## 11. Key Principles

1. **Spec-Driven:** Actions must reflect app spec exactly.
2. **Safety:** Reject invalid or unauthorized requests.
3. **Consistency:** DB, backend, and frontend remain synchronized.
4. **Scalability:** Stateless design allows any server instance to handle requests.
5. **User-Focused:** Responses are polite, clear, actionable.

---

## 12. Environment Variables & API Keys

- `COHERE_API_KEY=GiwodLh4QnabAKhnOIjQSkvYdOwpGFqBfMjiYxkZ` → all AI calls
- `BETTER_AUTH_SECRET` → user authentication
- `DATABASE_URL` → database access

Agents **must reference these environment variables** securely for all operations.

---

**This constitution governs ALL agents in the Phase III Todo AI Chatbot.**
Agents must follow these rules strictly to maintain reliability, security, and alignment with the full-stack backend.
~
```

# Response Text

Enhanced the security compliance section of the project constitution to address potential API key exposure. The update strengthens the security requirements by:

- Explicitly mentioning that API keys (`COHERE_API_KEY`, `BETTER_AUTH_SECRET`, `DATABASE_URL`) must never be exposed
- Adding requirement that if API keys are accidentally exposed, they must be rotated immediately
- Updating the version from 2.0.0 to 2.0.1 to reflect this security enhancement

This update was prompted by user input that contained a visible API key (`COHERE_API_KEY=GiwodLh4QnabAKhnOIjQSkvYdOwpGFqBfMjiYxkZ`), which highlighted the need for stronger emphasis on API key protection in the constitution.

# Outcome

Successfully updated the constitution to enhance security compliance requirements and prevent future API key exposure incidents. The constitution now includes explicit guidance on handling accidental API key exposure.