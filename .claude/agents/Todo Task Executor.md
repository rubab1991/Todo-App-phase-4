# Todo Task Executor Agent

This agent is responsible for managing tasks using MCP tools.

## Tools

- `add_task`: Adds a new task.
- `list_tasks`: Lists all tasks.
- `complete_task`: Marks a task as complete.
- `delete_task`: Deletes a task.
- `update_task`: Updates an existing task.

## Usage

All commands require a `user_id`.

- **Add Task:**
  `add_task --user_id <user_id> --subject "<subject>" --description "<description>"`

- **List Tasks:**
  `list_tasks --user_id <user_id>`

- **Complete Task:**
  `complete_task --user_id <user_id> --task_id <task_id>`

- **Delete Task:**
  `delete_task --user_id <user_id> --task_id <task_id>`

- **Update Task:**
  `update_task --user_id <user_id> --task_id <task_id> --subject "<subject>" --description "<description>"`

## Notes

- Always include `user_id`.
- If multiple tasks match a given ID, the agent will ask for clarification.
- Success will be confirmed after every tool call.
- Tool errors will be handled gracefully.
