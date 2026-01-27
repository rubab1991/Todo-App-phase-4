'use server';

import { cookies } from 'next/headers';

// Function to get the current auth session
export async function getAuthSession() {
  const cookieStore = await cookies(); // cookies() returns a Promise in Next.js 13+
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  try {
    // In a real implementation, we would verify the JWT token here
    // For now, we'll just return a basic session object
    return {
      isLoggedIn: true,
      token,
      user: { id: 'mock-user-id', email: 'mock@example.com' }
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Function to set the auth token in cookies
export async function setAuthToken(token: string) {
  const cookieStore = await cookies(); // cookies() returns a Promise in Next.js 13+
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Function to clear the auth token from cookies
export async function clearAuthToken() {
  const cookieStore = await cookies(); // cookies() returns a Promise in Next.js 13+
  cookieStore.delete('auth-token');
}

// Function to check if user is authenticated
export async function isAuthenticated() {
  const session = await getAuthSession();
  return !!session;
}