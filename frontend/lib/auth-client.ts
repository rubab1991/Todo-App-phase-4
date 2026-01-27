/**
 * Custom Auth Client Configuration for the Todo App Frontend
 * Sets up the client-side integration with custom auth system
 * Uses Next.js API routes to handle authentication and get properly signed JWTs
 */

interface AuthResponse {
  user?: {
    id: string;
    email: string;
  };
  token?: string;
  success: boolean;
  error?: string;
}

interface Session {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

class CustomAuthClient {
  private token: string | null = null;

  constructor() {
    // Attempt to load token from localStorage
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Call the Next.js API route to handle sign-in
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Sign in failed' }));
        return { success: false, error: errorData.error || 'Sign in failed' };
      }

      const data = await response.json();

      // Store the token in localStorage
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-email', data.email);
        localStorage.setItem('user-id', data.userId);
      }

      return {
        user: { id: data.userId, email: data.email },
        token: data.token,
        success: true
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error during sign in' };
    }
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      // Call the Next.js API route to handle sign-up
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Sign up failed' }));
        return { success: false, error: errorData.error || 'Sign up failed' };
      }

      const data = await response.json();

      // Store the token in localStorage
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-email', data.email);
        localStorage.setItem('user-id', data.userId);
      }

      return {
        user: { id: data.userId, email: data.email },
        token: data.token,
        success: true
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error during sign up' };
    }
  }

  async signOut(): Promise<void> {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-email');
      localStorage.removeItem('user-id');
    }
  }

  async getSession(): Promise<Session | null> {
    // Retrieve from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
    }

    if (!this.token) {
      return null;
    }

    try {
      // Call the Next.js API route to validate the session
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear it
        this.signOut();
        return null;
      }

      const data = await response.json();

      return {
        user: {
          id: data.user.id,
          email: data.user.email
        },
        token: this.token
      };
    } catch (error) {
      console.error('Error getting session:', error);
      // On network error, clear the token to be safe
      this.signOut();
      return null;
    }
  }
}

// Create a singleton instance
const authClient = new CustomAuthClient();

export const signIn = authClient.signIn.bind(authClient);
export const signUp = authClient.signUp.bind(authClient);
export const signOut = authClient.signOut.bind(authClient);
export const getSession = authClient.getSession.bind(authClient);