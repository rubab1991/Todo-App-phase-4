# Natural Language Understanding (NLU)

## Instructions
1. Parse user messages to identify task-related entities:
   - Title, description, task ID, status (pending/completed/all)
2. Handle synonyms and varied phrasing to correctly interpret commands.

## Examples
- "Finish task 3" → task_id: 3, action: complete_task
- "Remember to call mom tonight" → title: "Call mom tonight", action: add_task
- "Show pending tasks" → status: pending, action: list_tasks