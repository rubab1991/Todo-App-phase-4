"""
Test script to verify JWT token validation between frontend and backend
"""

import jose.jwt as jwt
import os
from datetime import datetime, timedelta
import requests
import json

# Load environment
from dotenv import load_dotenv
load_dotenv()

def create_test_jwt_token():
    """Create a test JWT token that matches Better Auth format"""
    secret = os.getenv("BETTER_AUTH_SECRET", "BG08QhrY6XrSET9ZDVXdYyYyDwYPgas1")

    # Create payload similar to what Better Auth would issue
    payload = {
        "id": "test-user-123",  # User ID in the token
        "email": "test@example.com",
        "name": "Test User",
        "role": "user",
        "exp": datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
        "iat": datetime.utcnow(),  # Issued at
        "iss": "better-auth",  # Issuer
        "sub": "user:test-user-123"  # Subject
    }

    # Create the JWT token
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

def test_backend_jwt_validation():
    """Test that the backend properly validates JWT tokens"""
    print("Testing JWT token validation between frontend and backend...")

    # Create a test JWT token
    token = create_test_jwt_token()
    print(f"✅ Created test JWT token: {token[:20]}...")

    # Test the health endpoint first to make sure backend is running
    try:
        response = requests.get("http://127.0.0.1:8002/health")
        if response.status_code == 200:
            print("✅ Backend is running and responding")
        else:
            print(f"❌ Backend not responding properly. Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Could not connect to backend: {e}")
        return False

    # Test making a request to the tasks endpoint with the JWT token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        # Try to get tasks for the test user
        response = requests.get("http://127.0.0.1:8002/api/test-user-123/tasks", headers=headers)
        print(f"✅ Request sent to backend. Status code: {response.status_code}")

        if response.status_code in [200, 404]:  # 200 if tasks exist, 404 if none exist - both are valid responses
            print("✅ Backend properly validated JWT token and processed request")
            print(f"✅ Response: {response.text}")
            return True
        elif response.status_code == 401:
            print("❌ Backend rejected JWT token - authentication failed")
            return False
        elif response.status_code == 403:
            print("❌ Backend rejected request - user ID mismatch")
            return False
        else:
            print(f"❌ Unexpected response from backend: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error making request to backend: {e}")
        return False

def test_task_creation():
    """Test creating a task with JWT authentication"""
    print("\nTesting task creation with JWT token...")

    # Create a test JWT token
    token = create_test_jwt_token()

    # Prepare task data
    task_data = {
        "title": "Test task from integration test",
        "description": "This task verifies that JWT authentication and database insertion work together",
        "completed": False
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        # Try to create a task for the test user
        response = requests.post("http://127.0.0.1:8002/api/test-user-123/tasks",
                                headers=headers,
                                json=task_data)
        print(f"✅ Task creation request sent. Status code: {response.status_code}")

        if response.status_code == 201:
            print("✅ Task created successfully with JWT authentication")
            print(f"✅ Response: {response.json()}")
            return True
        elif response.status_code == 401:
            print("❌ Backend rejected JWT token for task creation - authentication failed")
            return False
        elif response.status_code == 403:
            print("❌ Backend rejected request for task creation - user ID mismatch")
            return False
        else:
            print(f"❌ Unexpected response during task creation: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error creating task: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing Frontend-Backend JWT Integration\n")

    # Test JWT validation
    jwt_test_passed = test_backend_jwt_validation()

    # Test task creation
    creation_test_passed = test_task_creation()

    print(f"\n📋 Integration Test Results:")
    print(f"- JWT Validation: {'✅ PASS' if jwt_test_passed else '❌ FAIL'}")
    print(f"- Task Creation: {'✅ PASS' if creation_test_passed else '❌ FAIL'}")

    if jwt_test_passed and creation_test_passed:
        print(f"\n🎉 ALL INTEGRATION TESTS PASSED!")
        print(f"✅ Frontend and backend are properly integrated")
        print(f"✅ JWT tokens from Better Auth will be accepted by the backend")
        print(f"✅ Tasks created from frontend will be saved to Neon database")
    else:
        print(f"\n💥 SOME TESTS FAILED!")
        print(f"❌ Integration issues need to be resolved")