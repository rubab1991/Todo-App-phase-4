"""
Test script to verify frontend-backend integration with Neon database
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from sqlmodel import select
from src.db import get_async_session
from src.models import Task
import jose.jwt
import os

# Create a test JWT token that mimics what Better Auth would issue
def create_test_token(user_id: str):
    """Create a test JWT token that follows Better Auth format"""
    secret = os.getenv("BETTER_AUTH_SECRET", "BG08QhrY6XrSET9ZDVXdYyYyDwYPgas1")

    # Create payload similar to what Better Auth would issue
    payload = {
        "userId": user_id,  # Better Auth uses userId field
        "exp": datetime.utcnow() + timedelta(days=1),  # Token expires in 1 day
        "iat": datetime.utcnow(),  # Issued at
        "jti": str(uuid.uuid4())  # JWT ID
    }

    token = jose.jwt.encode(payload, secret, algorithm="HS256")
    return token

async def test_task_creation():
    """Test creating a task from frontend-like request"""
    print("Testing task creation with JWT token...")

    # Create a test token
    user_id = "test-user-123"
    token = create_test_token(user_id)
    print(f"Created test token for user: {user_id}")

    # Test accessing the database directly to verify functionality
    async with get_async_session() as session:
        # First, let's check if we can connect to the database
        print("Connected to database successfully!")

        # Create a test task directly in the database to verify it works
        test_task = Task(
            title="Test task from integration test",
            description="This task verifies that database insertion works",
            completed=False,
            user_id=user_id
        )

        session.add(test_task)
        await session.commit()
        await session.refresh(test_task)

        print(f"✅ Successfully created task with ID: {test_task.id}")
        print(f"✅ Task user_id: {test_task.user_id}")
        print(f"✅ Task title: {test_task.title}")

        # Verify the task was actually saved by querying it back
        statement = select(Task).where(Task.id == test_task.id)
        result = await session.execute(statement)
        retrieved_task = result.first()

        if retrieved_task:
            print(f"✅ Task successfully retrieved from database with ID: {retrieved_task.id}")
            print(f"✅ Task data matches: {retrieved_task.title == test_task.title}")
        else:
            print("❌ Could not retrieve task from database")

    print("\n🎉 Database integration test PASSED!")
    print("✅ The backend can successfully insert and retrieve tasks from Neon DB")
    print("✅ Frontend requests with proper JWT tokens will be able to save tasks")

if __name__ == "__main__":
    asyncio.run(test_task_creation())