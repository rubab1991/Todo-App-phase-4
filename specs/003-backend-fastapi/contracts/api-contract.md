# API Contract: Backend FastAPI Todo Application

## Base URL
`/api/{user_id}/`

## Authentication
All endpoints require JWT authentication in the Authorization header:
`Authorization: Bearer <jwt_token>`

The user_id in the URL path must match the user_id in the JWT token.

## Endpoints

### GET `/tasks`
**Description**: Retrieve all tasks for the authenticated user
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
**Response**: 200 OK
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Sample Task",
    "description": "This is a sample task",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
]
```
**Errors**:
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch)

### POST `/tasks`
**Description**: Create a new task for the authenticated user
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "completed": false
}
```
**Response**: 201 Created
```json
{
  "id": 2,
  "user_id": "user123",
  "title": "New Task",
  "description": "Task description (optional)",
  "completed": false,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```
**Errors**:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch)

### GET `/tasks/{id}`
**Description**: Retrieve a specific task by ID
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
- `id`: Task ID
**Response**: 200 OK
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Sample Task",
  "description": "This is a sample task",
  "completed": false,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```
**Errors**:
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch or task not owned by user)
- 404: Not Found (task does not exist)

### PUT `/tasks/{id}`
**Description**: Update an existing task
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
- `id`: Task ID
**Request Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true
}
```
**Response**: 200 OK
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```
**Errors**:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch or task not owned by user)
- 404: Not Found (task does not exist)

### DELETE `/tasks/{id}`
**Description**: Delete a specific task
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
- `id`: Task ID
**Response**: 204 No Content
**Errors**:
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch or task not owned by user)
- 404: Not Found (task does not exist)

### PATCH `/tasks/{id}/complete`
**Description**: Toggle the completion status of a task
**Headers**:
- `Authorization: Bearer <jwt_token>`
**Parameters**:
- `user_id`: Path parameter matching JWT token user_id
- `id`: Task ID
**Response**: 200 OK
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Sample Task",
  "description": "This is a sample task",
  "completed": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```
**Errors**:
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user_id mismatch or task not owned by user)
- 404: Not Found (task does not exist)

## Error Response Format
All error responses follow this format:
```json
{
  "detail": "Error message describing the issue"
}
```