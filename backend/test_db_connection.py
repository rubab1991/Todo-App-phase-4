"""
Test script to validate the Neon PostgreSQL database connection
"""

import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("NEON_DB_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

print(f"Connecting to database: {DATABASE_URL}")

async def test_connection():
    """Test the database connection"""
    try:
        # Create async engine
        engine = create_async_engine(
            DATABASE_URL,
            echo=True,
            connect_args={"server_settings": {"application_name": "Todo-API-App"}}
        )

        # Test connection with a simple query
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT NOW()"))
            current_time = await result.scalar()
            print(f"✅ Connection successful! Current time from DB: {current_time}")

        # Close the engine
        await engine.dispose()
        print("✅ Engine disposed successfully")

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True

if __name__ == "__main__":
    print("Testing Neon PostgreSQL connection...")
    success = asyncio.run(test_connection())
    if success:
        print("\n🎉 Database connection test PASSED!")
    else:
        print("\n💥 Database connection test FAILED!")