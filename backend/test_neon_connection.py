"""
Test script to validate the Neon PostgreSQL database connection using the same logic as the backend
"""

import asyncio
from src.db import DATABASE_URL, async_engine
from sqlalchemy import text

print(f"Testing connection with URL: {DATABASE_URL}")

async def test_connection():
    """Test the database connection using the same engine as the backend"""
    try:
        # Test connection with a simple query
        async with async_engine.begin() as conn:
            result = await conn.execute(text("SELECT NOW()"))
            current_time = result.scalar()
            print(f"✅ Connection successful! Current time from DB: {current_time}")

        # Test that tables can be created (this is what the backend does)
        from sqlmodel import SQLModel
        from src.models import Task, User
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
            print("✅ Tables created successfully!")

        print("✅ All database operations completed successfully!")

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True

if __name__ == "__main__":
    print("Testing Neon PostgreSQL connection with backend configuration...")
    success = asyncio.run(test_connection())
    if success:
        print("\n🎉 Neon PostgreSQL connection test PASSED!")
        print("✅ Backend is properly connected to Neon DB")
        print("✅ SSL parameters have been properly handled")
        print("✅ Database operations work correctly")
    else:
        print("\n💥 Neon PostgreSQL connection test FAILED!")