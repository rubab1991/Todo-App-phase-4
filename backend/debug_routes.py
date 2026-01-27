"""
Debug script to check how path parameters are handled in the routes
"""

from fastapi import FastAPI, Request, Depends
from fastapi.routing import APIRoute

# Create a temporary app to inspect the routes
app = FastAPI()

# Include the tasks router like in main.py
from src.routes import tasks
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

print("Registered routes:")
for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"  {route.methods} {route.path}")
        print(f"    Name: {route.name}")
        if hasattr(route, 'dependant') and route.dependant:
            print(f"    Dependencies: {[dep.call for dep in route.dependant.dependencies]}")
        print()

# Let's also check the specific path format
print("\nChecking path structure:")
print("When we define routes like '/tasks' in the tasks router...")
print("With prefix '/api/{user_id}', the final path becomes: '/api/{user_id}/tasks'")
print("So path_params should contain 'user_id' parameter when matched")