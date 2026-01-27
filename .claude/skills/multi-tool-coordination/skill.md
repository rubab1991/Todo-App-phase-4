# Multi-Tool Coordination

## Instructions
1. Determine if a user request requires multiple MCP tools.
2. Execute the sequence in order while maintaining correct parameters.
3. Return a single, coherent response to the user summarizing all actions.

## Examples
- "Delete my old tasks" → list_tasks → select tasks → delete_task → confirm deletion.
- "Update task 1 and mark task 2 complete" → call update_task → call complete_task → confirm both actions.