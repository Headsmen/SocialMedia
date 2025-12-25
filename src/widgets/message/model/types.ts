import type { Message } from '@/entities/chat';

export interface MessageListProps {
  chatId: string;
  currentUserId: string;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  showSender?: boolean;
}

export interface MessageInputProps {
  chatId: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}
