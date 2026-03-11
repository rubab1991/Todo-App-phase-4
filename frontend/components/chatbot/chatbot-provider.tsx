'use client';

import { useState } from 'react';
import { ChatbotButton } from './chatbot-button';
import { ChatWindow } from './chat-window';

interface ChatbotProviderProps {
  userId: string;
  token?: string;
}

/**
 * Combines the floating ChatbotButton and ChatWindow with shared open/close state.
 * Render this once in the root layout (client side only, when user is authenticated).
 */
export function ChatbotProvider({ userId, token }: ChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <ChatWindow userId={userId} token={token} onClose={close} />
      )}
      <ChatbotButton isOpen={isOpen} onClick={toggle} />
    </>
  );
}
