"""
MCP Tool Implementation for Todo AI Chat Agent

This module provides the actual implementations for the tools defined in the manifest.
"""

import sys
import json
from typing import Dict, Any, List
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '.claude', 'agents'))
from todo_ai_chat_agent import TodoChatAgent


def add_task(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new task.

    Args:
        params: Dictionary containing user_id, title, and optional description

    Returns:
        Dictionary containing task information
    """
    user_id = params.get('user_id')
    title = params.get('title')
    description = params.get('description')

    if not user_id or not title:
        raise ValueError("user_id and title are required")

    # In a real implementation, this would call the actual backend API
    # For now, we'll simulate the API call
    agent = TodoChatAgent()
    return agent.add_task(user_id, title, description)


def list_tasks(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    List tasks with optional filter.

    Args:
        params: Dictionary containing user_id and optional status filter

    Returns:
        List of task dictionaries
    """
    user_id = params.get('user_id')
    status = params.get('status', 'all')

    if not user_id:
        raise ValueError("user_id is required")

    # In a real implementation, this would call the actual backend API
    # For now, we'll simulate the API call
    agent = TodoChatAgent()
    return agent.list_tasks(user_id, status)


def complete_task(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mark a task as complete.

    Args:
        params: Dictionary containing user_id and task_id

    Returns:
        Dictionary containing task information
    """
    user_id = params.get('user_id')
    task_id = params.get('task_id')

    if not user_id or not task_id:
        raise ValueError("user_id and task_id are required")

    # In a real implementation, this would call the actual backend API
    # For now, we'll simulate the API call
    agent = TodoChatAgent()
    return agent.complete_task(user_id, task_id)


def delete_task(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Delete a task.

    Args:
        params: Dictionary containing user_id and task_id

    Returns:
        Dictionary containing task information
    """
    user_id = params.get('user_id')
    task_id = params.get('task_id')

    if not user_id or not task_id:
        raise ValueError("user_id and task_id are required")

    # In a real implementation, this would call the actual backend API
    # For now, we'll simulate the API call
    agent = TodoChatAgent()
    return agent.delete_task(user_id, task_id)


def update_task(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update task title or description.

    Args:
        params: Dictionary containing user_id, task_id, and optional title/description

    Returns:
        Dictionary containing task information
    """
    user_id = params.get('user_id')
    task_id = params.get('task_id')
    title = params.get('title')
    description = params.get('description')

    if not user_id or not task_id:
        raise ValueError("user_id and task_id are required")

    # In a real implementation, this would call the actual backend API
    # For now, we'll simulate the API call
    agent = TodoChatAgent()
    return agent.update_task(user_id, task_id, title, description)


# MCP protocol handler
def handle_request():
    """
    Handle incoming MCP requests.
    """
    # Read the entire input
    input_text = sys.stdin.read()

    try:
        # Parse the input as JSON
        request = json.loads(input_text)

        # Extract tool name and parameters
        tool_name = request.get('toolName')
        params = request.get('arguments', {})

        # Dispatch to the appropriate function
        if tool_name == 'add_task':
            result = add_task(params)
        elif tool_name == 'list_tasks':
            result = list_tasks(params)
        elif tool_name == 'complete_task':
            result = complete_task(params)
        elif tool_name == 'delete_task':
            result = delete_task(params)
        elif tool_name == 'update_task':
            result = update_task(params)
        else:
            raise ValueError(f"Unknown tool: {tool_name}")

        # Prepare the response
        response = {
            "result": result
        }

        # Output the response as JSON
        print(json.dumps(response))

    except Exception as e:
        # Handle errors
        error_response = {
            "error": {
                "type": "invalid_request_error",
                "message": str(e)
            }
        }
        print(json.dumps(error_response))


if __name__ == "__main__":
    handle_request()