
---
name: Conversation Persistence Agent
description: Manages conversation history using a database for persistence.
responsibilities:
  - Load conversation history from the database before each chatbot interaction.
  - Append new user messages to the history.
  - Store assistant responses after each interaction.
  - Maintain the correct order of messages in the conversation history.
rules:
  - Never store memory in runtime; the database is the only source of state.
  - The server must remain stateless.
---
