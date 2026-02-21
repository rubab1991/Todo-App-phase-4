from typing import Dict, Any, List, Optional
from .error_handler import handle_error


def compose_response(
    task_result: Dict[str, Any],
    intent_result: Dict[str, Any],
    user_info: Optional[Dict[str, Any]] = None
) -> str:
    """
    Compose a user-friendly response based on task result and intent
    """
    intent = intent_result.get("intent", "")
    original_message = intent_result.get("original_message", "")
    user_info = user_info or {}

    # Check if there was an error in task execution
    if task_result.get("status") == "error":
        error_msg = task_result.get("result", {}).get("error", "Unknown error occurred")
        return f"Sorry, I encountered an error: {error_msg}"

    # Get the operations performed
    operations = task_result.get("operations", [])

    # Compose response based on intent and operations
    if intent == "add_task":
        if operations:
            op = operations[0]
            if op.get("status") == "success":
                return f"Task '{op.get('title', 'unnamed')}' has been added successfully. ✅"
        return "I tried to add your task, but something went wrong."

    elif intent == "list_tasks":
        if operations:
            op = operations[0]
            task_count = op.get("count", 0)
            if op.get("status") == "success":
                if task_count == 0:
                    filter_status = op.get("filter", "all")
                    if filter_status == "pending":
                        return "You have no pending tasks. You're all caught up!"
                    elif filter_status == "completed":
                        return "You haven't completed any tasks yet."
                    return "You have no tasks at the moment. Try adding one!"
                # Build task list display
                tasks = op.get("tasks", [])
                filter_status = op.get("filter", "all")
                if filter_status == "pending":
                    header = f"You have {task_count} pending task{'s' if task_count != 1 else ''}:"
                elif filter_status == "completed":
                    header = f"You have {task_count} completed task{'s' if task_count != 1 else ''}:"
                else:
                    header = f"Here are your {task_count} task{'s' if task_count != 1 else ''}:"
                lines = [header]
                for task in tasks:
                    task_id = task.get("id", "?")
                    title = task.get("title", "Untitled")
                    status = task.get("status", "pending")
                    status_icon = "✅" if status == "completed" else "⏳"
                    lines.append(f"  {status_icon} #{task_id}: {title}")
                return "\n".join(lines)
        return "I couldn't retrieve your tasks. Please try again."

    elif intent == "update_task":
        if operations:
            op = operations[0]
            if op.get("status") == "success":
                return f"Task #{op.get('task_id')} has been updated successfully. 📝"
        return "I couldn't update your task. Please try again."

    elif intent == "complete_task":
        if operations:
            op = operations[0]
            if op.get("status") == "success":
                return f"Task #{op.get('task_id')} has been completed. ✅"
        return "I couldn't complete your task. Please try again."

    elif intent == "delete_task":
        if operations:
            op = operations[0]
            if op.get("status") == "success":
                return f"Task #{op.get('task_id')} has been deleted. ❌"
        return "I couldn't delete your task. Please try again."

    elif intent == "greeting":
        user_name = user_info.get("name")
        if user_name:
            return f"Hello, {user_name}! I'm your AI task manager. You can ask me to add, list, update, complete, or delete tasks."
        return "Hello! I'm your AI task manager. You can ask me to add, list, update, complete, or delete tasks."

    elif intent == "help_request":
        return ("I can help you manage your tasks! Here's what I can do:\n"
                "- Add tasks: 'Add task: Buy groceries' or 'Remember to pay bills'\n"
                "- List tasks: 'Show my tasks', 'What's pending?', 'What have I completed?'\n"
                "- Complete tasks: 'Mark task #1 as complete'\n"
                "- Update tasks: 'Change task #1 to Call mom tonight'\n"
                "- Delete tasks: 'Delete task #1'\n"
                "- Identity: 'Who am I?' to see your account info")

    elif intent == "identity":
        msg_lower = original_message.lower().strip()
        if "who are you" in msg_lower or "what are you" in msg_lower:
            return ("I'm your AI task manager assistant! I can help you add, list, "
                    "update, complete, and delete tasks. Just ask!")
        # User asking about themselves
        user_name = user_info.get("name")
        user_email = user_info.get("email")
        if user_name and user_email:
            return f"You are {user_name} ({user_email}). How can I help you with your tasks today?"
        elif user_email:
            return f"You are logged in as {user_email}. How can I help you with your tasks today?"
        elif user_name:
            return f"You are {user_name}. How can I help you with your tasks today?"
        return "I know you're logged in, but I don't have your name or email details. How can I help you with your tasks?"

    else:
        # General fallback for unrecognized intents
        msg_lower = original_message.lower().strip()

        # Thank you
        if any(phrase in msg_lower for phrase in ["thank", "thanks", "thx"]):
            return "You're welcome! Let me know if you need anything else."

        return ("I'm not sure how to help with that, but I can manage your tasks! "
                "Try saying things like 'add task: buy groceries' or 'show my tasks'.")

def format_task_status(task_operation: Dict[str, Any]) -> str:
    """
    Format task status for display
    """
    operation = task_operation.get("operation", "")
    status = task_operation.get("status", "")

    if status != "success":
        return f"❌ Operation failed: {operation}"

    if operation == "create":
        return f"✅ Task created: {task_operation.get('title', 'unnamed')}"
    elif operation == "update":
        return f"📝 Task updated: #{task_operation.get('task_id', 'unknown')}"
    elif operation == "complete":
        return f"✅ Task completed: #{task_operation.get('task_id', 'unknown')}"
    elif operation == "delete":
        return f"❌ Task deleted: #{task_operation.get('task_id', 'unknown')}"
    else:
        return f"ℹ️ {operation.capitalize()} operation completed"