import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { chatKeys } from './chatKeys';
import { websocketManager } from '@/shared/api/websocket/websocketManager';
import { SocketEvents } from '@/shared/api/websocket/config/events';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.chatId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};

export const useSendMessageViaWebSocket = () => {
  return (chatId: string, content: string, tempId?: string) => {
    websocketManager.emit(SocketEvents.SEND_MESSAGE, {
      chatId,
      content,
      tempId,
    });
  };
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.markMessagesAsRead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.chatId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};
