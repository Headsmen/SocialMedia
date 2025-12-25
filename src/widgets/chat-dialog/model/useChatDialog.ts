import { useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserByEmail, useAuthStore } from '@/entities/user';
import { useChatStore, useSendMessageViaWebSocket } from '@/entities/chat';
import { websocketManager } from '@/shared/api/websocket/websocketManager';
import { SocketEvents } from '@/shared/api/websocket/config/events';

export const useChatDialog = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserByEmail(userId);
  const currentUser = useAuthStore((state) => state.user);
  const sendMessageViaWS = useSendMessageViaWebSocket();

  const { isUserOnline, getTypingUsers, setCurrentChatId } = useChatStore();

  // Генерируем ID чата (используем ID пользователей, а не email)
  const chatId = useMemo(() => {
    return user?.id && currentUser?.id ? [user.id, currentUser.id].sort().join('_') : '';
  }, [user?.id, currentUser?.id]);

  const isOnline = useMemo(() => {
    return user?.id ? isUserOnline(user.id) : false;
  }, [user?.id, isUserOnline]);

  const typingUsers = useMemo(() => {
    return chatId ? getTypingUsers(chatId) : [];
  }, [chatId, getTypingUsers]);

  const isUserTyping = useMemo(() => {
    return user?.id ? typingUsers.includes(user.id) : false;
  }, [user?.id, typingUsers]);

  // Присоединяемся к чату при монтировании
  useEffect(() => {
    if (!chatId) return;

    setCurrentChatId(chatId);
    websocketManager.emit(SocketEvents.JOIN_CHAT, { chatId });

    return () => {
      websocketManager.emit(SocketEvents.LEAVE_CHAT, { chatId });
      setCurrentChatId(null);
    };
  }, [chatId, setCurrentChatId]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!chatId) return;

      const tempId = `temp_${Date.now()}`;
      sendMessageViaWS(chatId, content, tempId);
    },
    [chatId, sendMessageViaWS]
  );

  const handleBack = useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  return {
    user,
    currentUser,
    isLoading,
    chatId,
    isOnline,
    isUserTyping,
    handleSendMessage,
    handleBack,
  };
};
