import React, { useState, useEffect } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatModal from './ChatModal';
import { sendMessage, formatBotResponse, ChatRequest } from '../services/chatService';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatContainer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get user info from auth storage (set by auth-client on signin/signup)
      const userId = localStorage.getItem('user-id');
      if (!userId) {
        throw new Error('Not authenticated. Please sign in first.');
      }
      const userEmail = localStorage.getItem('user-email') || undefined;
      const userName = userEmail ? userEmail.split('@')[0] : undefined;

      // Prepare the request
      const request: ChatRequest = {
        message,
        conversation_id: conversationId,
        user_email: userEmail,
        user_name: userName,
      };

      // Send the message to the backend
      const response = await sendMessage(userId, request);

      // Update conversation ID if returned
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Format the bot response
      const formattedResponse = formatBotResponse(response);

      // Add bot response to the chat
      const botMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: formattedResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Notify tasks page to refresh if a task was created/updated/deleted/completed
      if (response.task_operations?.some(op => op.operation !== 'other')) {
        window.dispatchEvent(new Event('tasks-updated'));
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the chat
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatbotIcon onClick={toggleModal} />
      <ChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSendMessage={handleSendMessage}
        messages={messages}
        isLoading={isLoading}
      />
    </>
  );
};

export default ChatContainer;