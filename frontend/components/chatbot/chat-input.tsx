'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

/**
 * Text input + send button at the bottom of the chat panel.
 * Supports Enter to send (Shift+Enter for newline).
 * Disables during pending requests and clears on send.
 */
export function ChatInput({ onSend, isLoading, placeholder = 'Ask me to manage your tasks...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        className="
          flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5
          text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          max-h-[120px] overflow-y-auto
          transition-all duration-200
        "
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        aria-label="Send message"
        className="
          flex-shrink-0 w-10 h-10 rounded-xl
          flex items-center justify-center
          bg-gradient-to-br from-purple-600 to-blue-500 text-white
          hover:from-purple-700 hover:to-blue-600
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200 hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
          shadow-md
        "
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
