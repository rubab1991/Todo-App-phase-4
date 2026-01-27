# Data Model: Backend FastAPI Todo Application

## Entity: Task
**Description**: Represents a user's todo item in the system
**Fields**:
- `id`: Integer, primary key, auto-generated
- `user_id`: String, foreign key to user identifier from JWT token, required
- `title`: String, required, maximum length 255
- `description`: String, optional, maximum length 1000
- `completed`: Boolean, default false
- `created_at`: DateTime, auto-generated timestamp
- `updated_at`: DateTime, auto-generated timestamp

**Relationships**:
- Belongs to a User (referenced by user_id from JWT token)
- User can have many Tasks

**Validation Rules**:
- Title is required and cannot exceed 255 characters
- User_id must match the authenticated user from JWT token
- Only the owner can modify or delete the task

## Entity: User (External)
**Description**: Represents an authenticated user managed by Better Auth
**Fields**:
- `id`: String, unique identifier extracted from JWT token

**Relationships**:
- Has many Tasks (via user_id foreign key)

## Database Schema
**Table: tasks**
- Columns match Task entity fields above
- Indexes on `user_id` for efficient filtering by authenticated user
- Indexes on `completed` for efficient sorting and filtering
- Foreign key constraint linking user_id to users table (managed by Better Auth)

## State Transitions
**Task Completion**:
- `completed: false` → `completed: true` when user marks task as complete
- `completed: true` → `completed: false` when user unmarks task as complete