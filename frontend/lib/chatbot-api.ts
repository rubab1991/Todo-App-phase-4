/**
 * Chatbot API client — connects to POST /api/{user_id}/chat
 * and GET /api/{user_id}/chat/history on the Railway backend.
 */

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface ChatResponse {
  response: string;
  intent?: string;
  operations?: unknown[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://127.0.0.1:8000/api';

/** Send a user message to the AI chatbot and receive a natural language reply. */
export async function sendChatMessage(
  userId: string,
  message: string,
  token?: string
): Promise<{ response: string }> {
  const authToken =
    token ||
    (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null);

  const res = await fetch(`${API_BASE_URL}/${userId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Chat request failed: ${res.status}`);
  }

  const data: ChatResponse = await res.json();
  return { response: data.response || 'Done.' };
}

/** Retrieve conversation history for the user (most recent last). */
export async function getChatHistory(
  userId: string,
  token?: string
): Promise<ChatMessage[]> {
  const authToken =
    token ||
    (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null);

  try {
    const res = await fetch(`${API_BASE_URL}/${userId}/chat/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    // Handle both { history: [...] } and [...] response shapes
    return Array.isArray(data) ? data : (data.history ?? []);
  } catch {
    return [];
  }
}
