# Todo AI Chatbot API Documentation

## Overview

The Todo AI Chatbot API provides a natural language interface for managing tasks. Users can interact with the system using conversational language to create, list, update, complete, and delete tasks.

## Base URL

```
https://api.todo-ai-chatbot.com/v1  # Production
http://localhost:8000/v1            # Development
```

## Authentication

All API endpoints require authentication. The system uses Better Auth for user management.

Include the authentication token in the request headers:

```
Authorization: Bearer <token>
```

Additionally, most endpoints require the `user_id` as a path parameter to ensure proper user isolation.

## Endpoints

### Chat Endpoint

Process a user message and return an appropriate response with any task operations performed.

```
POST /api/{user_id}/chat
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user

#### Request Body
```json
{
  "message": "Add task: Buy groceries",
  "conversation_id": "abc123-def456"
}
```

#### Response
```json
{
  "response": "Task 'Buy groceries' has been added successfully.",
  "conversation_id": "abc123-def456",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "parameters": {
        "user_id": "user123",
        "title": "Buy groceries"
      },
      "result": {
        "task_id": 1,
        "status": "created",
        "title": "Buy groceries"
      }
    }
  ],
  "task_operations": [
    {
      "operation": "create",
      "task_id": 1,
      "status": "success",
      "title": "Buy groceries"
    }
  ]
}
```

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "Show my tasks",
    "conversation_id": "conv456"
  }'
```

### Get User Tasks

Retrieve all tasks for the specified user.

```
GET /api/{user_id}/tasks
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user
- `status` (query, optional): Filter tasks by status (all, pending, completed). Default: all

#### Response
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "user123",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "status": "pending",
      "created_at": "2023-10-20T10:00:00Z",
      "updated_at": "2023-10-20T10:00:00Z"
    }
  ],
  "status": "retrieved",
  "count": 1
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8000/api/user123/tasks?status=pending" \
  -H "Authorization: Bearer <token>"
```

### Create Task

Create a new task for the user.

```
POST /api/{user_id}/tasks
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user

#### Request Body
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

#### Response
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "status": "pending",
  "created_at": "2023-10-20T10:00:00Z",
  "updated_at": "2023-10-20T10:00:00Z"
}
```

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, bread, eggs"
  }'
```

### Update Task

Update the title or description of an existing task.

```
PUT /api/{user_id}/tasks/{task_id}
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user
- `task_id` (path, required): The ID of the task to update

#### Request Body
```json
{
  "title": "Buy weekly groceries",
  "description": "Milk, bread, eggs, fruits"
}
```

#### Response
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy weekly groceries",
  "description": "Milk, bread, eggs, fruits",
  "status": "pending",
  "created_at": "2023-10-20T10:00:00Z",
  "updated_at": "2023-10-20T11:00:00Z"
}
```

#### Example Request
```bash
curl -X PUT "http://localhost:8000/api/user123/tasks/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Buy weekly groceries",
    "description": "Milk, bread, eggs, fruits"
  }'
```

### Complete Task

Mark a task as completed.

```
PATCH /api/{user_id}/tasks/{task_id}
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user
- `task_id` (path, required): The ID of the task to complete

#### Response
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "status": "completed",
  "created_at": "2023-10-20T10:00:00Z",
  "updated_at": "2023-10-20T12:00:00Z"
}
```

#### Example Request
```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/1" \
  -H "Authorization: Bearer <token>"
```

### Delete Task

Delete an existing task.

```
DELETE /api/{user_id}/tasks/{task_id}
```

#### Parameters
- `user_id` (path, required): The ID of the authenticated user
- `task_id` (path, required): The ID of the task to delete

#### Response
```json
{
  "task_id": 1,
  "status": "deleted",
  "message": "Task 'Buy groceries' has been deleted successfully"
}
```

#### Example Request
```bash
curl -X DELETE "http://localhost:8000/api/user123/tasks/1" \
  -H "Authorization: Bearer <token>"
```

## Error Responses

The API uses conventional HTTP response codes:

- `200`: Success
- `201`: Created
- `400`: Bad request - Invalid input
- `401`: Unauthorized - Invalid or missing authentication token
- `403`: Forbidden - User does not have access to this resource
- `404`: Not found - Resource does not exist
- `429`: Too many requests - Rate limit exceeded
- `500`: Internal server error

### Error Response Format
```json
{
  "detail": "Error message describing the issue"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 60 requests per minute per IP address
- Returns HTTP 429 if the limit is exceeded

## Webhook Events

The system does not currently support webhooks, but this may be added in future versions.

## SDKs and Libraries

### JavaScript/TypeScript
```javascript
import { TodoChatbotClient } from '@todo-ai/chatbot-sdk';

const client = new TodoChatbotClient({
  baseUrl: 'https://api.todo-ai-chatbot.com/v1',
  authToken: 'your-token-here'
});

const response = await client.sendMessage('user123', 'Add task: Buy groceries');
console.log(response);
```

### Python
```python
from todo_ai_chatbot import TodoChatbotClient

client = TodoChatbotClient(
    base_url="https://api.todo-ai-chatbot.com/v1",
    auth_token="your-token-here"
)

response = client.send_message("user123", "Add task: Buy groceries")
print(response)
```

## Changelog

### v1.0.0
- Initial release
- Natural language processing for task management
- Full CRUD operations for tasks
- Conversation history persistence
- AI-powered response generation