# Tool Selection

## Instructions
1. Based on the user's intent, select the appropriate MCP tool:
   - add_task, list_tasks, complete_task, delete_task, update_task
2. Ensure all required parameters (e.g., user_id, task_id, title) are included.
3. Chain multiple tool calls when necessary (e.g., list → delete).

## Examples
- "Delete the meeting task" → first call list_tasks to identify the task → then call delete_task with the correct task_id.
- "Add a task to pay bills" → call add_task with title="Pay bills".