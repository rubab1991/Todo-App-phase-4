<!-- SYNC IMPACT REPORT
Version change: 2.0.1 → 3.0.0
Bump rationale: MAJOR — new phase (Phase IV) introducing containerization,
Kubernetes governance, Helm chart requirements, and AI DevOps governance.
This redefines the operational scope and deployment model.

Modified principles:
- "VI. Extensibility for Future Phases" → "VI. Extensibility and Cloud-Native Readiness"
- Phase Boundaries updated from Phase III to Phase IV scope

Added sections:
- VII. Declarative Infrastructure
- VIII. Container Governance
- IX. Kubernetes Governance
- X. Helm Chart Governance
- XI. AI DevOps Governance
- XII. Deployment Flow
- XIII. Observability and Debugging
- Containerization Rules (Docker + Gordon)
- Helm Chart Requirements
- AI DevOps Governance (Gordon, kubectl-ai, Kagent)
- Spec-Driven Infrastructure section
- Infrastructure Security Rules
- Phase IV Success Criteria

Removed sections: None (all Phase III content preserved)

Templates requiring updates:
- .specify/templates/plan-template.md — ⚠ pending (Constitution Check gates
  should reference infrastructure principles; no breaking change)
- .specify/templates/spec-template.md — ✅ no update needed
- .specify/templates/tasks-template.md — ⚠ pending (task phases could include
  infrastructure setup phases; no breaking change)

Follow-up TODOs: None
-->
# Phase IV – Todo AI Chatbot Constitution

## Core Principles

### I. Statelessness
The backend holds no runtime memory between requests. Conversation history and tasks are persisted only in the database (Neon Serverless PostgreSQL). Every agent must rely on database state or passed parameters. This ensures scalability and fault tolerance across distributed systems.

### II. User-Centric Security
Each action must validate the `user_id` against the authentication system (Better Auth). Users may only access or modify their own tasks and conversations. Unauthorized actions must be rejected politely, with a clear message. This maintains privacy and data isolation between users.

### III. Consistency
All agents must ensure the frontend and backend remain consistent. Task actions must always be verified against the database. Changes in tasks (create, update, delete, complete) must be reflected in subsequent responses. This prevents state divergence between UI and data layer.

### IV. Tool-First Execution
All task manipulations must go through MCP tools: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`. Agents may never bypass tools. If multiple tools are needed (e.g., list → delete), chain them in order. This enforces proper validation and audit trails.

### V. Spec-Driven Development
All implementation must strictly follow written specifications in /specs. No manual coding; all code must be generated via Claude Code. Specifications serve as the single source of truth for all development activities. Every feature, API endpoint, UI element, and infrastructure component must be defined in specifications before implementation.

### VI. Extensibility and Cloud-Native Readiness
Design all components to be extensible and cloud-native ready. Use modular architecture patterns that allow easy addition of new features. Maintain clean interfaces that accommodate containerized deployment without major refactoring. Follow established patterns that align with Kubernetes orchestration and Helm-based configuration management.

### VII. Declarative Infrastructure
All infrastructure must be defined declaratively. Deployments must be reproducible from version-controlled artifacts alone. No manual `kubectl` edits in production. Every container must be versioned and tagged. Kubernetes manifests must be Helm-managed. AI tools assist but humans validate all infrastructure changes before application.

### VIII. Container Governance
Both frontend and backend must be containerized using Docker. Dockerfiles must use slim base images, expose required ports, use non-root users, and minimize layers. Docker AI Agent (Gordon) may generate Dockerfiles, but generated artifacts must be reviewed before build. If Gordon is unavailable, use Docker CLI or generate Dockerfiles via Claude Code. Images must be tagged following the convention: `todo-frontend:v<N>`, `todo-backend:v<N>`.

### IX. Kubernetes Governance
The local cluster must use Minikube. Every deployment must include Deployment, Service, ConfigMap, and Secret resources. Backend and frontend must run as separate deployments. Replica counts: frontend 2 replicas, backend 2 replicas. Resource requests and limits must be defined for all pods. No privileged containers are allowed.

### X. Helm Chart Governance
All Kubernetes manifests must be managed through Helm charts. Charts must support configurable replica count, image tag, and environment variables. Values must include `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `COHERE_API_KEY`. Secrets must never be hardcoded in Helm templates; they must be injected via Kubernetes Secrets.

### XI. AI DevOps Governance
AI DevOps tools assist but never replace declarative infrastructure.
- **Gordon**: Used for Dockerfile generation and optimization suggestions. Must not auto-deploy without human review.
- **kubectl-ai**: Used for deployment suggestions, scaling, and debugging. All suggestions must be validated before execution.
- **Kagent**: Used for cluster health analysis and resource optimization. Must not auto-modify cluster state.

### XII. Deployment Flow
Infrastructure deployment must follow this sequence:
1. Build Docker images
2. Validate images locally
3. Create Helm charts
4. Deploy to Minikube
5. Verify pods are running
6. Expose frontend via Minikube service
7. Validate chatbot functionality end-to-end

