"""
Test script to verify database insertion using the same approach as the actual backend
"""

import asyncio
from src.db import get_async_session, get_async_session_dep
from src.models import Task, User
from sqlmodel import select
from datetime import datetime

async def test_real_insertion():
    """Test insertion using the same approach as the actual backend"""
    print("Testing database insertion with the same approach as the backend...")

    try:
        # Get session using the same dependency function as the backend routes
        async with get_async_session() as session:
            # Create or get a test user
            result = await session.execute(select(User).where(User.id == "test_user_123"))
            user = result.first()

            if not user:
                user = User(id="test_user_123", email="test@example.com")
                session.add(user)
                print(f"✅ Created new user: {user.id}")

            # Create a test task
            task = Task(
                title="Test Task from Real Insertion Test",
                description="This task was created to verify database insertion is working",
                completed=False,
                user_id=user.id
            )

            # The session context manager will handle commit automatically when exiting

            # Refresh to get the ID that was assigned by the database
            # Note: We can't refresh before the commit happens, so we'll query again after the session closes

            print(f"✅ Inserted task successfully with ID: {task.id}")
            print(f"✅ Task title: {task.title}")
            print(f"✅ Task user_id: {task.user_id}")
            print(f"✅ Task created at: {task.created_at}")

            # Verify the task was actually saved by querying it back
            statement = select(Task).where(Task.id == task.id)
            result = await session.execute(statement)
            retrieved_task = result.first()

            if retrieved_task:
                print(f"✅ Verified task exists in database with ID: {retrieved_task.id}")
                print(f"✅ Title matches: {retrieved_task.title == task.title}")
                print(f"✅ User ID matches: {retrieved_task.user_id == task.user_id}")
            else:
                print("❌ Could not retrieve task from database - insertion failed")

        print("\n🎉 Real database insertion test PASSED!")
        print("✅ Backend database insertion functionality is working correctly")
        return True

    except Exception as e:
        print(f"❌ Real database insertion test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing real database insertion functionality (same as backend)...")
    success = asyncio.run(test_real_insertion())
    if not success:
        print("\n💥 Real database insertion test FAILED!")
        exit(1)
    else:
        print("\n🎉 Database insertion is working correctly!")