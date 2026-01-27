"""
Todo AI Chat Agent

This module implements an AI assistant for managing todo application functionality
through natural language interactions using MCP tools.
"""

import json
import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


class TaskStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    ALL = "all"


@dataclass
class Task:
    """Task data model matching the frontend/backend structure"""
    id: str
    title: str
    description: Optional[str] = None
    isComplete: bool = False
    userId: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    dueDate: Optional[str] = None
    priority: str = "medium"


class TodoChatAgent:
    """
    AI assistant for todo application management.

    Interprets user messages in natural language and performs task operations
    using MCP tools with proper authentication.
    """

    def __init__(self):
        self.tools = {
            "add_task": self.add_task,
            "list_tasks": self.list_tasks,
            "complete_task": self.complete_task,
            "delete_task": self.delete_task,
            "update_task": self.update_task
        }

    def add_task(self, user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new task.

        Args:
            user_id: ID of the authenticated user
            title: Task title
            description: Optional task description

        Returns:
            Dictionary containing task information
        """
        # Simulate API call to create task
        # In a real implementation, this would call the backend API
        print(f"[MCP TOOL CALL] Adding task for user {user_id}: {title}")

        # Generate a mock task ID (in real implementation, this comes from API)
        import uuid
        task_id = str(uuid.uuid4())

        task = Task(
            id=task_id,
            title=title,
            description=description,
            userId=user_id,
            isComplete=False,
            createdAt="2026-01-28T10:00:00",
            updatedAt="2026-01-28T10:00:00"
        )

        return {
            "task_id": task_id,
            "status": "created",
            "title": title,
            "task": task.__dict__
        }

    def list_tasks(self, user_id: str, status: str = "all") -> List[Dict[str, Any]]:
        """
        List tasks with optional filter.

        Args:
            user_id: ID of the authenticated user
            status: Filter by status ('all', 'pending', 'completed')

        Returns:
            List of task dictionaries
        """
        # Simulate API call to list tasks
        # In a real implementation, this would call the backend API
        print(f"[MCP TOOL CALL] Listing tasks for user {user_id}, status: {status}")

        # Mock tasks data (in real implementation, this comes from API)
        mock_tasks = [
            {
                "id": "1",
                "title": "Buy groceries",
                "description": "Milk, bread, eggs",
                "isComplete": False,
                "userId": user_id,
                "createdAt": "2026-01-27T09:00:00",
                "updatedAt": "2026-01-27T09:00:00",
                "dueDate": "2026-01-30",
                "priority": "medium"
            },
            {
                "id": "2",
                "title": "Finish project",
                "description": "Complete the final report",
                "isComplete": True,
                "userId": user_id,
                "createdAt": "2026-01-26T14:00:00",
                "updatedAt": "2026-01-28T08:00:00",
                "dueDate": "2026-01-25",
                "priority": "high"
            },
            {
                "id": "3",
                "title": "Call dentist",
                "description": "Schedule appointment",
                "isComplete": False,
                "userId": user_id,
                "createdAt": "2026-01-28T10:00:00",
                "updatedAt": "2026-01-28T10:00:00",
                "dueDate": "2026-02-01",
                "priority": "low"
            }
        ]

        # Filter based on status
        if status.lower() == "pending":
            filtered_tasks = [task for task in mock_tasks if not task["isComplete"]]
        elif status.lower() == "completed":
            filtered_tasks = [task for task in mock_tasks if task["isComplete"]]
        else:  # all
            filtered_tasks = mock_tasks

        return filtered_tasks

    def complete_task(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """
        Mark a task as complete.

        Args:
            user_id: ID of the authenticated user
            task_id: ID of the task to complete

        Returns:
            Dictionary containing task information
        """
        # Simulate API call to complete task
        # In a real implementation, this would call the backend API
        print(f"[MCP TOOL CALL] Completing task {task_id} for user {user_id}")

        return {
            "task_id": task_id,
            "status": "completed",
            "title": f"Mock task {task_id}"
        }

    def delete_task(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """
        Delete a task.

        Args:
            user_id: ID of the authenticated user
            task_id: ID of the task to delete

        Returns:
            Dictionary containing task information
        """
        # Simulate API call to delete task
        # In a real implementation, this would call the backend API
        print(f"[MCP TOOL CALL] Deleting task {task_id} for user {user_id}")

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": f"Mock task {task_id}"
        }

    def update_task(self, user_id: str, task_id: str, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Update task title or description.

        Args:
            user_id: ID of the authenticated user
            task_id: ID of the task to update
            title: New title (optional)
            description: New description (optional)

        Returns:
            Dictionary containing task information
        """
        # Simulate API call to update task
        # In a real implementation, this would call the backend API
        print(f"[MCP TOOL CALL] Updating task {task_id} for user {user_id}")
        if title:
            print(f"  New title: {title}")
        if description:
            print(f"  New description: {description}")

        return {
            "task_id": task_id,
            "status": "updated",
            "title": title or f"Mock task {task_id}"
        }

    def parse_intent(self, message: str) -> Dict[str, Any]:
        """
        Parse user intent from natural language message.

        Args:
            message: User's natural language message

        Returns:
            Dictionary containing the parsed intent and parameters
        """
        message_lower = message.lower().strip()

        # Add task intent
        add_patterns = [
            r"(add|create|make|new)\s+(a\s+)?task\s+(to|for)\s+(.+)",
            r"(add|create|make|new)\s+(a\s+)?(.+)\s+(as\s+a\s+task|to\s+do|task)",
            r"(need\s+to|want\s+to|i\s+should|remember\s+to)\s+(.+)",
            r"(add|create|make|new)\s+(a\s+)?task[:\s]+(.+)"
        ]

        for pattern in add_patterns:
            match = re.search(pattern, message_lower)
            if match:
                groups = match.groups()
                # Extract the task description from the appropriate group
                if len(groups) >= 3 and groups[-1]:  # Last group contains the task
                    task_desc = groups[-1].strip()
                    # Clean up common phrases
                    task_desc = re.sub(r'^(to|for|as a task|task)', '', task_desc).strip()
                    return {
                        "intent": "add_task",
                        "params": {"title": task_desc.title()}
                    }

        # List tasks intent
        if any(word in message_lower for word in ["show", "list", "display", "view", "all my", "my tasks", "what"]):
            if "pending" in message_lower or "incomplete" in message_lower or "not done" in message_lower:
                return {
                    "intent": "list_tasks",
                    "params": {"status": "pending"}
                }
            elif "completed" in message_lower or "done" in message_lower or "finished" in message_lower:
                return {
                    "intent": "list_tasks",
                    "params": {"status": "completed"}
                }
            else:
                return {
                    "intent": "list_tasks",
                    "params": {"status": "all"}
                }

        # Complete task intent
        complete_patterns = [
            r"(mark|complete|finish|done|check off)\s+task\s+(\d+|\w+)",
            r"(mark|complete|finish|done|check off)\s+(task\s+)?(#|\d+|\w+)",
            r"(complete|finish|done)\s+(task\s+)?(#?\w+)"
        ]

        for pattern in complete_patterns:
            match = re.search(pattern, message_lower)
            if match:
                task_ref = match.group(2) if len(match.groups()) > 1 else match.group(1)
                # Clean up task reference
                task_ref = re.sub(r'[^\w]', '', task_ref)
                return {
                    "intent": "complete_task",
                    "params": {"task_id": task_ref}
                }

        # Delete task intent
        delete_patterns = [
            r"(delete|remove|erase|cancel)\s+task\s+(\d+|\w+)",
            r"(delete|remove|erase|cancel)\s+(the\s+)?(.+?)\s+task",
            r"(delete|remove|erase|cancel)\s+(task\s+)?(#|\d+|\w+)"
        ]

        for pattern in delete_patterns:
            match = re.search(pattern, message_lower)
            if match:
                task_ref = match.group(2) if len(match.groups()) > 1 else match.group(1)
                # Clean up task reference
                task_ref = re.sub(r'[^\w]', '', task_ref)
                return {
                    "intent": "delete_task",
                    "params": {"task_id": task_ref}
                }

        # Update task intent
        update_patterns = [
            r"(change|update|modify|edit)\s+task\s+(\d+|\w+)\s+(to|with)\s+(.+)",
            r"(change|update|modify|edit)\s+(task\s+)?(#|\d+|\w+)\s+(to|with)\s+(.+)"
        ]

        for pattern in update_patterns:
            match = re.search(pattern, message_lower)
            if match:
                task_ref = match.group(2) if len(match.groups()) > 2 else match.group(1)
                new_content = match.group(4) if len(match.groups()) > 3 else match.group(3)
                # Clean up
                task_ref = re.sub(r'[^\w]', '', task_ref)

                # Determine if it's title or description update
                return {
                    "intent": "update_task",
                    "params": {"task_id": task_ref, "title": new_content.title()}
                }

        # If no specific intent is detected, default to add_task
        return {
            "intent": "add_task",
            "params": {"title": message.strip().title()}
        }

    def execute_tool(self, tool_name: str, params: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Execute the specified tool with given parameters.

        Args:
            tool_name: Name of the tool to execute
            params: Parameters for the tool
            user_id: ID of the authenticated user

        Returns:
            Result of the tool execution
        """
        if tool_name not in self.tools:
            raise ValueError(f"Unknown tool: {tool_name}")

        # Add user_id to params for tools that need it
        tool_params = {**params, "user_id": user_id}

        # Execute the tool
        result = self.tools[tool_name](**tool_params)
        return result

    def process_message(self, message: str, user_id: str) -> str:
        """
        Process a user message and return a response.

        Args:
            message: User's natural language message
            user_id: ID of the authenticated user

        Returns:
            Friendly response to the user
        """
        try:
            # Parse the intent from the message
            intent_result = self.parse_intent(message)
            intent = intent_result["intent"]
            params = intent_result["params"]

            # Execute the appropriate tool
            result = self.execute_tool(intent, params, user_id)

            # Generate a friendly response based on the result
            if intent == "add_task":
                return f"✅ Added task: '{result['title']}' to your list!"
            elif intent == "list_tasks":
                if not result:
                    status_text = params.get("status", "all")
                    return f"You don't have any {status_text} tasks right now."

                response = f"📋 Here are your {params.get('status', 'all')} tasks:\n"
                for task in result:
                    status = "✅" if task.get("isComplete") else "⏳"
                    response += f"  {status} {task['id']}. {task['title']}\n"
                return response.strip()
            elif intent == "complete_task":
                return f"🎉 Marked task as complete: '{result['title']}'"
            elif intent == "delete_task":
                return f"🗑️ Deleted task: '{result['title']}'"
            elif intent == "update_task":
                return f"✏️ Updated task: '{result['title']}'"
            else:
                return "I processed your request successfully!"

        except Exception as e:
            # Handle errors gracefully
            print(f"Error processing message: {str(e)}")
            return f"Sorry, I encountered an error processing your request: {str(e)}"

    def get_available_tools(self) -> List[str]:
        """
        Get a list of available tools.

        Returns:
            List of tool names
        """
        return list(self.tools.keys())


# Example usage
if __name__ == "__main__":
    agent = TodoChatAgent()

    # Example interactions
    user_id = "user_123"

    examples = [
        "Add a task to buy groceries",
        "Show me all my tasks",
        "What's pending?",
        "Mark task 1 as complete",
        "Delete the meeting task",
        "Change task 2 to 'Call mom tonight'"
    ]

    print("Todo AI Chat Agent Examples:")
    print("=" * 40)

    for example in examples:
        print(f"\nInput: {example}")
        response = agent.process_message(example, user_id)
        print(f"Response: {response}")
        print("-" * 30)