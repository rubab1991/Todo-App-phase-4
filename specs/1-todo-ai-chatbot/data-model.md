# Data Model: Todo AI Chatbot

## Entities

### User
- **Fields**:
  - `id` (UUID/Integer): Unique identifier
  - `email` (String): User email for authentication
  - `created_at` (DateTime): Account creation timestamp
  - `updated_at` (DateTime): Last update timestamp
- **Relationships**:
  - One-to-many with Task
  - One-to-many with Conversation
- **Validation**: Email format validation, uniqueness constraint on email

### Task
- **Fields**:
  - `id` (Integer): Unique identifier
  - `user_id` (UUID/Integer): Foreign key to User
  - `title` (String): Task title
  - `description` (Text, optional): Task description
  - `status` (Enum: 'pending', 'completed'): Task completion status
  - `created_at` (DateTime): Task creation timestamp
  - `updated_at` (DateTime): Last update timestamp
- **Relationships**:
  - Many-to-one with User
- **Validation**: Title required, user_id required, status enum constraint

### Conversation
- **Fields**:
  - `id` (UUID): Unique identifier
  - `user_id` (UUID/Integer): Foreign key to User
  - `title` (String): Conversation title/description
  - `created_at` (DateTime): Conversation start timestamp
  - `updated_at` (DateTime): Last activity timestamp
- **Relationships**:
  - Many-to-one with User
  - One-to-many with Message
- **Validation**: User_id required

### Message
- **Fields**:
  - `id` (UUID): Unique identifier
  - `conversation_id` (UUID): Foreign key to Conversation
  - `user_id` (UUID/Integer): Foreign key to User
  - `role` (Enum: 'user', 'assistant'): Sender type
  - `content` (Text): Message content
  - `timestamp` (DateTime): Message creation timestamp
  - `tool_calls` (JSON, optional): Any tool calls made during message processing
  - `tool_responses` (JSON, optional): Responses from tool calls
- **Relationships**:
  - Many-to-one with Conversation
  - Many-to-one with User
- **Validation**: Role enum constraint, content required, conversation_id required

## State Transitions

### Task States
- `pending` → `completed`: When task is marked as done via complete_task MCP tool
- `completed` → `pending`: When completed task is reopened (if feature supported)

### Message Flow
- New user message → Intent analysis → Tool execution → Assistant response generation → Message stored in DB

## Relationships
- User has many Tasks and Conversations
- Conversation has many Messages
- Messages belong to User and Conversation
- Tasks belong to User