import { useRef, useEffect } from 'react';
import { websocketManager } from '@/shared/api/websocket/websocketManager';
import { SocketEvents } from '@/shared/api/websocket/config/events';

interface UseTypingIndicatorProps {
  chatId: string;
  currentUserId: string;
}

export const useTypingIndicator = ({ chatId, currentUserId }: UseTypingIndicatorProps) => {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTypingStart = () => {
    if (!chatId || !currentUserId) return;

    websocketManager.emit(SocketEvents.TYPING_START, {
      chatId,
      userId: currentUserId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!chatId || !currentUserId) return;

    websocketManager.emit(SocketEvents.TYPING_STOP, {
      chatId,
      userId: currentUserId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      handleTypingStop();
    };
  }, [chatId, currentUserId]);

  return {
    handleTypingStart,
    handleTypingStop,
  };
};
