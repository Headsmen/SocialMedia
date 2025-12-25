import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { chatKeys } from './chatKeys';

export const useChats = () => {
  return useQuery({
    queryKey: chatKeys.lists(),
    queryFn: async () => {
      const response = await chatApi.getChats();
      return response.data;
    },
  });
};

export const useChatById = (chatId: string) => {
  return useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: () => chatApi.getChatById(chatId),
    enabled: !!chatId,
  });
};
