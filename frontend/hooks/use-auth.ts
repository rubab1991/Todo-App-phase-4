'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '@/types';
import {
  signIn as customSignIn,
  signUp as customSignUp,
  signOut as customSignOut,
  getSession,
} from '@/lib/auth-client';

type AuthContextType = {
  session: UserSession | null;
  loading: boolean;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] =
    useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const initSession = async () => {
      try {
        const currentSession = await getSession();

        if (currentSession?.user?.id) {
          // Map the session response to UserSession type
          const userSession: UserSession = {
            id: currentSession.user.id,
            email: currentSession.user.email,
            token: currentSession.token,
            isLoggedIn: true,
            isLoading: false,
          };
          setSession(userSession);
          setAuthStatus('authenticated');
        } else {
          setSession(null);
          setAuthStatus('unauthenticated');
        }
      } catch (err) {
        console.error('Session check failed', err);
        setSession(null);
        setAuthStatus('unauthenticated');
      } finally {
        // Always ensure loading is set to false after initialization
        setLoading(false);
      }
    };

    initSession();
  }, []); // Empty dependency array to run only once

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await customSignIn(email, password);

      if (result.success && result.user) {
        const userSession: UserSession = {
          id: result.user.id,
          email: result.user.email,
          token: result.token,
          isLoggedIn: true,
          isLoading: false,
        };
        setSession(userSession);
        setAuthStatus('authenticated');
        return { success: true };
      }

      return { success: false, error: result.error || 'Sign in failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await customSignUp(email, password);

      if (result.success && result.user) {
        const userSession: UserSession = {
          id: result.user.id,
          email: result.user.email,
          token: result.token,
          isLoggedIn: true,
          isLoading: false,
        };
        setSession(userSession);
        setAuthStatus('authenticated');
        return { success: true };
      }

      return { success: false, error: result.error || 'Sign up failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await customSignOut();
      setSession(null);
      setAuthStatus('unauthenticated');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        authStatus,
        signIn,
        signUp,
        signOut,
        isAuthenticated: authStatus === 'authenticated',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}