# API Contract: Frontend UI for Phase II Full-Stack Todo Web Application

## Overview

This document defines the API contracts that the frontend expects from the backend service. These contracts represent the interface between the frontend and backend components of the todo application.

## Authentication Endpoints

### POST /api/auth/signin
Authenticate a user with email and password.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "user_abc123",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401)**:
```json
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/signup
Register a new user with email and password.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": "user_abc123",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (409)**:
```json
{
  "error": "Email already registered"
}
```

## Task Management Endpoints

### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (200)**:
```json
{
  "tasks": [
    {
      "id": "task_abc123",
      "title": "Complete project proposal",
      "description": "Finish writing the project proposal document",
      "dueDate": "2023-12-31T23:59:59Z",
      "priority": "high",
      "isComplete": false,
      "userId": "user_abc123",
      "createdAt": "2023-12-01T10:00:00Z",
      "updatedAt": "2023-12-01T10:00:00Z"
    }
  ]
}
```

**Response (401)**:
```json
{
  "error": "Unauthorized"
}
```

### POST /api/tasks
Create a new task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "Complete project proposal",
  "description": "Finish writing the project proposal document",
  "dueDate": "2023-12-31T23:59:59Z",
  "priority": "high",
  "isComplete": false
}
```

**Response (201)**:
```json
{
  "task": {
    "id": "task_def456",
    "title": "Complete project proposal",
    "description": "Finish writing the project proposal document",
    "dueDate": "2023-12-31T23:59:59Z",
    "priority": "high",
    "isComplete": false,
    "userId": "user_abc123",
    "createdAt": "2023-12-01T11:00:00Z",
    "updatedAt": "2023-12-01T11:00:00Z"
  }
}
```

### PUT /api/tasks/{taskId}
Update an existing task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "Updated project proposal",
  "isComplete": true
}
```

**Response (200)**:
```json
{
  "task": {
    "id": "task_abc123",
    "title": "Updated project proposal",
    "description": "Finish writing the project proposal document",
    "dueDate": "2023-12-31T23:59:59Z",
    "priority": "high",
    "isComplete": true,
    "userId": "user_abc123",
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2023-12-01T12:00:00Z"
  }
}
```

### DELETE /api/tasks/{taskId}
Delete a task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (204)**:
```
[No content]
```

**Response (404)**:
```json
{
  "error": "Task not found"
}
```

## Error Format

All error responses follow this format:

```json
{
  "error": "Descriptive error message"
}
```

## Authentication Requirements

- All `/api/tasks` endpoints require a valid JWT token in the Authorization header
- The token must be in the format `Bearer {jwt_token}`
- Requests without valid authentication will return 401 Unauthorized
- Tokens expire after 24 hours and need to be refreshed