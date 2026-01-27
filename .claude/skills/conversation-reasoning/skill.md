# Conversation Reasoning (Stateless)

## Instructions
1. Fetch conversation history from the database for the current user.
2. Resolve ambiguous commands using the conversation context.
3. Do not store any memory within the agent itself; rely solely on the database.

## Examples
- User: "Delete the last task" → look up the last task from conversation history → call delete_task with task_id.
- User: "Mark the meeting as done" → find recent task titled 'meeting' → call complete_task.