### XIII. Observability and Debugging
Use kubectl-ai for pod debugging, Kagent for cluster health, and `kubectl logs` for container log inspection. No direct container modifications are permitted. All debugging must be performed through sanctioned tooling.

## Agent Responsibilities

### a) Todo Intent Analyzer
- Detect user intent from natural language
- Extract task-related parameters (task title, task_id, status, etc.)
- Identify ambiguity and flag for clarification if needed
- Output structured intent only; do not execute

### b) Todo Task Executor
- Receive validated intent + parameters
- Call MCP tools with correct parameters
- Confirm success or failure
- Log tool_calls for response generation

### c) Conversation Persistence Agent
- Load conversation history before execution
- Store user messages and assistant responses after execution
- Maintain ordering and context

### d) Task Clarification Agent
- Handle ambiguous references or missing parameters
- Ask follow-up questions politely
- Prefer listing tasks for user selection

### e) Error Handling Agent
- Detect errors from MCP tools or database
- Handle gracefully without exposing stack traces
- Suggest corrective actions

### f) Chat Response Composer
- Produce final user-friendly output
- Confirm actions (e.g., task created, task deleted)
- Keep response concise, clear, and polite

### g) Cohere Embedding Agent
- Generate semantic embeddings for messages or task descriptions
- Assist in similarity searches (e.g., finding related tasks)
- Return embeddings in standard JSON format for agent usage

## Conversation & Task Flow

1. Receive user message via `/api/{user_id}/chat`
2. Conversation Persistence Agent fetches history
3. Todo Intent Analyzer interprets message
4. User Scope Guard validates `user_id`
5. Task Clarification Agent resolves ambiguities if needed
6. Todo Task Executor calls MCP tools
7. Cohere Embedding Agent generates embeddings if semantic search is required
8. Error Handling Agent manages tool failures
9. Chat Response Composer returns user-friendly response
10. Conversation Persistence Agent stores final assistant message

## Natural Language → Tool Mapping

| User Intent                     | MCP Tool       |
|---------------------------------|----------------|
| Add / Remember / Create Task     | add_task       |
| Show / List / View Tasks         | list_tasks     |
| Complete / Done / Finished Task  | complete_task  |
| Delete / Remove / Cancel Task    | delete_task    |
| Update / Change / Rename Task    | update_task    |

## Validation Rules

1. **Parameter Checks**
   - Every task operation must include `user_id`
   - Task ID required for complete/delete/update
   - Title required for add/update

2. **Existence Checks**
   - Tasks must exist before modifying
   - If not found, ask user to clarify or provide alternatives

3. **Response Confirmation**
   - After every tool execution, reply with:
     - Task title
     - Status (created, updated, completed, deleted)
     - Optional ID (if user wants)

## Error Handling Policy

- MCP tool errors: return clear explanation
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

- Never expose user_id, API keys (`COHERE_API_KEY`, `BETTER_AUTH_SECRET`, `DATABASE_URL`), or backend identifiers
- No sensitive DB or API keys in responses or container images
- Only execute permitted MCP actions
- Reject out-of-scope requests
- Log all actions for auditing (internal only)
- If API keys are accidentally exposed, they must be rotated immediately
- Secrets must be stored as Kubernetes Secrets; no hardcoded credentials in Helm templates
- Pods must define resource requests and limits
- RBAC must restrict access to cluster resources
- No API keys baked into container images

## Response Composition Guidelines

- Friendly, human-readable
- Always acknowledge action
- Include task details if relevant
- Concise: max 2–3 sentences per action
- Example:
  - `"Task 'Buy groceries' has been created successfully."`
  - `"You have 3 pending tasks: ..."`

## Stateless Architecture Enforcement

- Do NOT store runtime memory
- Agents can only access:
  - Database (Neon PostgreSQL)
  - Passed request parameters
  - Cohere API results
- Every request independent
- Repeatable outcomes guaranteed

## Key Principles

1. **Spec-Driven:** Actions must reflect app spec exactly
2. **Safety:** Reject invalid or unauthorized requests
3. **Consistency:** DB, backend, and frontend remain synchronized
4. **Scalability:** Stateless design ensures any server instance can handle requests
5. **User-Focused:** Responses are polite, clear, and actionable
6. **Declarative Infrastructure:** All deployment artifacts are version-controlled and reproducible

## Integration Notes

- Backend already exists → agents must **use existing endpoints**
- MCP tools wrap backend functionality
- Cohere API adds semantic intelligence
- OpenAI Agents SDK coordinates agents and tool execution

## Technology Stack and Architecture Standards

### Monorepo Structure
Use GitHub Spec-Kit conventions for monorepo organization. Frontend and backend developed in a single repository context but must be independently runnable and independently containerizable. Maintain clear boundaries between different parts of the application. Use consistent tooling and configuration across all components.

