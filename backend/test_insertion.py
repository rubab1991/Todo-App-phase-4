"""
Test script to verify database insertion is working properly
"""

import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
from sqlmodel import select

# Load environment variables
load_dotenv()

# Get database URL from environment variable
NEON_DB_URL = os.getenv("NEON_DB_URL")
if NEON_DB_URL and NEON_DB_URL.startswith("postgresql://"):
    DATABASE_URL = NEON_DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = NEON_DB_URL

print(f"Testing database insertion with URL: {DATABASE_URL}")

async def test_insertion():
    """Test that data can be inserted into the database"""
    try:
        # Import models
        from src.models import User, Task

        # Create async engine
        engine = create_async_engine(
            DATABASE_URL,
            echo=False,
            connect_args={"server_settings": {"application_name": "Todo-API-App"}}
        )

        # Test inserting a user first
        async with engine.begin() as conn:
            from sqlmodel.ext.asyncio.session import AsyncSession
            session = AsyncSession(conn)

            # Try to get or create a test user
            from src.db import get_or_create_user
            test_user = await get_or_create_user(session, "test_user_123", "test@example.com")
            print(f"✅ Retrieved/created user with ID: {test_user.id}")

            # Create a test task
            from datetime import datetime
            test_task = Task(
                title="Test Task",
                description="This is a test task for verification",
                completed=False,
                user_id=test_user.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            session.add(test_task)
            await session.commit()  # This should commit both user and task if new
            await session.refresh(test_task)

            print(f"✅ Inserted task with ID: {test_task.id}")
            print(f"✅ Task title: {test_task.title}")
            print(f"✅ Task user_id: {test_task.user_id}")

            # Now verify by querying
            statement = select(Task).where(Task.id == test_task.id)
            result = await session.execute(statement)
            retrieved_task = result.scalar_one_or_none()

            if retrieved_task:
                print(f"✅ Successfully retrieved task from database: {retrieved_task.title}")
                print(f"✅ Task ID matches: {retrieved_task.id == test_task.id}")
            else:
                print("❌ Could not retrieve task from database")

            # Count total tasks for this user
            task_count_statement = select(Task).where(Task.user_id == test_user.id)
            task_results = await session.execute(task_count_statement)
            user_tasks = task_results.scalars().all()
            print(f"✅ User '{test_user.id}' has {len(user_tasks)} tasks in database")

        # Close the engine
        await engine.dispose()
        print("\n🎉 Database insertion test PASSED!")
        return True

    except Exception as e:
        print(f"❌ Database insertion test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing database insertion functionality...")
    success = asyncio.run(test_insertion())
    if not success:
        print("\n💥 Database insertion test FAILED!")
        exit(1)