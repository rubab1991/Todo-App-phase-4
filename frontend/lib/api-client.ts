/**
 * Client-side API service for the Todo API backend
 * Handles all HTTP requests to the backend API with proper authentication
 */

import { Task } from '@/types';

// Base API URL - defaults to the backend running on port 8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  user_id: string,
  token?: string  // Optional token parameter to support JWT auth
): Promise<T> {
  // Construct URL - the endpoint now contains the path without user_id in URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage if not provided
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null);

  // Clone options to avoid mutating the original
  const clonedOptions = { ...options };

  // For non-GET requests, add user_id to the request body if not already present
  if (clonedOptions.method && clonedOptions.method !== 'GET' && clonedOptions.body) {
    try {
      const parsedBody = JSON.parse(clonedOptions.body as string);
      // Add user_id to body if it's not already there and user_id is provided
      if (!parsedBody.userId && user_id) {
        parsedBody.userId = user_id;
      }
      clonedOptions.body = JSON.stringify(parsedBody);
    } catch (e) {
      // If body is not JSON, we can't modify it
      console.warn('Request body is not valid JSON, unable to add userId');
    }
  }

  const config: RequestInit = {
    ...clonedOptions,
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': user_id, // Add user_id as a header which can be read by backend
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...clonedOptions.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // For DELETE requests, there might not be a response body
    if (config.method === 'DELETE' && response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${config.method} ${url}`, error);

    // Provide a more informative error if it's a network error
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error('Network error: Unable to connect to the API server. Please make sure the backend server is running on http://127.0.0.1:8000.');
    }

    throw error;
  }
}

/**
 * Task API Service
 */
export const taskApi = {
  /**
   * Get all tasks for a user
   */
  async getAllTasks(user_id: string, token?: string): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks`, { method: 'GET' }, user_id, token);
  },

  /**
   * Create a new task
   */
  async createTask(user_id: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, token?: string): Promise<Task> {
    return apiRequest<Task>(`/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    }, user_id, token);
  },

  /**
   * Get a specific task by ID
   */
  async getTaskById(user_id: string, taskId: string, token?: string): Promise<Task> {
    return apiRequest<Task>(`/tasks/${taskId}`, { method: 'GET' }, user_id, token);
  },

  /**
   * Update a task
   */
  async updateTask(user_id: string, taskId: string, taskData: Partial<Task>, token?: string): Promise<Task> {
    return apiRequest<Task>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }, user_id, token);
  },

  /**
   * Delete a task
   */
  async deleteTask(user_id: string, taskId: string, token?: string): Promise<void> {
    await apiRequest<void>(`/tasks/${taskId}`, { method: 'DELETE' }, user_id, token);
  },

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(user_id: string, taskId: string, token?: string): Promise<Task> {
    return apiRequest<Task>(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
    }, user_id, token);
  },
};

export default taskApi;