"""
Canonical event schema for all Kafka messages published via Dapr pub/sub.
All topics (task-events, task-reminders, audit-events) use this schema.
"""
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class TaskEvent(BaseModel):
    """Canonical event envelope for all task-related Kafka messages."""

    event_type: str = Field(
        ...,
        description=(
            "One of: task_created, task_updated, task_deleted, "
            "task_completed, task_reminded"
        ),
    )
    task_id: str = Field(..., description="UUID or stringified integer ID of the task")
    user_id: str = Field(..., description="ID of the user who owns the task")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(tz=timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp of the event",
    )
    payload: Dict[str, Any] = Field(
        default_factory=dict,
        description="Full task snapshot at the time of the event",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "event_type": "task_created",
                "task_id": "42",
                "user_id": "user_abc123",
                "timestamp": "2026-03-10T12:00:00+00:00",
                "payload": {
                    "task_id": "42",
                    "title": "Buy groceries",
                    "priority": "medium",
                    "completed": False,
                    "reminder_at": None,
                    "recurring_interval": None,
                },
            }
        }
