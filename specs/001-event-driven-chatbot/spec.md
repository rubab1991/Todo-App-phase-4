# Feature Specification: Phase V – Advanced Event-Driven Todo Chatbot System

**Feature Branch**: `001-event-driven-chatbot`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Phase V – Advanced Event-Driven Todo Chatbot System"

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Task Priority and Tagging (Priority: P1)

A user interacts with the chatbot to create and manage tasks with priority levels and
tags. They can say "Create a high-priority task: submit report, tagged work and urgent."
The chatbot creates the task with the correct priority and tags. The user can later filter
or search for "all high-priority work tasks" and see only relevant results.

**Why this priority**: Priority and tagging form the foundational metadata layer for all
tasks. Every subsequent feature (filtering, search, sorting, reminders) depends on
structured task attributes. Delivers immediate value by helping users organize tasks
without requiring any event infrastructure.

**Independent Test**: Can be fully tested by creating tasks with various priority levels
and tags via the chatbot, then retrieving them with filters — delivers a more organized
task list.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they instruct the chatbot to create a task
   with priority "High" and tags "work" and "urgent", **Then** the task is saved with
   those attributes and confirmed in the response.
2. **Given** tasks with mixed priorities, **When** the user requests tasks filtered to
   "High" priority, **Then** only high-priority tasks are returned.
3. **Given** a task with priority "Low", **When** the user asks to change its priority
   to "Medium", **Then** the task is updated and the change is confirmed.

---

### User Story 2 – Search and Filtering (Priority: P2)

A user wants to find specific tasks without scrolling through an entire list. They type
"Show me all tasks tagged personal due this week" or "Search for grocery." The system
returns matching tasks through the chatbot interface.

**Why this priority**: Search and filtering are essential for usability once a user
accumulates many tasks. Depends on P1 metadata (priority, tags) being in place.

**Independent Test**: Can be fully tested by populating tasks with varied titles, tags,
and priorities, then executing search and filter queries — delivers immediately usable
task discovery.

**Acceptance Scenarios**:

1. **Given** tasks with varying titles and descriptions, **When** the user searches by
   keyword, **Then** only tasks matching the keyword in title or description are returned.
2. **Given** tasks with varying priorities and statuses, **When** the user filters by
   "incomplete high-priority", **Then** only those tasks appear.
3. **Given** tasks with different tags, **When** the user filters by a specific tag,
   **Then** only tasks carrying that tag are returned.
4. **Given** no matching tasks, **When** a search or filter is applied, **Then** the
   chatbot returns a clear "no matching tasks found" message.

---

### User Story 3 – Task Sorting (Priority: P3)

A user asks the chatbot to "show my tasks sorted by due date" or "list by priority."
Tasks are returned in the requested order, making deadline and priority awareness
effortless.

**Why this priority**: Sorting is a usability enhancement that builds on P1 metadata.
Valuable independently once tasks have due dates and priorities.

**Independent Test**: Can be fully tested by requesting task lists with explicit sort
criteria and verifying ordering in the response.

**Acceptance Scenarios**:

1. **Given** tasks with different due dates, **When** sorted by due date ascending,
   **Then** the nearest due date appears first.
2. **Given** tasks with mixed priorities, **When** sorted by priority descending,
   **Then** High tasks appear before Medium, which appear before Low.
3. **Given** tasks with different creation dates, **When** sorted by creation date,
   **Then** tasks appear in chronological order.

---

### User Story 4 – Due Dates and Reminders (Priority: P4)

A user tells the chatbot "Add a task: file taxes, due April 15th, remind me April 10th
at 9am." The system stores the due date and schedules a reminder. When the reminder time
arrives, the user receives a notification. Overdue tasks are surfaced distinctly in the
task list.

**Why this priority**: Due dates and reminders are the primary time-management features
and unlock the advanced automation story. Depends on task metadata (P1) being in place.

**Independent Test**: Can be tested end-to-end by creating a task with a near-future
reminder time, waiting for the trigger, and verifying the notification is delivered.

**Acceptance Scenarios**:

1. **Given** a user sets a due date on a task, **When** the task list is retrieved,
   **Then** the due date is displayed and overdue tasks are visually distinguished.
2. **Given** a task with a reminder time set, **When** the scheduled time arrives,
   **Then** the user receives a notification containing the task title and due date.
