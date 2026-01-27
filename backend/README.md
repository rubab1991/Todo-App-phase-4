# Todo API Backend

This is a FastAPI-based backend for the Todo application, providing secure REST API endpoints for task management with JWT authentication.

## Features

- Secure JWT-based authentication compatible with Better Auth
- RESTful API endpoints for task management (CRUD operations)
- User isolation - each user can only access their own tasks
- Async database operations with SQLModel and PostgreSQL
- Comprehensive error handling
- Structured logging

## Prerequisites

- Python 3.13+
- Neon Serverless PostgreSQL database
- Better Auth configured for frontend

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following environment variables:
   ```env
   NEON_DB_URL=your_neon_database_url
   BETTER_AUTH_SECRET=your_better_auth_secret
   ```

## Running the Application

To run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

All endpoints require JWT authentication in the Authorization header:
`Authorization: Bearer <jwt_token>`

The user_id in the URL path must match the user_id in the JWT token.

### Available Endpoints

- `GET /api/{user_id}/tasks` - Retrieve all tasks for the authenticated user
- `POST /api/{user_id}/tasks` - Create a new task for the authenticated user
- `GET /api/{user_id}/tasks/{id}` - Retrieve a specific task by ID
- `PUT /api/{user_id}/tasks/{id}` - Update an existing task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status of a task

## Environment Variables

- `NEON_DB_URL`: Database connection string for Neon Serverless PostgreSQL
- `BETTER_AUTH_SECRET`: Secret key for JWT token validation from Better Auth

## Project Structure

```
backend/
├── main.py              # FastAPI entry point
├── models.py            # SQLModel ORM models
├── routes/
│   └── tasks.py         # Task-related endpoints
├── auth.py              # JWT verification middleware
├── db.py                # Database connection
├── utils.py             # Helper functions
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Security

- All endpoints require valid JWT tokens
- User data isolation is enforced at the API and database level
- The user_id in the JWT token must match the user_id in the URL path
- Unauthorized access attempts are rejected with appropriate error codes