import type { Message } from '@/entities/chat';

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  showSender?: boolean;
}
