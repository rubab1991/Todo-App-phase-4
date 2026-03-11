'use client';

import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ChatbotProvider } from '@/components/chatbot/chatbot-provider';

function AuthenticatedChatbot() {
  const { session, isAuthenticated } = useAuth();
  if (!isAuthenticated || !session?.id) return null;
  return <ChatbotProvider userId={session.id} token={session.token} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthenticatedChatbot />
    </AuthProvider>
  );
}