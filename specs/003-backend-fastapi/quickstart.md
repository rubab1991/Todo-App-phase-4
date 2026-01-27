# Quickstart Guide: Backend FastAPI Todo Application

## Prerequisites
- Python 3.13+
- pip package manager
- Neon Serverless PostgreSQL database setup
- Better Auth configured for frontend

## Environment Setup
1. Create a `.env` file in the backend directory:
```bash
NEON_DB_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=your_better_auth_url
```

## Installation
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install fastapi sqlmodel python-jose python-dotenv uvicorn asyncpg
```

## Running the Application
1. Start the development server:
```bash
uvicorn main:app --reload
```

2. The API will be available at `http://localhost:8000`

## API Endpoints
- GET `/api/{user_id}/tasks` - List all tasks for authenticated user
- POST `/api/{user_id}/tasks` - Create a new task
- GET `/api/{user_id}/tasks/{id}` - Get task details
- PUT `/api/{user_id}/tasks/{id}` - Update a task
- DELETE `/api/{user_id}/tasks/{id}` - Delete a task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle completion

## Testing
1. Run tests with pytest:
```bash
pytest
```

## Integration with Frontend
The backend expects JWT tokens in the `Authorization: Bearer <token>` header for all requests. The user_id in the URL path must match the user_id in the JWT token.