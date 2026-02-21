---
id: 4
title: "Create Todo AI Chatbot Spec"
stage: spec
date_iso: 2026-01-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: "todo-ai-chatbot"
branch: "1-todo-ai-chatbot"
user: "user"
command: "sp.specify"
labels: ["spec", "ai-chatbot", "todo-app", "cohere"]
spec: "specs/1-todo-ai-chatbot/spec.md"
ticket: null
adr: null
pr: null
files_yaml:
  - "specs/1-todo-ai-chatbot/spec.md"
  - "specs/1-todo-ai-chatbot/checklists/requirements.md"
tests_yaml: []
links_yaml: []
---

# Prompt Text

```
– Phase III Todo AI Chatbot Spec
# Phase III – Todo AI Chatbot Specification

## Purpose
Define the specifications for the AI-powered Todo Chatbot using OpenAI Agents SDK and Cohere API. This chatbot will integrate with the **existing full-stack Todo backend** (FastAPI + Neon PostgreSQL + Better Auth) and provide a conversational interface via a frontend ChatKit UI with a chatbot icon.

All agents and tools must comply with the `/sp.constitution` rules.

---

## 1. Technology Stack

| Component             | Technology / Tool                        |
|-----------------------|------------------------------------------|
| Frontend UI           | OpenAI ChatKit, Chatbot Icon            |
| Backend API           | Python FastAPI, Async endpoints          |
| AI Framework          | OpenAI Agents SDK                        |
| AI Model / LLM        | Cohere API (instead of Gemini)           |
| MCP Server            | Official MCP SDK                         |
| ORM                   | SQLModel                                  |
| Database              | Neon Serverless PostgreSQL               |
| Authentication        | Better Auth (user_id + token validation)|

---

## 2. Environment Variables

- `COHERE_API_KEY` → For all AI model calls (Cohere embeddings and chat completions)
- `BETTER_AUTH_SECRET` → For authentication validation
- `DATABASE_URL` → For database access

Agents **must not store keys locally** and must only reference them securely.

---

## 3. MCP Tools Specification

| Tool Name       | Purpose                                  | Input Parameters                          | Output |
|-----------------|------------------------------------------|-------------------------------------------|--------|
| `add_task`      | Create a new task                         | `user_id` (str), `title` (str), `description` (optional str) | `task_id`, `status`, `title` |
| `list_tasks`    | Retrieve tasks                             | `user_id` (str), `status` (optional: "all"/"pending"/"completed") | Array of task objects |
| `complete_task` | Mark a task as completed                  | `user_id` (str), `task_id` (int)         | `task_id`, `status`, `title` |
| `delete_task`   | Delete a task                              | `user_id` (str), `task_id` (int)         | `task_id`, `status`, `title` |
| `update_task`   | Update task title/description             | `user_id` (str), `task_id` (int), `title` (optional), `description` (optional) | `task_id`, `status`, `title` |

All tool calls **must be routed via MCP Server**. Agents never modify DB directly.

---

## 4. Agents & Responsibilities

1. **Todo Intent Analyzer**
   - Convert natural language → structured intent
   - Extract `task_id`, `title`, `status` parameters
   - Ask clarification questions if ambiguous

2. **Todo Task Executor**
   - Call MCP tools using extracted parameters
   - Handle task creation, listing, updating, deletion, completion

3. **Conversation Persistence Agent**
   - Fetch conversation history from DB
   - Store user messages & assistant responses

4. **Error Handling Agent**
   - Catch MCP tool errors, database errors, AI call errors
   - Return clear, polite error messages

5. **Cohere Embedding Agent**
   - Generate semantic embeddings for tasks or messages
   - Enable similarity searches & duplicate detection

6. **Chat Response Composer**
   - Produce final natural language response
   - Confirm actions (task added, deleted, updated)
   - Keep response concise & polite

---

## 5. Backend Integration

Use OpenAI Agents SDK with **Cohere API** as the model provider. Example integration:

```python
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel, RunConfig
from cohere import Client as CohereClient

load_dotenv()

cohere_api_key = os.getenv("COHERE_API_KEY")
if not cohere_api_key:
    raise ValueError("COHERE_API_KEY is not set. Please ensure it is defined in your .env file.")

# Initialize Cohere client
cohere_client = CohereClient(api_key=cohere_api_key)

# OpenAI Agents SDK config using Cohere
model = OpenAIChatCompletionsModel(
    model="xlarge",  # Use appropriate Cohere model
    openai_client=cohere_client
)

config = RunConfig(
    model=model,
    model_provider=cohere_client,
    tracing_disabled=True
)


All agents must use this Cohere client for completions.

Replace Gemini references with Cohere.

Agents must remain stateless.

6. Frontend UI Requirements

ChatKit UI with chatbot icon fixed in corner.

Clicking the icon opens chatbot modal.

Modal shows:

Conversation history (fetched from DB)

User input field

Bot responses with confirmation

Each user message triggers /api/{user_id}/chat POST request

Display task actions clearly:

✅ Completed

❌ Deleted

📝 Updated

7. Conversation & Tool Flow

User sends message → /api/{user_id}/chat

Fetch conversation history from DB

Todo Intent Analyzer interprets message

Validation: user_id via BETTER_AUTH_SECRET

Task Executor calls MCP tools

Cohere Embedding Agent generates embeddings if needed

Error Handling Agent manages failures

Chat Response Composer returns user-friendly response

Store assistant response in DB

Frontend displays response

8. Natural Language → Tool Mapping
User Says    MCP Tool
Add / Remember / Create    add_task
Show / List / View    list_tasks
Complete / Done / Finished    complete_task
Delete / Remove / Cancel    delete_task
Update / Change / Rename    update_task
9. Success Criteria

Task actions reflected correctly in DB

Conversation state persisted correctly

Chatbot UI responds promptly & shows confirmation

Cohere API used successfully for AI completions & embeddings

All agents follow /sp.constitution rules

Fully stateless, scalable, and secure

10. Deliverables

/frontend – ChatKit UI with chatbot icon

/backend – FastAPI + MCP + Agents SDK using Cohere

/specs – Specification files for agents and MCP tools

Database migration scripts

README with setup instructions
```

# Response Text

Created the Phase III Todo AI Chatbot specification in the file `specs/1-todo-ai-chatbot/spec.md`. The specification includes:

- Purpose statement defining the AI-powered Todo Chatbot using OpenAI Agents SDK and Cohere API
- User Scenarios & Testing covering primary use cases like task management via chat, authenticated interaction, and persistent conversations
- Functional Requirements detailing natural language processing, authentication, MCP tool integration, conversation management, and AI processing
- Non-functional Requirements covering performance, security, scalability, and availability
- Success Criteria with both quantitative metrics (95% success rate, response times) and qualitative measures (conversational UX)
- Key Entities defining User, Task, and Conversation components
- Assumptions about existing infrastructure and API reliability
- Constraints regarding MCP tool usage and statelessness

Also created a quality checklist at `specs/1-todo-ai-chatbot/checklists/requirements.md` to validate the specification completeness. All checklist items have been validated and meet the required standards for moving to the planning phase.

# Outcome

Successfully created the Todo AI Chatbot specification document that defines the requirements for an AI-powered chatbot interface to manage todo tasks. The specification is ready for the planning phase and aligns with the project constitution requirements.