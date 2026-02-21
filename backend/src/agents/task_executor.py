from typing import Dict, Any, List
from ..mcp.mcp_tools import add_task, list_tasks, update_task, complete_task, delete_task
from .error_handler import handle_error


async def execute_task(intent_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Execute the appropriate task based on the intent
    """
    intent = intent_result.get("intent", "")
    params = intent_result.get("parameters", {})

    # Add user_id to params
    params['user_id'] = user_id

    try:
        if intent == "add_task":
            result = await add_task(
                user_id=user_id,
                title=params.get("title", "Untitled task"),
                description=params.get("description")
            )
            operation = {
                "operation": "create",
                "task_id": result.get("task_id"),
                "status": "success",
                "title": params.get("title", "")
            }
        elif intent == "list_tasks":
            result = await list_tasks(user_id=user_id, status=params.get("status", "all"))
            tasks_data = result.get("tasks", [])
            operation = {
                "operation": "list",
                "status": "success",
                "count": len(tasks_data),
                "tasks": tasks_data,
                "filter": params.get("status", "all")
            }
        elif intent == "update_task":
            result = await update_task(
                user_id=user_id,
                task_id=params.get("task_id"),
                title=params.get("title"),
                description=params.get("description")
            )
            operation = {
                "operation": "update",
                "task_id": params.get("task_id"),
                "status": "success",
                "title": params.get("title", "")
            }
        elif intent == "complete_task":
            result = await complete_task(user_id=user_id, task_id=params.get("task_id"))
            operation = {
                "operation": "complete",
                "task_id": params.get("task_id"),
                "status": "success"
            }
        elif intent == "delete_task":
            result = await delete_task(user_id=user_id, task_id=params.get("task_id"))
            operation = {
                "operation": "delete",
                "task_id": params.get("task_id"),
                "status": "success"
            }
        elif intent in ("greeting", "help_request", "identity"):
            # Non-task intents - no MCP call needed
            result = {"message": f"Intent '{intent}' processed", "status": "success"}
            operation = {
                "operation": "other",
                "status": "success",
                "intent": intent
            }
        else:
            # Unknown intents
            result = {"message": f"Intent '{intent}' processed", "status": "success"}
            operation = {
                "operation": "other",
                "status": "success",
                "intent": intent
            }

        return {
            "result": result,
            "operations": [operation] if operation else [],
            "status": "success"
        }

    except Exception as e:
        error_result = handle_error(e)
        return {
            "result": {"error": error_result},
            "operations": [],
            "status": "error",
            "error": str(e)
        }