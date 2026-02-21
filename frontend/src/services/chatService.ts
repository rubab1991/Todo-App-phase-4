interface ChatResponse {
  response: string;
  conversation_id?: string;
  task_operations?: Array<{
    operation: string;
    task_id?: number;
    status: string;
    title?: string;
  }>;
  tool_calls?: Array<any>;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_email?: string;
  user_name?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const sendMessage = async (
  userId: string,
  request: ChatRequest
): Promise<ChatResponse> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    const response = await fetch(`${API_BASE_URL}/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message: request.message,
        conversation_id: request.conversation_id,
        user_email: request.user_email,
        user_name: request.user_name,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const formatBotResponse = (response: ChatResponse): string => {
  // Only format actual task operations (not "other" non-task intents)
  if (response.task_operations && response.task_operations.length > 0) {
    const taskOps = response.task_operations.filter(op => op.operation !== 'other');

    if (taskOps.length > 0) {
      const formattedOperations = taskOps.map(op => {
        switch (op.operation) {
          case 'create':
            return `✅ Task created: ${op.title}`;
          case 'update':
            return `📝 Task updated: #${op.task_id}`;
          case 'complete':
            return `✅ Task completed: #${op.task_id}`;
          case 'delete':
            return `❌ Task deleted: #${op.task_id}`;
          default:
            return '';
        }
      }).filter(Boolean).join('\n');

      if (formattedOperations) {
        return `${response.response}\n${formattedOperations}`;
      }
    }
  }

  return response.response;
};