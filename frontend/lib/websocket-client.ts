/**
 * WebSocket client for real-time task updates (Phase V).
 * Connects to /ws/{userId} on the backend and dispatches CustomEvents.
 */

import { TaskUpdateEvent } from '@/types';

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000';

export type TaskUpdateHandler = (event: TaskUpdateEvent) => void;

export class TaskWebSocketClient {
  private ws: WebSocket | null = null;
  private userId: string;
  private token: string;
  private handlers: Set<TaskUpdateHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 2000;
  private shouldReconnect = true;
  private hasConnectedBefore = false; // T058: track reconnections

  constructor(userId: string, token: string) {
    this.userId = userId;
    this.token = token;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const url = `${WS_BASE}/ws/${this.userId}?token=${encodeURIComponent(this.token)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected for user:', this.userId);
      // T058: dispatch reconnect event so page.tsx can refetch tasks
      if (this.hasConnectedBefore && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ws-reconnected', { detail: { userId: this.userId } }));
      }
      this.hasConnectedBefore = true;
      this.reconnectDelay = 2000;
    };

    this.ws.onmessage = (evt) => {
      try {
        const data: TaskUpdateEvent = JSON.parse(evt.data);
        this.handlers.forEach((h) => h(data));
      } catch {
        // pong or non-JSON keepalive
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected');
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      }
    };

    this.ws.onerror = (err) => {
      console.warn('[WS] Error:', err);
    };

    // T060: Keepalive ping every 25s (below proxy idle timeout)
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, 25000);
  }

  subscribe(handler: TaskUpdateHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}

// Singleton factory — one connection per user session
const clients = new Map<string, TaskWebSocketClient>();

export function getTaskWebSocket(userId: string, token: string): TaskWebSocketClient {
  if (!clients.has(userId)) {
    const client = new TaskWebSocketClient(userId, token);
    clients.set(userId, client);
    client.connect();
  }
  return clients.get(userId)!;
}

export function closeTaskWebSocket(userId: string) {
  clients.get(userId)?.disconnect();
  clients.delete(userId);
}
