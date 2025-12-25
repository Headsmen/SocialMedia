// Existing types
export interface FriendsForm {
  id: string;
  avatar: string;
  fullName: string;
  addFriend?: string;
}

// Component Props
export interface FriendRequestFormProps {
  friend: FriendsForm;
  onSubmit?: () => Promise<void>;
  isRequestSent?: boolean;
  className?: string;
}

export interface FriendCardProps {
  friendEmail: string;
  friendName: string;
  friendAvatar: string;
  className?: string;
}

export interface IncomingRequestCardProps {
  senderEmail: string;
  senderName: string;
  senderAvatar: string;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  className?: string;
}
