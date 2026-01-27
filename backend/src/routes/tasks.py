import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Path
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from ..models import Task, TaskRead, TaskCreate, TaskUpdate
from ..db import get_async_session_dep, get_or_create_user
from ..auth import verify_user_id_match_with_email

logger = logging.getLogger(__name__)

# Define frontend-compatible models for request handling
class FrontendTaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    isComplete: Optional[bool] = False
    dueDate: Optional[str] = None
    priority: str = "medium"

class FrontendTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    isComplete: Optional[bool] = None
    dueDate: Optional[str] = None
    priority: Optional[str] = None

# Router without prefix since it's added in main.py
router = APIRouter()

@router.get("/{user_id}/tasks", tags=["tasks"])
async def get_tasks(
    user_id: str,
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Get all tasks for the authenticated user.

    Expected Response Format:
    [
      {
        "id": "1",
        "title": "Sample Task",
        "description": "Sample Description",
        "isComplete": false,
        "userId": "user_abc123",
        "createdAt": "2023-01-01T00:00:00",
        "updatedAt": "2023-01-01T00:00:00"
      }
    ]
    """
    authenticated_user_id, _ = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    statement = select(Task).where(Task.user_id == user_id)
    result = await session.execute(statement)
    tasks = result.scalars().all()

    # Transform the response to match frontend expectations
    transformed_tasks = []
    for task in tasks:
        transformed_tasks.append({
            "id": str(task.id),  # Convert to string to match frontend type
            "title": task.title,
            "description": task.description,
            "isComplete": task.completed,  # Use camelCase field name
            "userId": task.user_id,  # Use camelCase field name
            "dueDate": task.due_date,  # Use camelCase field name
            "priority": task.priority,  # Use camelCase field name
            "createdAt": task.created_at.isoformat(),  # Convert to string
            "updatedAt": task.updated_at.isoformat()   # Convert to string
        })

    return transformed_tasks


@router.post("/{user_id}/tasks", status_code=201, tags=["tasks"])
async def create_task(
    user_id: str,
    task_data: FrontendTaskCreate,
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Create a new task for the authenticated user.

    Expected Request Body:
    {
      "title": "New Task",
      "description": "Task description",
      "isComplete": false
    }

    Expected Response Format:
    {
      "id": "1",
      "title": "New Task",
      "description": "Task description",
      "isComplete": false,
      "userId": "user_abc123",
      "createdAt": "2023-01-01T00:00:00",
      "updatedAt": "2023-01-01T00:00:00"
    }
    """
    authenticated_user_id, email = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    try:
        # Ensure user exists with email information
        user = await get_or_create_user(session, user_id, email=email)

        # Map frontend field names to backend field names
        task_completed = getattr(task_data, 'isComplete', False)
        task_due_date = getattr(task_data, 'dueDate', None)
        task_priority = getattr(task_data, 'priority', 'medium')

        # Create task with the authenticated user's ID
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_completed,
            due_date=task_due_date,
            priority=task_priority,
            user_id=user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)

        # Transform the response to match frontend expectations
        return {
            "id": str(task.id),  # Convert to string to match frontend type
            "title": task.title,
            "description": task.description,
            "isComplete": task.completed,  # Use camelCase field name
            "userId": task.user_id,  # Use camelCase field name
            "dueDate": task.due_date,  # Use camelCase field name
            "priority": task.priority,  # Use camelCase field name
            "createdAt": task.created_at.isoformat(),  # Convert to string
            "updatedAt": task.updated_at.isoformat()   # Convert to string
        }
    except IntegrityError as e:
        logger.error(f"Integrity error during task creation: {e}")
        raise HTTPException(status_code=422, detail="Invalid task data")
    except Exception as e:
        logger.error(f"Unexpected error during task creation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{user_id}/tasks/{task_id}", tags=["tasks"])