3. **Given** a user wants to update a reminder, **When** they provide a new reminder
   time via the chatbot, **Then** the old reminder is cancelled and the new one is
   scheduled.
4. **Given** a task is completed before its reminder fires, **When** the reminder time
   arrives, **Then** no notification is sent.

---

### User Story 5 – Recurring Tasks (Priority: P5)

A user creates a recurring task: "Every Monday, remind me to send team status update."
When they mark it complete, the system automatically creates the next instance with the
correct next due date. The user never has to manually re-create it.

**Why this priority**: Recurring tasks are a power-user automation feature that depends
on due dates (P4) and the event-driven background pipeline being operational.

**Independent Test**: Can be fully tested by creating a daily recurring task, completing
it, and verifying a new instance is automatically created for the following day.

**Acceptance Scenarios**:

1. **Given** a user creates a task with daily recurrence, **When** they complete it,
   **Then** a new task with the same title and the next day's due date is automatically
   created.
2. **Given** a recurring task with weekly cadence, **When** completed, **Then** the next
   instance has a due date exactly one week later.
3. **Given** a monthly recurring task is completed, **Then** the next instance is created
   for the same day of the following month.
4. **Given** a recurring task, **When** the user explicitly deletes it, **Then** no
   further instances are created.

---

### User Story 6 – Real-Time Multi-Client Updates (Priority: P6)

A user has the chatbot open on two devices. They create a task on device A. Within
seconds, device B shows the new task without a manual refresh. The same synchronization
happens for updates, completions, and deletions.

**Why this priority**: Real-time updates improve multi-device experience but require
the full event pipeline to be operational. Depends on all prior stories and the
event-streaming infrastructure.

**Independent Test**: Can be tested by opening two browser sessions for the same user,
making a task change in one, and confirming the other updates within 3 seconds.

**Acceptance Scenarios**:

1. **Given** a user is connected on two clients, **When** a task is created on one
   client, **Then** the other client displays the new task within 3 seconds.
2. **Given** a task is completed on one client, **When** the event propagates, **Then**
   the second client reflects the completed status without a manual refresh.
3. **Given** a client loses connectivity and reconnects, **When** it reconnects,
   **Then** it receives missed updates and displays the current task state.

---

### Edge Cases

- **Invalid date input**: If the user provides an invalid or ambiguous date for due date
  or reminder, the chatbot MUST ask for clarification rather than silently discarding it.
- **Reminder in the past**: If a reminder time is set in the past, the system MUST reject
  it and prompt the user to provide a future time.
- **Completing a recurring task without a due date**: The system MUST still create the
  next instance; due date is computed from recurrence pattern start date if no due date
  is set.
- **Multiple reminders per task**: Only one active reminder per task is supported;
  updating a reminder MUST replace the existing one.
- **Empty search query**: An empty search returns all tasks (equivalent to list-all).
- **Tag formatting**: Tags MUST be stored lowercase and whitespace-trimmed; duplicate
  tags on the same task MUST be deduplicated silently.
- **Event delivery failure**: A failed event publish MUST NOT roll back the underlying
  task operation; the failure MUST be logged and retried.

## Requirements *(mandatory)*

### Functional Requirements

**Task Metadata**

- **FR-001**: System MUST allow users to assign a priority level (Low, Medium, or High)
  to any task at creation or update time.
- **FR-002**: System MUST allow tasks to carry zero or more tags; tags MUST be addable
  and removable at any time.
- **FR-003**: System MUST allow tasks to have an optional due date that is stored and
  displayed in the task list.
- **FR-004**: System MUST visually distinguish overdue tasks from tasks that are not yet
  due in all task list views.

**Search, Filter, Sort**

- **FR-005**: System MUST allow users to search tasks by keyword across title and
  description fields.
- **FR-006**: System MUST allow users to filter tasks by any combination of: priority,
  completion status, tag, and due date range.
- **FR-007**: System MUST allow users to sort tasks by: priority, due date, creation
  date, or completion status.
- **FR-008**: Filter and sort options MUST be combinable in a single request.

**Reminders**

- **FR-009**: System MUST allow users to set a reminder timestamp on any task.
- **FR-010**: System MUST deliver a notification to the user when a task's reminder
  timestamp is reached.
- **FR-011**: System MUST automatically cancel a pending reminder when the associated
  task is completed or deleted before the reminder fires.
- **FR-012**: System MUST allow users to update or remove a reminder on an existing task.

