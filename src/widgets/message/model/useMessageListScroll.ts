import { useRef, useEffect } from 'react';
import type { Message } from '@/entities/chat';

interface UseMessageListScrollParams {
  messages: Message[];
  currentUserId: string;
}

export const useMessageListScroll = ({ messages, currentUserId }: UseMessageListScrollParams) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const previousMessagesLength = useRef(0);

  // Первоначальный скролл при загрузке
  useEffect(() => {
    if (scrollRef.current && isFirstLoad.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isFirstLoad.current = false;
      previousMessagesLength.current = messages.length;
    }
  }, [messages.length]);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (!scrollRef.current || isFirstLoad.current || messages.length === previousMessagesLength.current) {
      return;
    }

    const viewport = scrollRef.current;
    const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 150;
    const lastMessage = messages[messages.length - 1];

    // Скроллим вниз если:
    // 1. Пользователь отправил сообщение сам
    // 2. Пользователь находится близко к низу (в пределах 150px)
    if (lastMessage?.senderId === currentUserId || isNearBottom) {
      viewport.scrollTop = viewport.scrollHeight;
    }

    previousMessagesLength.current = messages.length;
  }, [messages, currentUserId]);

  return { scrollRef };
};
