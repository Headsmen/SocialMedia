export interface ChatCardProps {
  userName: string;
  userAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  onClick?: () => void;
}
