<!-- SYNC IMPACT REPORT
Version change: 4.0.0 → 4.1.0
Bump rationale: MINOR — Deployment platform corrected from Render to Railway with
explicit production URL (https://web-production-7458d.up.railway.app/). Kafka topic
names enumerated explicitly (task-events, task-updates, task-reminders, audit-events).
Backend start command specified (uvicorn app.main:app --host 0.0.0.0 --port $PORT).
Frontend environment variable NEXT_PUBLIC_API_URL added. Local Dapr run command
(dapr run --app-id todo-backend) codified.

Modified principles:
- "XII. Deployment Flow" → step 6 updated: Render → Railway; production URL added
- "XV. Dapr Runtime Governance" → local run command added
- "XVI. Redpanda / Kafka Governance" → topic names now explicitly enumerated
- "XVIII. CI/CD Pipeline Governance" → step 5 updated: Render → Railway

Modified sections:
- Integration Notes: "Backend deployed on Render" → "Backend deployed on Railway"
- Infrastructure Standards: "Backend on Render" → "Backend on Railway"
- Phase Boundaries: "Vercel + Render deployment" → "Vercel + Railway deployment"
- Success Criteria / Infrastructure Requirements: updated Railway references
- Frontend Standards: NEXT_PUBLIC_API_URL documented

Added sections: None

Removed sections: None

Templates requiring updates:
- .specify/templates/plan-template.md — ✅ no breaking change (generic template)
- .specify/templates/tasks-template.md — ✅ no breaking change (generic template)
- .specify/templates/spec-template.md — ✅ no update needed

Follow-up TODOs: None
-->

# Phase V – Advanced Event-Driven Todo Chatbot Constitution

## Core Principles

### I. Statelessness
The backend holds no runtime memory between requests. Conversation history and tasks are
persisted only in the database (Neon Serverless PostgreSQL). Dapr state store manages
chatbot conversation state and temporary task cache. Every agent must rely on database
state, Dapr state store, or passed parameters. This ensures scalability and fault
tolerance across distributed systems.

### II. User-Centric Security
Each action MUST validate the `user_id` against the authentication system (Better Auth).
Users may only access or modify their own tasks and conversations. Unauthorized actions
MUST be rejected politely with a clear message. Sensitive values (`COHERE_API_KEY`,
`BETTER_AUTH_SECRET`, `DATABASE_URL`, `REDPANDA_*`) MUST be stored as Kubernetes Secrets
and accessed via Dapr secret store abstraction. This maintains privacy and data isolation
between users.

### III. Consistency
All agents MUST ensure the frontend and backend remain consistent. Task actions MUST be
verified against the database. Changes (create, update, delete, complete, remind) MUST be
reflected in subsequent responses and propagated via Kafka events to all consumers. This
prevents state divergence between the UI, data layer, and event log.

### IV. Tool-First Execution
All task manipulations MUST go through MCP tools: `add_task`, `list_tasks`,
`complete_task`, `delete_task`, `update_task`. Agents MUST NOT bypass tools. If multiple
tools are needed (e.g., list → delete), chain them in order. This enforces proper
validation and audit trails.

### V. Spec-Driven Development
All implementation MUST strictly follow written specifications in `/specs`. No manual
coding; all code MUST be generated via Claude Code. Specifications serve as the single
source of truth for all development activities. Every feature, API endpoint, UI element,
infrastructure component, Dapr component, and Kafka topic MUST be defined in
specifications before implementation.

### VI. Extensibility and Event-Driven Readiness
Design all components to be extensible and event-driven ready. Use modular architecture
patterns that allow easy addition of new event types and Dapr building blocks. Maintain
clean interfaces that accommodate containerized deployment, Kubernetes orchestration, and
Dapr sidecar injection without major refactoring.

### VII. Declarative Infrastructure
All infrastructure MUST be defined declaratively. Deployments MUST be reproducible from
version-controlled artifacts alone. No manual `kubectl` edits in production. Every
container MUST be versioned and tagged. Kubernetes manifests MUST be Helm-managed. Dapr
components MUST be declared as YAML manifests under `dapr-components/`. AI tools assist
but humans MUST validate all infrastructure changes before application.

### VIII. Container Governance
Frontend and backend MUST be containerized using Docker. Dockerfiles MUST use slim base
images, expose required ports, use non-root users, and minimize layers. Images MUST be
tagged: `todo-frontend:v<N>`, `todo-backend:v<N>`. Docker AI Agent (Gordon) may generate
Dockerfiles, but all generated artifacts MUST be reviewed before build.

### IX. Kubernetes Governance
The local validation cluster MUST use Minikube with Dapr runtime installed. Every
deployment MUST include Deployment, Service, ConfigMap, and Secret resources. Backend and
frontend MUST run as separate deployments. Resource requests and limits MUST be defined
for all pods. No privileged containers are allowed.

### X. Helm Chart Governance
All Kubernetes manifests MUST be managed through Helm charts. Charts MUST support
configurable replica count, image tag, and environment variables. Values MUST include
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `COHERE_API_KEY`, and `REDPANDA_BROKERS`. Secrets
MUST NEVER be hardcoded in Helm templates; they MUST be injected via Kubernetes Secrets
and exposed through Dapr secret store.

### XI. AI DevOps Governance
AI DevOps tools assist but MUST NOT replace declarative infrastructure.
- **Gordon**: Used for Dockerfile generation and optimization suggestions. MUST NOT
  auto-deploy without human review.
- **kubectl-ai**: Used for deployment suggestions, scaling, and debugging. All
  suggestions MUST be validated before execution.
- **Kagent**: Used for cluster health analysis and resource optimization. MUST NOT
  auto-modify cluster state.

### XII. Deployment Flow
Infrastructure deployment MUST follow this sequence:
1. Build Docker images and validate locally
2. Create / update Helm charts with Dapr annotations
3. Deploy to Minikube with Dapr sidecar injection
4. Verify pods and Dapr sidecars are running
5. Validate Kafka event publishing via Redpanda Console
6. Deploy backend to Railway (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`);
   deploy frontend to Vercel
7. Validate chatbot functionality end-to-end using production URL:
   `https://web-production-7458d.up.railway.app/`

### XIII. Observability and Debugging
Logging MUST capture: service events, errors, Kafka message activity, and reminder
triggers. Monitoring MUST track: service health, event throughput, and API latency. Use
`kubectl-ai` for pod debugging, Kagent for cluster health, and `kubectl logs` for
container log inspection. No direct container modifications are permitted in production.

### XIV. Event-Driven Architecture Governance
All significant state changes (task create, update, complete, delete, remind) MUST be
published as events to Redpanda Kafka via Dapr pub/sub. No Kafka client libraries may be
used directly; all event publishing MUST go through the Dapr API:
`POST /v1.0/publish/<pubsub>/<topic>`. Every event MUST conform to the canonical Event
Schema (see Section XVII). Consumers MUST be idempotent; duplicate events MUST be
handled gracefully.

### XV. Dapr Runtime Governance
Dapr MUST provide the distributed runtime for the application. The following building
blocks MUST be implemented:

**Pub/Sub:** Dapr connects to Redpanda Kafka through a declared pub/sub component.
Applications publish events using `POST /v1.0/publish/<pubsub>/<topic>`. No direct Kafka
client usage.

**State Management:** Dapr state store MUST manage chatbot conversation state and
temporary task cache. State keys MUST be namespaced by `user_id`.

**Service Invocation:** Frontend MUST communicate with backend through Dapr service
invocation APIs, providing retries, service discovery, and resilience.

**Jobs API:** Reminder scheduling MUST use the Dapr Jobs API. Jobs MUST trigger backend
endpoints at the exact scheduled time derived from `remind_at`.

**Secrets Management:** All sensitive configuration MUST be stored as Kubernetes Secrets
and accessed via the Dapr secret store abstraction. No hardcoded credentials anywhere.

**Local Development:** The backend MUST be started with Dapr sidecar using:
`dapr run --app-id todo-backend`

### XVI. Redpanda / Kafka Governance
Redpanda Cloud MUST host all Kafka topics for production. Local Minikube validation MAY
use a Redpanda in-cluster instance. All topics MUST be declared and versioned in
`dapr-components/`. The following topics MUST be created and used:

- `task-events` — general task lifecycle events (create, update, delete, complete)
- `task-updates` — task field update events
- `task-reminders` — reminder trigger events
- `audit-events` — audit log entries for compliance

Producers and consumers MUST use Dapr pub/sub; direct Kafka SDK usage is prohibited.

### XVII. Advanced Task Features
The following advanced features MUST be implemented as part of Phase V:

**Reminder System:** Users MUST be able to set a `remind_at` timestamp on tasks. Dapr
Jobs API MUST trigger a reminder notification at the exact scheduled time.

**Due Dates:** Tasks MUST support a `due_at` field. The UI MUST surface overdue tasks
distinctly.

**Event Schema:** All task events MUST include:
- `task_id` (UUID)
- `title` (string)
- `due_at` (ISO 8601 or null)
- `remind_at` (ISO 8601 or null)
- `user_id` (UUID)

**Chatbot AI Enhancement:** The chatbot MUST understand natural language references to
reminders and due dates (e.g., "remind me tomorrow at 9am", "due next Friday").

### XVIII. CI/CD Pipeline Governance
A CI/CD pipeline MUST be implemented using GitHub Actions. The pipeline MUST:
1. Run all unit and integration tests
2. Build application Docker images
3. Validate Helm chart configurations
4. Validate Dapr component manifests
5. Automate deployment to Railway (backend) and Vercel (frontend) on merge to main

All secrets required by the pipeline MUST be stored as GitHub Actions Secrets. Pipeline
MUST fail on test failure; no deployment on red builds.

## Agent Responsibilities

### a) Todo Intent Analyzer
- Detect user intent from natural language
- Extract task-related parameters (task title, task_id, status, due_at, remind_at)
- Identify ambiguity and flag for clarification if needed
- Output structured intent only; do not execute

### b) Todo Task Executor
- Receive validated intent + parameters
- Call MCP tools with correct parameters
- Publish task events to Redpanda via Dapr pub/sub after successful tool execution
- Confirm success or failure
- Log tool_calls for response generation

### c) Conversation Persistence Agent
- Load conversation history before execution from Dapr state store
- Store user messages and assistant responses after execution
- Maintain ordering and context

### d) Task Clarification Agent
- Handle ambiguous references or missing parameters (including missing due_at/remind_at)
- Ask follow-up questions politely
- Prefer listing tasks for user selection

### e) Error Handling Agent
- Detect errors from MCP tools, database, or Dapr APIs
- Handle gracefully without exposing stack traces
- Suggest corrective actions

### f) Chat Response Composer
- Produce final user-friendly output
- Confirm actions (e.g., task created, reminder set, task deleted)
- Keep response concise, clear, and polite

### g) Cohere Embedding Agent
- Generate semantic embeddings for messages or task descriptions
- Assist in similarity searches (e.g., finding related tasks, detecting duplicate reminders)
- Return embeddings in standard JSON format for agent usage

### h) Reminder Scheduler Agent
- Register Dapr Jobs for tasks with `remind_at` values
- Receive job trigger callbacks from Dapr Jobs API
- Publish reminder events to `task-reminders` topic via Dapr pub/sub
- Notify the user through the chatbot interface

## Conversation & Task Flow

1. Receive user message via `/api/{user_id}/chat`
2. Conversation Persistence Agent fetches history from Dapr state store
3. Todo Intent Analyzer interprets message (including due/remind dates)
4. User Scope Guard validates `user_id`
5. Task Clarification Agent resolves ambiguities if needed
6. Todo Task Executor calls MCP tools
7. Reminder Scheduler Agent registers Dapr Job if `remind_at` is present
8. Todo Task Executor publishes event to Redpanda via Dapr pub/sub
9. Cohere Embedding Agent generates embeddings if semantic search is required
10. Error Handling Agent manages tool or event failures
11. Chat Response Composer returns user-friendly response
12. Conversation Persistence Agent stores final assistant message in Dapr state store

## Natural Language → Tool Mapping

| User Intent                          | MCP Tool / Action            |
|--------------------------------------|------------------------------|
| Add / Remember / Create Task         | add_task                     |
| Show / List / View Tasks             | list_tasks                   |
| Complete / Done / Finished Task      | complete_task                |
| Delete / Remove / Cancel Task        | delete_task                  |
| Update / Change / Rename Task        | update_task                  |
| Remind me at / Set reminder          | update_task + Dapr Jobs API  |
| Due date / Due by                    | update_task (due_at)         |

## Validation Rules

1. **Parameter Checks**
   - Every task operation MUST include `user_id`
   - Task ID required for complete/delete/update
   - Title required for add/update
   - `remind_at` and `due_at` MUST be valid ISO 8601 timestamps if provided

2. **Existence Checks**
   - Tasks MUST exist before modifying
   - If not found, ask user to clarify or provide alternatives

3. **Event Validation**
   - Every published event MUST conform to the canonical Event Schema
   - Events MUST include `task_id`, `title`, `user_id`; `due_at` and `remind_at` are nullable

4. **Response Confirmation**
   - After every tool execution, reply with: task title, status, and reminder/due date if set

## Error Handling Policy

- MCP tool errors: return clear explanation
- Dapr API errors: retry once with exponential backoff, then escalate
- Kafka publish failure: log, retry once, then surface graceful error to user
- Ambiguous requests: ask follow-up question
- Missing parameters: prompt for input
- Invalid commands: politely decline and provide guidance
- Failures in Cohere API: retry once, then escalate

## Cohere & OpenAI Integration

1. **OpenAI Agents SDK**
   - Handles agent orchestration, tool invocation, and execution sequence
   - Stateless interactions
   - Can chain multiple tool calls

2. **Cohere API**
   - Provides semantic search for tasks
   - Used to detect similar task titles, duplicates, or context-aware suggestions
   - Output embeddings used internally by agents; not exposed to user

## Security & Compliance

- Never expose `user_id`, API keys, or backend identifiers in responses
- No sensitive DB or API keys in container images, Dockerfiles, or Helm templates
- Only execute permitted MCP actions
- Reject out-of-scope requests
- Log all actions for auditing (internal only)
- Secrets MUST be stored as Kubernetes Secrets and accessed via Dapr secret store
- Pods MUST define resource requests and limits
- RBAC MUST restrict access to cluster resources
- No API keys baked into container images
- No privileged containers
- Dapr mTLS MUST be enabled for inter-service communication
- Redpanda credentials MUST be stored as Kubernetes Secrets; MUST NOT appear in source

## Response Composition Guidelines

- Friendly, human-readable
- Always acknowledge action
- Include task details (title, status, due date, reminder) if relevant
- Concise: max 2–3 sentences per action
- Examples:
  - `"Task 'Buy groceries' has been created with a reminder set for tomorrow at 9am."`
  - `"You have 3 pending tasks: 2 are due today."`

## Stateless Architecture Enforcement

- Do NOT store runtime memory in application process
- Agents can only access:
  - Database (Neon PostgreSQL)
  - Dapr state store (conversation state, task cache)
  - Passed request parameters
  - Cohere API results
- Every request is independent and repeatable

## Key Principles

1. **Spec-Driven:** Actions MUST reflect app spec exactly
2. **Safety:** Reject invalid or unauthorized requests
3. **Consistency:** DB, backend, frontend, and event log remain synchronized
4. **Scalability:** Stateless + event-driven design ensures any instance can handle requests
5. **User-Focused:** Responses are polite, clear, and actionable
6. **Declarative Infrastructure:** All deployment artifacts are version-controlled and reproducible
7. **Event-Driven:** All state changes produce Kafka events via Dapr pub/sub

## Integration Notes

- Backend already exists → agents MUST use existing endpoints
- MCP tools wrap backend functionality
- Dapr sidecar handles pub/sub, state, service invocation, jobs, and secrets
- Redpanda Cloud provides managed Kafka for event streaming
- Cohere API adds semantic intelligence
- OpenAI Agents SDK coordinates agents and tool execution
- Frontend deployed on Vercel; Backend deployed on Railway
- Production backend URL: `https://web-production-7458d.up.railway.app/`

## Technology Stack and Architecture Standards

### Monorepo Structure
Frontend and backend developed in a single repository. Must be independently runnable,
containerizable, and deployable. Clear boundaries between `frontend/`, `backend/`,
`services/`, `kubernetes/`, and `dapr-components/`. Use consistent tooling across all
components.

### Database Standards
Neon Serverless PostgreSQL for persistent storage. SQLModel for all schema and queries.
Tasks MUST be associated with `user_id`. Schema MUST support `due_at` and `remind_at`
fields. Filtering by `user_id` MUST be enforced at query level.

### API Standards
RESTful design with clear resource-based endpoints under `/api`. All endpoints MUST
require authentication. API behavior MUST remain consistent across local, containerized,
and Kubernetes environments. Dapr service invocation MUST be used for frontend→backend
communication where applicable.

### Frontend Standards
Responsive UI for desktop and mobile. Next.js App Router conventions. Server Components
by default; Client Components only when required. Centralized API client. Authentication
via Better Auth. No direct database access from frontend. Frontend MUST use
`NEXT_PUBLIC_API_URL` (set to `https://web-production-7458d.up.railway.app/`) to
communicate with the backend. Deployed on Vercel.

### Infrastructure Standards
Docker for containerization. Minikube for local Kubernetes + Dapr validation. Helm for
manifest management. Dapr components declared under `dapr-components/`. Redpanda Cloud
for managed Kafka. Backend on Railway; Frontend on Vercel. GitHub Actions for CI/CD.

## Spec-Driven Infrastructure

Infrastructure MUST follow the Spec → Plan → Tasks → Implementation flow. Blueprints
MUST define: container build strategy, Dapr component configuration, Kafka topic
declarations, deployment topology, scaling rules, resource allocation, and secret
management. All infrastructure artifacts MUST be version-controlled, repeatable, and
documented.

## Development Workflow and Quality Standards

### Specification Requirements
All features MUST be defined in `/specs/features`. All API behavior in `/specs/api`. All
database structure in `/specs/database`. All UI behavior in `/specs/ui`. All
infrastructure, Dapr components, and Kafka topics in `/specs` with deployment blueprints.
Specs MUST be updated if requirements evolve.

### Testing Standards
Unit tests for individual components and functions. Integration tests for API endpoints,
Dapr components, and database interactions. End-to-end tests for complete user workflows
including event publishing and reminder triggering. Validate containerized deployments
function identically to local development. CI/CD pipeline MUST block deployment on test
failure.

### Code Quality Standards
Follow consistent conventions across frontend and backend as defined in `CLAUDE.md`.
Maintain clean, readable code. Use appropriate error handling and validation. Follow
security best practices. Ensure proper separation of concerns in all components.

## Constraints and Non-Goals

### Phase Boundaries
Phase V scope: event-driven architecture, Dapr runtime, advanced task features
(reminders, due dates), Vercel + Railway deployment, Redpanda Cloud event streaming,
GitHub Actions CI/CD. No reverting to in-memory storage. No direct Kafka client usage.
No bypassing Dapr for inter-service communication. No hardcoded secrets. No deviation
from defined monorepo structure. No manual kubectl edits in production.

### Security Constraints
No direct database access from frontend. No client-side user ID manipulation. No shared
task access between users. No authentication bypass. No hardcoded secrets in source,
Dockerfiles, Helm templates, or Dapr component manifests. All sensitive data encrypted
in transit and at rest. Dapr mTLS enabled. No API keys baked into container images.

## Success Criteria

### Functional Requirements
All 5 basic todo features plus advanced features (reminders, due dates) implemented
end-to-end. AI chatbot understands natural language for all task operations including
reminder and due date management. Users can sign up and sign in. Authenticated users
only see their own tasks. Data persists in Neon PostgreSQL.

### Event-Driven Requirements
Task events published to Redpanda Kafka via Dapr pub/sub after every state change.
Topics used: `task-events`, `task-updates`, `task-reminders`, `audit-events`.
Reminder jobs scheduled via Dapr Jobs API and triggered at the exact `remind_at` time.
Dapr state store manages conversation state and task cache. No direct Kafka SDK usage.

### Infrastructure Requirements
Frontend on Vercel; backend on Railway (`https://web-production-7458d.up.railway.app/`);
Kafka on Redpanda Cloud. Minikube + Dapr runtime validates microservices architecture
locally. Helm charts deploy cleanly. CI/CD pipeline runs tests and deploys automatically
on merge to main.

### Quality Requirements
Codebase is clean, maintainable, and production-ready. Proper error handling throughout.
Responsive design. Logging captures service events, Kafka activity, and reminder triggers.
Monitoring tracks service health, event throughput, and API latency.

## Governance

Specifications serve as the authoritative source for all implementation decisions. Any
deviations from specifications MUST be documented and approved. All architecturally
significant decisions MUST be recorded as ADRs. All user interactions MUST be captured
as PHRs for auditability. This constitution governs ALL agents in the Phase V Event-Driven
Todo AI Chatbot. Agents MUST follow these rules strictly to maintain reliability, security,
and alignment with the full-stack, event-driven, distributed system.

### Amendment Procedure
Constitution amendments require review and explicit approval. Version follows semantic
versioning: MAJOR for governance redefinitions or principle removals, MINOR for new
principles or material expansions, PATCH for clarifications and wording fixes. All
amendments MUST update the Sync Impact Report and propagate changes to dependent
templates.

### Compliance Review
All infrastructure and Dapr component changes MUST be validated against this constitution
before deployment. AI-generated artifacts (Dockerfiles, Helm charts, Dapr manifests) MUST
be reviewed by a human before application. Periodic compliance audits MUST verify
adherence to declared principles.

**Version**: 4.1.0 | **Ratified**: 2026-01-30 | **Last Amended**: 2026-03-10