async def get_task(
    user_id: str,
    task_id: int = Path(..., gt=0),
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Get a specific task if it belongs to the authenticated user.

    Expected Response Format:
    {
      "id": "1",
      "title": "Sample Task",
      "description": "Sample Description",
      "isComplete": false,
      "userId": "user_abc123",
      "createdAt": "2023-01-01T00:00:00",
      "updatedAt": "2023-01-01T00:00:00"
    }
    """
    authenticated_user_id, _ = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Transform the response to match frontend expectations
    return {
        "id": str(task.id),  # Convert to string to match frontend type
        "title": task.title,
        "description": task.description,
        "isComplete": task.completed,  # Use camelCase field name
        "userId": task.user_id,  # Use camelCase field name
        "createdAt": task.created_at.isoformat(),  # Convert to string
        "updatedAt": task.updated_at.isoformat()   # Convert to string
    }


@router.put("/{user_id}/tasks/{task_id}", tags=["tasks"])
async def update_task(
    user_id: str,
    task_id: int = Path(..., gt=0),
    task_update: FrontendTaskUpdate = None,
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Update a task if it belongs to the authenticated user.

    Expected Request Body:
    {
      "title": "Updated Task",
      "description": "Updated description",
      "isComplete": true
    }

    Expected Response Format:
    {
      "id": "1",
      "title": "Updated Task",
      "description": "Updated description",
      "isComplete": true,
      "userId": "user_abc123",
      "createdAt": "2023-01-01T00:00:00",
      "updatedAt": "2023-01-02T00:00:00"
    }
    """
    authenticated_user_id, _ = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        # Update task fields using the frontend-compatible model
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if field == 'isComplete':
                # Map frontend field name to backend field name
                setattr(task, 'completed', value)
            elif field == 'userId':
                # Map frontend field name to backend field name
                setattr(task, 'user_id', value)
            elif field == 'dueDate':
                # Map frontend field name to backend field name
                setattr(task, 'due_date', value)
            elif field == 'priority':
                # Map frontend field name to backend field name
                setattr(task, 'priority', value)
            else:
                # Direct mapping for other fields (title, description)
                if hasattr(task, field):
                    setattr(task, field, value)

        # Update the updated_at timestamp
        task.updated_at = datetime.utcnow()

        await session.commit()
        await session.refresh(task)

        # Transform the response to match frontend expectations
        return {
            "id": str(task.id),  # Convert to string to match frontend type
            "title": task.title,
            "description": task.description,
            "isComplete": task.completed,  # Use camelCase field name
            "userId": task.user_id,  # Use camelCase field name
            "dueDate": task.due_date,  # Use camelCase field name
            "priority": task.priority,  # Use camelCase field name
            "createdAt": task.created_at.isoformat(),  # Convert to string
            "updatedAt": task.updated_at.isoformat()   # Convert to string
        }
    except IntegrityError as e:
        logger.error(f"Integrity error during task update: {e}")
        raise HTTPException(status_code=422, detail="Invalid task data")
    except Exception as e:
        logger.error(f"Unexpected error during task update: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{user_id}/tasks/{task_id}", status_code=204, tags=["tasks"])
async def delete_task(
    user_id: str,
    task_id: int = Path(..., gt=0),
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Delete a task if it belongs to the authenticated user.

    Expected Response: 204 No Content
    """
    authenticated_user_id, _ = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        await session.delete(task)
        await session.commit()
        return
    except Exception as e:
        logger.error(f"Unexpected error during task deletion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/{user_id}/tasks/{task_id}/complete", tags=["tasks"])
async def toggle_task_completion(
    user_id: str,
    task_id: int = Path(..., gt=0),
    user_data: tuple = Depends(verify_user_id_match_with_email),
    session=Depends(get_async_session_dep)
):
    """
    Toggle the completion status of a task if it belongs to the authenticated user.

    Expected Response Format:
    {
      "id": "1",
      "title": "Sample Task",
      "description": "Sample Description",
      "isComplete": true,  # toggled
      "userId": "user_abc123",
      "createdAt": "2023-01-01T00:00:00",
      "updatedAt": "2023-01-02T00:00:00"
    }
    """
    authenticated_user_id, _ = user_data

    # Verify that the user_id in the path matches the authenticated user
    if authenticated_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        # Toggle the completion status
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()

        await session.commit()
        await session.refresh(task)

        # Transform the response to match frontend expectations
        return {
            "id": str(task.id),  # Convert to string to match frontend type
            "title": task.title,
            "description": task.description,
            "isComplete": task.completed,  # Use camelCase field name
            "userId": task.user_id,  # Use camelCase field name
            "dueDate": task.due_date,  # Use camelCase field name
            "priority": task.priority,  # Use camelCase field name
            "createdAt": task.created_at.isoformat(),  # Convert to string
            "updatedAt": task.updated_at.isoformat()   # Convert to string
        }
    except Exception as e:
        logger.error(f"Unexpected error during task completion toggle: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")