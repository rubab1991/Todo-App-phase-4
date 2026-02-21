---
id: 5
title: "Create Todo AI Chatbot Plan"
stage: plan
date_iso: 2026-01-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: "todo-ai-chatbot"
branch: "1-todo-ai-chatbot"
user: "user"
command: "sp.plan"
labels: ["plan", "ai-chatbot", "todo-app", "architecture"]
spec: "specs/1-todo-ai-chatbot/spec.md"
ticket: null
adr: null
pr: null
files_yaml:
  - "specs/1-todo-ai-chatbot/plan.md"
  - "specs/1-todo-ai-chatbot/research.md"
  - "specs/1-todo-ai-chatbot/data-model.md"
  - "specs/1-todo-ai-chatbot/quickstart.md"
  - "specs/1-todo-ai-chatbot/contracts/chat-api.yaml"
tests_yaml: []
links_yaml: []
---

# Prompt Text

```
– Phase III Todo AI Chatbot Implementation Plan
# Phase III – Todo AI Chatbot Implementation Plan

## Objective
Generate a detailed implementation plan for the Phase III Todo AI Chatbot based on the `/sp.specify` document. This plan should include all necessary steps for integrating:

- Existing full-stack backend (FastAPI + Neon PostgreSQL + Better Auth)
- Cohere API for AI completions & embeddings
- OpenAI Agents SDK for agent orchestration
- MCP server tools for task management
- Frontend ChatKit UI with chatbot icon

---

## 1. Setup & Environment Preparation

1. **Backend Setup**
   - Ensure FastAPI backend is running.
   - Validate database connectivity (`DATABASE_URL`).
   - Ensure `BETTER_AUTH_SECRET` is configured.
   - Add `COHERE_API_KEY` to environment variables.

2. **Frontend Setup**
   - Ensure ChatKit frontend is set up.
   - Add Chatbot icon and modal placeholder for conversation.

3. **Dependencies**
   - Install OpenAI Agents SDK.
   - Install Cohere Python SDK.
   - Install MCP Server and tools.
   - Install SQLModel & database drivers.

---

## 2. Agent Implementation Steps

1. **Todo Intent Analyzer**
   - Detect user intent (add, list, update, complete, delete).
   - Extract parameters: `task_id`, `title`, `description`, `status`.
   - Ask clarification questions if parameters are missing or ambiguous.

2. **Todo Task Executor**
   - Map intent to corresponding MCP tool (`add_task`, `list_tasks`, `update_task`, `complete_task`, `delete_task`).
   - Call MCP tools with proper parameters.
   - Handle responses and errors gracefully.

3. **Conversation Persistence Agent**
   - Fetch conversation history from database using `conversation_id`.
   - Store each user message and assistant response in the database.

4. **Error Handling Agent**
   - Catch errors from MCP tools, database, or AI model.
   - Generate user-friendly error messages.

5. **Cohere Embedding Agent**
   - Generate semantic embeddings for tasks and messages.
   - Optional: Use embeddings for duplicate task detection or similarity searches.

6. **Chat Response Composer**
   - Construct friendly confirmation messages.
   - Include task status (added, updated, completed, deleted).

---

## 3. MCP Tool Integration Plan

- **add_task**
  - Map user messages like “add”, “remember”, “create” → call this tool.
- **list_tasks**
  - Map messages like “show”, “list”, “pending” → call this tool.
- **update_task**
  - Map messages like “change”, “update”, “rename” → call this tool.
- **complete_task**
  - Map messages like “complete”, “done”, “finished” → call this tool.
- **delete_task**
  - Map messages like “delete”, “remove”, “cancel” → call this tool.

Ensure all MCP tool calls pass authenticated `user_id`.

---

## 4. Backend Integration Steps

1. Replace Gemini references with Cohere API.
2. Configure OpenAI Agents SDK to use Cohere as `model_provider`.
3. Maintain statelessness in API endpoints.
4. Ensure `/api/{user_id}/chat` handles:
   - Receiving message
   - Fetching conversation history
   - Passing message + history to AI agent
   - Invoking MCP tools as needed
   - Storing assistant response in DB
   - Returning AI response + any tool_calls

---

## 5. Frontend ChatKit Steps

1. Add **chatbot icon** in corner.
2. Clicking the icon opens ChatKit modal with:
   - Conversation history
   - Input field for user messages
   - Display of bot responses
3. Send user messages to `/api/{user_id}/chat`.
4. Display tool confirmation messages with emojis:
   - ✅ Completed
   - ❌ Deleted
   - 📝 Updated
5. Handle error messages from Error Handling Agent.

---

## 6. Testing & Validation

1. Validate each MCP tool individually:
   - add_task, list_tasks, update_task, complete_task, delete_task
2. Validate AI agent integration with Cohere API:
   - Intent detection accuracy
   - Parameter extraction
3. Validate stateless conversation handling:
   - Multiple concurrent users
   - Resume conversations correctly after server restart
4. Frontend ChatKit behavior:
   - Chatbot icon triggers modal
   - Messages display correctly
   - Tool confirmations shown properly

---

## 7. Milestones & Deliverables

| Milestone | Deliverable |
|-----------|------------|
| Environment Setup | Backend + Frontend + Environment Variables |
| Agent Implementation | Todo Intent Analyzer, Task Executor, Cohere Agent, Error Handling Agent, Chat Composer |
| MCP Integration | All 5 task management tools mapped correctly |
| Frontend Integration | Chatbot UI with icon and modal fully functional |
| Testing & Validation | Full conversation cycles tested, tool calls verified |
| Deployment | Backend + Frontend deployed, domain allowlist configured, environment variables set |

---

## 8. Security & Compliance

- All agents must reference `COHERE_API_KEY`, `BETTER_AUTH_SECRET`, and `DATABASE_URL` securely.
- Do not store API keys in code.
- All AI interactions must comply with `/sp.constitution`.
- Ensure statelessness; no user session data stored in memory.
```

# Response Text

Created the implementation plan for the Todo AI Chatbot feature in `specs/1-todo-ai-chatbot/plan.md`. The plan includes:

- Summary of the AI-powered Todo Chatbot implementation
- Technical context with language, dependencies, storage, and performance goals
- Constitution check ensuring compliance with project principles
- Project structure for both backend and frontend components
- Complexity tracking section

Additionally, created supporting documents:

- `specs/1-todo-ai-chatbot/research.md` - Research summary covering AI framework selection, MCP tool integration, and other technical decisions
- `specs/1-todo-ai-chatbot/data-model.md` - Data model defining User, Task, Conversation, and Message entities
- `specs/1-todo-ai-chatbot/quickstart.md` - Quickstart guide for setting up and running the application
- `specs/1-todo-ai-chatbot/contracts/chat-api.yaml` - OpenAPI specification for the chatbot API
- Updated agent context in CLAUDE.md to reflect the new database technology

All deliverables from the plan have been created and organized according to the project structure requirements.

# Outcome

Successfully created a comprehensive implementation plan for the Todo AI Chatbot feature, including all required supporting documents. The plan aligns with the project constitution and provides a clear roadmap for implementation of the AI-powered task management system.