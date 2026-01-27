# Phase II – Full-Stack Todo Web Application Constitution

## Core Principles

### I. Spec-Driven Development
All implementation must strictly follow written specifications in /specs. No manual coding; all code must be generated via Claude Code. Specifications serve as the single source of truth for all development activities. Every feature, API endpoint, and UI element must be defined in specifications before implementation.

### II. Clear Separation of Concerns
Maintain strict separation between frontend, backend, database, and authentication layers. Frontend implemented in Next.js 16+ using App Router. Backend implemented as a separate FastAPI service. ORM layer implemented using SQLModel. Each layer must have well-defined interfaces and minimal coupling to other layers.

### III. Security-First Design
Security must be designed into the system from the ground up. User data must be isolated at all levels. Authentication handled on the frontend using Better Auth. JWT tokens must be validated on every API request. Task ownership must be enforced at the database query level. Requests without valid JWT tokens must return 401 Unauthorized.

### IV. Extensibility for Future Phases
Design all components to be extensible for future AI and cloud-native phases. Use modular architecture patterns that allow easy addition of new features. Maintain clean interfaces that can accommodate future enhancements without requiring major refactoring. Follow established patterns that align with cloud-native deployment strategies.

### V. Reproducibility and Auditability
All development must be reproducible and auditable. Use Spec-Kit Plus tools for consistent development workflows. Maintain complete traceability from specifications to implementation. Document all architectural decisions. Preserve development history through Prompt History Records (PHRs) and Architecture Decision Records (ADRs).

### VI. Production-Ready Quality
All code must meet production quality standards from the start. Implement proper error handling, logging, and monitoring. Include comprehensive testing at all levels (unit, integration, end-to-end). Follow security best practices for authentication, authorization, and data protection. Ensure performance and scalability considerations are addressed early.

## Technology Stack and Architecture Standards

### Monorepo Structure
Use GitHub Spec-Kit conventions for monorepo organization. Frontend and backend developed in a single repository context but must be independently runnable. Maintain clear boundaries between different parts of the application. Use consistent tooling and configuration across all components.

### Database Standards
Use Neon Serverless PostgreSQL for persistent storage. SQLModel for all database schema and queries. Tasks must be associated with a user_id for proper isolation. Database schema must support future feature expansion. Filtering by user_id must be enforced at query level.

### API Standards
RESTful design with clear resource-based endpoints. All routes must be namespaced under /api. All endpoints must require authentication. API behavior must remain consistent across environments. Input validation and error handling must use FastAPI and Pydantic standards. Responses must be JSON-serializable and predictable.

### Frontend Standards
Responsive UI suitable for desktop and mobile. Use Next.js App Router conventions. Server Components by default; Client Components only when required. Centralized API client for all backend communication. Authentication state handled exclusively via Better Auth. No direct database access from frontend.

## Development Workflow and Quality Standards

### Specification Requirements
All features must be defined in /specs/features. All API behavior must be defined in /specs/api. All database structure must be defined in /specs/database. All UI behavior must be defined in /specs/ui. Specs must be referenced explicitly when implementing features. Specs must be updated if requirements evolve.

### Testing Standards
Implement comprehensive test coverage across all layers. Unit tests for individual components and functions. Integration tests for API endpoints and database interactions. End-to-end tests for complete user workflows. Test authentication and authorization flows thoroughly. Ensure tests cover error cases and edge conditions.

### Code Quality Standards
Follow consistent conventions across frontend and backend as defined in CLAUDE.md files. Maintain clean, readable, and well-documented code. Use appropriate error handling and validation. Follow security best practices consistently. Ensure proper separation of concerns in all components.

## Constraints and Non-Goals

### Phase Boundaries
Phase II only (no AI chatbot functionality). No direct reuse of Phase I in-memory storage. No file-based persistence. No bypassing authentication for development convenience. No hardcoded secrets in source code. No deviation from defined monorepo structure.

### Security Constraints
No direct database access from frontend. No client-side user ID manipulation allowed. No shared task access between users. No authentication bypass for debugging. No hardcoded secrets in source code. All sensitive data must be properly encrypted in transit and at rest.

## Success Criteria

### Functional Requirements
All 5 basic todo features implemented end-to-end (frontend → backend → database). Users can sign up and sign in successfully. Authenticated users only see their own tasks. All API endpoints require and validate JWT tokens. Data persists correctly in Neon PostgreSQL. Frontend UI correctly reflects backend state.

### Quality Requirements
Codebase is clean, maintainable, and Phase III–ready. Agentic development workflow is fully reproducible and reviewable. Proper error handling and user feedback throughout the application. Responsive design that works on multiple device sizes. Performance meets reasonable expectations for a todo application. Proper logging and observability for operational concerns.

## Governance

Specifications serve as the authoritative source for all implementation decisions. Any deviations from specifications must be documented and approved. All architectural decisions that meet significance criteria must be recorded as ADRs. All user interactions must be captured as PHRs for auditability. Development team members must follow the established agentic development workflow.

**Version**: 1.0.0 | **Ratified**: 2026-01-16 | **Last Amended**: 2026-01-16
