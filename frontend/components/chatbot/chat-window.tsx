'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessageBubble } from './chat-message';
import { ChatInput } from './chat-input';
import { sendChatMessage, getChatHistory } from '@/lib/chatbot-api';
import type { ChatMessage } from '@/lib/chatbot-api';

interface ChatWindowProps {
  userId: string;
  token?: string;
  onClose: () => void;
}

/**
 * Expandable chat panel showing conversation history + input.
 * Dispatches 'tasks-updated' window event after every assistant response
 * so the task dashboard can refresh automatically.
 */
export function ChatWindow({ userId, token, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation history on mount
  useEffect(() => {
    if (!userId) return;
    getChatHistory(userId, token).then((history) => {
      if (history.length > 0) setMessages(history);
    });
  }, [userId, token]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { response } = await sendChatMessage(userId, content, token);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Notify the task dashboard to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('tasks-updated'));
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        fixed bottom-24 right-6 z-50
        w-[90vw] sm:w-[380px]
        h-[70vh] sm:h-[520px]
        flex flex-col
        rounded-2xl overflow-hidden
        shadow-2xl shadow-purple-900/20
        border border-white/20
        backdrop-blur-xl bg-white/95
        animate-in slide-in-from-bottom-4 fade-in duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">AI Task Assistant</p>
            <p className="text-white/70 text-[10px]">Powered by Cohere</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50/50 to-white/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">How can I help?</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                Try: "Add a task to buy groceries" or "Show my high priority tasks"
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessageBubble key={idx} message={msg} />
          ))
        )}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white/80 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
