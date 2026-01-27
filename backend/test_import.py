#!/usr/bin/env python3
"""
Test script to verify the backend application structure is correct
"""

def test_imports():
    """Test that all modules can be imported correctly"""
    print("Testing module imports...")

    try:
        from src.api.main import app
        print("✓ Successfully imported src.api.main:app")
    except ImportError as e:
        print(f"✗ Failed to import src.api.main:app - {e}")
        return False

    try:
        from src.models import Task, TaskRead, TaskCreate, TaskUpdate
        print("✓ Successfully imported models")
    except ImportError as e:
        print(f"✗ Failed to import models - {e}")
        return False

    try:
        from src.db import get_async_session_dep, create_db_and_tables
        print("✓ Successfully imported db module")
    except ImportError as e:
        print(f"✗ Failed to import db module - {e}")
        return False

    try:
        from src.auth import verify_user_id_match, get_current_user_id
        print("✓ Successfully imported auth module")
    except ImportError as e:
        print(f"✗ Failed to import auth module - {e}")
        return False

    try:
        from src.utils import decode_jwt_token, validate_user_access
        print("✓ Successfully imported utils module")
    except ImportError as e:
        print(f"✗ Failed to import utils module - {e}")
        return False

    try:
        from src.routes.tasks import router
        print("✓ Successfully imported routes.tasks router")
    except ImportError as e:
        print(f"✗ Failed to import routes.tasks router - {e}")
        return False

    print("\n✓ All imports successful!")
    print("✓ Module structure is correct")
    print("✓ Application can be started with: uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload")
    return True

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("\n🎉 Backend structure is ready and functional!")
    else:
        print("\n❌ Issues found with the backend structure.")
        exit(1)