### Database Standards
Use Neon Serverless PostgreSQL for persistent storage. SQLModel for all database schema and queries. Tasks must be associated with a user_id for proper isolation. Database schema must support future feature expansion. Filtering by user_id must be enforced at query level.

### API Standards
RESTful design with clear resource-based endpoints. All routes must be namespaced under /api. All endpoints must require authentication. API behavior must remain consistent across environments (local, containerized, Kubernetes). Input validation and error handling must use FastAPI and Pydantic standards. Responses must be JSON-serializable and predictable.

### Frontend Standards
Responsive UI suitable for desktop and mobile. Use Next.js App Router conventions. Server Components by default; Client Components only when required. Centralized API client for all backend communication. Authentication state handled exclusively via Better Auth. No direct database access from frontend.

### Infrastructure Standards
Docker Desktop for local container management. Minikube for local Kubernetes cluster. Helm for Kubernetes manifest management. All infrastructure must be defined declaratively and version-controlled. Container images must use slim base images, non-root users, and minimal layers. AI DevOps tools (Gordon, kubectl-ai, Kagent) assist but require human validation.

## Spec-Driven Infrastructure

Infrastructure must follow the Spec → Plan → Tasks → Implementation flow. Blueprints must define container build strategy, deployment topology, scaling rules, resource allocation, and secret management. All infrastructure artifacts must be version-controlled, repeatable, and documented.

## Development Workflow and Quality Standards

### Specification Requirements
All features must be defined in /specs/features. All API behavior must be defined in /specs/api. All database structure must be defined in /specs/database. All UI behavior must be defined in /specs/ui. All infrastructure must be defined in /specs with deployment blueprints. Specs must be referenced explicitly when implementing features. Specs must be updated if requirements evolve.

### Testing Standards
Implement comprehensive test coverage across all layers. Unit tests for individual components and functions. Integration tests for API endpoints and database interactions. End-to-end tests for complete user workflows. Test authentication and authorization flows thoroughly. Ensure tests cover error cases and edge conditions. Validate containerized deployments function identically to local development.

### Code Quality Standards
Follow consistent conventions across frontend and backend as defined in CLAUDE.md files. Maintain clean, readable, and well-documented code. Use appropriate error handling and validation. Follow security best practices consistently. Ensure proper separation of concerns in all components.

## Constraints and Non-Goals

### Phase Boundaries
Phase IV containerization and Kubernetes deployment scope. No reverting to in-memory storage. No bypassing authentication for development convenience. No hardcoded secrets in source code or container images. No deviation from defined monorepo structure. No direct tool bypass by agents. No manual kubectl edits in production environments.

### Security Constraints
No direct database access from frontend. No client-side user ID manipulation allowed. No shared task access between users. No authentication bypass for debugging. No hardcoded secrets in source code, Dockerfiles, or Helm templates. All sensitive data must be properly encrypted in transit and at rest. Agents may never execute unauthorized MCP actions. No API keys baked into container images. No privileged containers.

## Success Criteria

### Functional Requirements
All 5 basic todo features implemented end-to-end (frontend → backend → database) with AI chatbot interface. Users can sign up and sign in successfully. Authenticated users only see their own tasks. All API endpoints require and validate JWT tokens. Data persists correctly in Neon PostgreSQL. Frontend UI correctly reflects backend state. Natural language processing works for all basic task operations.

### Infrastructure Requirements
Frontend and backend are containerized with proper Docker images. Helm chart deploys successfully on Minikube. All pods are healthy and pass readiness checks. Services are reachable within the cluster. Todo chatbot functions correctly inside Kubernetes. Infrastructure is fully reproducible from version-controlled artifacts.

### Quality Requirements
Codebase is clean, maintainable, and production-ready. Agentic development workflow is fully reproducible and reviewable. Proper error handling and user feedback throughout the application. Responsive design that works on multiple device sizes. Performance meets reasonable expectations for a todo application. Proper logging and observability for operational concerns. AI agents respond appropriately to natural language inputs.

## Governance

Specifications serve as the authoritative source for all implementation decisions. Any deviations from specifications must be documented and approved. All architectural decisions that meet significance criteria must be recorded as ADRs. All user interactions must be captured as PHRs for auditability. Development team members must follow the established agentic development workflow. This constitution governs ALL agents in the Phase IV Todo AI Chatbot. Agents must follow these rules strictly to maintain reliability, security, and alignment with the full-stack backend and infrastructure.

### Amendment Procedure
Constitution amendments require review and explicit approval. Version follows semantic versioning: MAJOR for governance redefinitions or principle removals, MINOR for new principles or material expansions, PATCH for clarifications and wording fixes. All amendments must update the Sync Impact Report and propagate changes to dependent templates.

### Compliance Review
All infrastructure changes must be validated against this constitution before deployment. AI-generated artifacts (Dockerfiles, Helm charts, manifests) must be reviewed by a human before application. Periodic compliance audits should verify adherence to declared principles.

**Version**: 3.0.0 | **Ratified**: 2026-01-30 | **Last Amended**: 2026-02-19
