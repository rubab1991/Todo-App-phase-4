from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime


class TaskBase(SQLModel):
    title: str = Field(nullable=False)
    description: Optional[str] = None
    status: str = Field(default="pending", nullable=False)  # "pending" or "completed"
    completed: bool = Field(default=False)
    due_date: Optional[str] = Field(default=None)
    priority: str = Field(default="medium")


class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship
    user: "User" = Relationship(back_populates="tasks")


class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  # "pending" or "completed"
    completed: Optional[bool] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None