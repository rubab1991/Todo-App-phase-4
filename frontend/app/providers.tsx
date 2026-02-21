'use client';

import { AuthProvider } from '@/hooks/use-auth';
import ChatContainer from '@/src/components/ChatContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ChatContainer />
    </AuthProvider>
  );
}