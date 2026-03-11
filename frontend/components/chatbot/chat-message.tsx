'use client';

import type { ChatMessage } from '@/lib/chatbot-api';

interface ChatMessageProps {
  message: ChatMessage;
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Single chat bubble.
 * User messages are right-aligned (purple).
 * Assistant messages are left-aligned (white/gray).
 */
export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`
          max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
          ${
            isUser
              ? 'bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-br-sm'
              : 'bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
          }
        `}
      >
        {message.content}
      </div>
      {message.createdAt && (
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(message.createdAt)}
        </span>
      )}
    </div>
  );
}
