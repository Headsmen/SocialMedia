import { useState, useCallback, useRef, useEffect } from 'react';
import { websocketManager } from '@/shared/api/websocket/websocketManager';
import { SocketEvents } from '@/shared/api/websocket/config/events';

interface UseMessageInputParams {
  chatId: string;
  onSendMessage: (content: string) => void;
}

interface UseMessageInputReturn {
  message: string;
  isTyping: boolean;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const useMessageInput = ({
  chatId,
  onSendMessage,
}: UseMessageInputParams): UseMessageInputReturn => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      websocketManager.emit(SocketEvents.TYPING_START, { chatId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      websocketManager.emit(SocketEvents.TYPING_STOP, { chatId });
    }, 2000);
  }, [chatId, isTyping]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
      handleTypingStart();
    },
    [handleTypingStart]
  );

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    if (isTyping) {
      setIsTyping(false);
      websocketManager.emit(SocketEvents.TYPING_STOP, { chatId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [message, isTyping, chatId, onSendMessage]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        websocketManager.emit(SocketEvents.TYPING_STOP, { chatId });
      }
    };
  }, [chatId, isTyping]);

  return {
    message,
    isTyping,
    handleChange,
    handleSend,
    handleKeyDown,
  };
};
