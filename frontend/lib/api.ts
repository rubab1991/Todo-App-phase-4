// API client for server components
// For client components, use the client-side API functions in the components directly
'use server';

import { cookies } from 'next/headers';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  // Get the auth token from cookies
  const cookiesStore = await cookies(); // cookies() returns a Promise in Next.js 13+
  const token = cookiesStore.get('auth-token')?.value;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // For DELETE requests, there might not be a response body
    if (method === 'DELETE') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

// Authentication API functions
export const authApi = {
  async signIn(email: string, password: string) {
    return apiClient<{ user: any; token: string }>('/api/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
  },

  async signUp(email: string, password: string) {
    return apiClient<{ user: any; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: { email, password },
    });
  },
};

// Task API functions
export const taskApi = {
  async getAllTasks() {
    return apiClient<{ tasks: any[] }>('/api/tasks');
  },

  async createTask(taskData: Omit<any, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return apiClient<{ task: any }>('/api/tasks', {
      method: 'POST',
      body: taskData,
    });
  },

  async updateTask(id: string, taskData: Partial<any>) {
    return apiClient<{ task: any }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: taskData,
    });
  },

  async deleteTask(id: string) {
    return apiClient<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};