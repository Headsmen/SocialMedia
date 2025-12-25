import type { WorkerMessageType } from './config/events';

export type { SocketEvents, WorkerMessageType } from './config/events';

export interface SendMessagePayload {
  chatId: string;
  content: string;
  tempId?: string;
}

export interface NewMessagePayload {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  tempId?: string;
}

export interface TypingPayload {
  chatId: string;
  userId: string;
}

export interface UserTypingPayload {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface OnlineStatusPayload {
  userId: string;
  isOnline: boolean;
}

export interface OnlineUsersPayload {
  userIds: string[];
}

export interface MessageStatusPayload {
  messageId: string;
  chatId: string;
  userId: string;
}

export interface WorkerMessage {
  type: WorkerMessageType;
  payload?: any;
  event?: string;
}

export interface InitPayload {
  url: string;
  token?: string;
}
