from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.chat_service import process_user_message
from ..middleware.auth import validate_user_id
from ..models.message import Message
from ..db import get_async_session_dep

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    user_email: Optional[str] = None
    user_name: Optional[str] = None


@router.post("/chat", response_model=dict)
async def chat_endpoint(
    body: ChatRequest,
    user_id: str = Depends(validate_user_id),
):
    """
    Process a user message and return an appropriate response with any task operations performed
    """
    try:
        user_info = {"email": body.user_email, "name": body.user_name}
        response = await process_user_message(user_id, body.message, body.conversation_id, user_info)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat/history", response_model=List[dict])
async def get_chat_history(
    user_id: str = Depends(validate_user_id),
    session: AsyncSession = Depends(get_async_session_dep),
):
    """Return the recent chat message history for the authenticated user."""
    try:
        result = await session.execute(
            select(Message)
            .where(Message.user_id == user_id)
            .order_by(Message.timestamp.asc())
            .limit(100)
        )
        messages = result.scalars().all()
        return [
            {
                "role": m.role,
                "content": m.content,
                "createdAt": m.timestamp.isoformat() if m.timestamp else None,
            }
            for m in messages
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))