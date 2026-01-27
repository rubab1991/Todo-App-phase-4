"""
Simple verification that the backend database insertion is working
"""

import asyncio
from src.db import async_engine, create_db_and_tables
from sqlmodel import select
from src.models import Task, User
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

async def simple_verification():
    """Simple verification that the backend database is working correctly"""
    print("🔍 Performing simple verification of backend database functionality...")

    try:
        # Create tables if they don't exist
        await create_db_and_tables()
        print("✅ Database tables verified/created successfully")

        # Test inserting a record using the same approach as the backend
        async with AsyncSession(async_engine) as session:
            # Create a test user
            test_user = User(
                id="simple_test_user_123",
                email="simple_test@example.com"
            )

            session.add(test_user)
            await session.commit()
            print(f"✅ Test user created with ID: {test_user.id}")

            # Create a test task
            test_task = Task(
                title="Simple Verification Task",
                description="This task verifies that database insertion is working",
                completed=False,
                user_id=test_user.id
            )

            session.add(test_task)
            await session.commit()
            print(f"✅ Test task created with title: {test_task.title}")

            # Verify the task was actually saved by querying it back
            statement = select(Task).where(Task.user_id == test_user.id).where(Task.title == test_task.title)
            result = await session.execute(statement)
            retrieved_task = result.first()

            if retrieved_task:
                print(f"✅ Task successfully retrieved from database")
                print(f"✅ Task title: {retrieved_task.title}")
                print(f"✅ Task user_id: {retrieved_task.user_id}")
                print(f"✅ Task completed: {retrieved_task.completed}")

                # Check if the task has an ID assigned by the database
                if hasattr(retrieved_task, 'id') and retrieved_task.id is not None:
                    print(f"✅ Task has valid ID assigned by database: {retrieved_task.id}")
                else:
                    print("⚠️  Task ID not accessible via standard property")
            else:
                print("❌ Could not retrieve task from database")
                return False

        print("\n🎉 SIMPLE VERIFICATION PASSED!")
        print("✅ Database connection is working")
        print("✅ Data insertion is working")
        print("✅ Data retrieval is working")
        print("✅ Backend database functionality verified")
        return True

    except Exception as e:
        print(f"❌ Simple verification FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Running simple verification of backend database functionality...")
    success = asyncio.run(simple_verification())

    if success:
        print("\n🎊 BACKEND DATABASE INSERTION IS WORKING!")
        print("The database insertion issue has been successfully resolved.")
    else:
        print("\n💥 VERIFICATION FAILED!")
        exit(1)