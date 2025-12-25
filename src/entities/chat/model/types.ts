import type { Message as BaseMessage, Chat as BaseChat } from '@/shared/api/chat';

export interface Message extends BaseMessage {
  tempId?: string;
}

export type Chat = BaseChat;

export interface MessageWithSender extends Message {
  senderName?: string;
  senderAvatar?: string;
}

export interface ChatWithParticipants extends Chat {
  participants?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
}
