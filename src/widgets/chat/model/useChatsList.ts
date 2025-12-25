import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUserByEmail, useUsersByEmails } from '@/entities/user';
import { useChatStore, useChats, type Chat } from '@/entities/chat';

export const useChatsList = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { data: currentUserData } = useUserByEmail(currentUser?.email);
  const { data: serverChatsData, isLoading: chatsLoading } = useChats();
  const isUserOnline = useChatStore((state) => state.isUserOnline);

  // Получаем список друзей
  const friendEmails = currentUserData?.Friends || [];
  const { data: friends, isLoading: friendsLoading } = useUsersByEmails(friendEmails);

  const chatsArray: Chat[] = Array.isArray(serverChatsData)
    ? serverChatsData
    : (serverChatsData as any)?.data || [];

  const chatsMap = new Map(
    chatsArray.map((chat) => {
      const otherUserId = chat.participantIds.find((id) => String(id) !== String(currentUser?.id));
      return [String(otherUserId), chat];
    })
  );

  const chats = friends?.map((user) => {
      const chat = user.id ? chatsMap.get(String(user.id)) : null;
      const lastMessage = chat?.lastMessage;

      return {
        id: user.id || user.email,
        userName: `${user.firstName} ${user.lastName}`,
        userAvatar: user.avatar,
        lastMessage: lastMessage?.content || 'Начните общение',
        lastMessageTime: lastMessage?.createdAt || new Date().toISOString(),
        unreadCount: 0,
        isOnline: user.id ? isUserOnline(user.id) : false,
        email: user.email,
      };
    })
    // Сортируем: чаты с сообщениями сверху (по времени), чаты без сообщений внизу
    .sort((a, b) => {
      const hasMessagesA = a.lastMessage !== 'Начните общение';
      const hasMessagesB = b.lastMessage !== 'Начните общение';

      // Если один чат с сообщениями, а другой без - чат с сообщениями выше
      if (hasMessagesA && !hasMessagesB) return -1;
      if (!hasMessagesA && hasMessagesB) return 1;

      // Если оба с сообщениями или оба без - сортируем по времени
      const timeA = new Date(a.lastMessageTime).getTime();
      const timeB = new Date(b.lastMessageTime).getTime();
      return timeB - timeA;
    });

  const handleChatClick = (email: string) => {
    navigate(`/chat/${email}`);
  };

  return {
    chats: chats || [],
    isLoading: friendsLoading || chatsLoading,
    error: null,
    handleChatClick,
  };
};