**Recurring Tasks**

- **FR-013**: System MUST support the following recurrence patterns: daily, weekly,
  monthly.
- **FR-014**: When a recurring task is completed, the system MUST automatically create
  the next task instance with a due date computed from the recurrence pattern.
- **FR-015**: Recurring task instances MUST support all standard task operations (search,
  filter, sort, update, delete, reminder).

**Event-Driven Synchronization**

- **FR-016**: Every task state change (create, update, complete, delete) MUST publish an
  event to the event streaming platform.
- **FR-017**: System MUST reflect task changes on all connected clients of the same user
  within 3 seconds under normal operating load.
- **FR-018**: Task events MUST conform to the canonical schema: `event_type`, `task_id`,
  `task_data`, `user_id`, `timestamp`.
- **FR-019**: Reminder events MUST conform to the reminder schema: `task_id`, `title`,
  `due_at`, `remind_at`, `user_id`.

**Deployment**

- **FR-020**: Frontend MUST be publicly accessible via Vercel.
- **FR-021**: Backend MUST be publicly accessible via Render.
- **FR-022**: System MUST operate correctly with event streaming hosted on Redpanda Cloud.

### Key Entities

- **Task**: Core item with title, description, priority (Low/Medium/High), tags (list),
  due_at (optional datetime), remind_at (optional datetime), recurrence pattern
  (none/daily/weekly/monthly), completion status, user_id, created_at, updated_at.
- **Tag**: Lightweight label (lowercase, trimmed string) associated with one or more
  tasks; no hierarchy.
- **TaskEvent**: Immutable event published on every task state change; includes
  event_type, task_id, snapshot of task_data, user_id, and timestamp.
- **ReminderEvent**: Event published when a task's remind_at time is reached; includes
  task_id, title, due_at, remind_at, user_id.
- **RecurringTaskInstance**: A task auto-generated from a completed recurring parent;
  carries the same recurrence metadata with an incremented due date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign priority and tags to a task in a single chatbot interaction
  in under 10 seconds.
- **SC-002**: Search results for a keyword query are returned within 2 seconds for a
  task list of up to 500 tasks per user.
- **SC-003**: Reminders fire within 30 seconds of the scheduled time under normal
  system load.
- **SC-004**: When a recurring task is completed, the next instance is automatically
  created within 10 seconds.
- **SC-005**: Real-time task changes are reflected on all connected clients of the same
  user within 3 seconds of the originating action.
- **SC-006**: All 5 intermediate features (priority, tags, search, filter, sort) and 3
  advanced features (recurring tasks, due dates, reminders) pass acceptance tests with
  zero critical defects.
- **SC-007**: Frontend is publicly reachable on Vercel and backend on Render, both
  responding within 5 seconds under normal load.
- **SC-008**: Kafka events flow end-to-end through Redpanda Cloud with no message loss
  verified under normal operating conditions.
- **SC-009**: Local Minikube environment runs all services with Dapr runtime and passes
  all integration tests.

## Assumptions

- Users are already authenticated; this spec does not cover authentication changes.
- "Tags" are free-form strings with no hierarchy; tag taxonomy management is out of scope.
- Reminder notifications are delivered in-app through the chatbot interface only; email
  and push notifications are out of scope for Phase V.
- Recurrence computes the next due date relative to the completed task's due date, not
  the wall-clock completion timestamp.
- A task may have at most one active reminder at a time; multi-reminder support is out
  of scope.
- Real-time updates target clients of the same authenticated user only; cross-user
  collaboration is out of scope.
- Event delivery failures do not roll back the underlying task operation; task CRUD
  succeeds regardless of event pipeline health.

## Scope

### In Scope
- Task priority, tags, search, filter, sort
- Due dates with overdue visual distinction
- Reminder scheduling and cancellation
- Recurring tasks (daily, weekly, monthly)
- Kafka event publishing for all task state changes
- Real-time client synchronization via events
- Vercel (frontend) and Render (backend) deployment
- Redpanda Cloud event streaming
- Local Minikube + Dapr runtime validation

### Out of Scope
- Email or push notification delivery
- Multi-user task collaboration or sharing
- Nested / hierarchical tags
- Multiple simultaneous reminders per task
- Time zone conversion (UTC storage is assumed)
- Offline / local-first data sync
- Analytics dashboards or reporting
