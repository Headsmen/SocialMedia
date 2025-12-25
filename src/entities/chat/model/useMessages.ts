import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { chatKeys } from './chatKeys';
import type { Message } from './types';

export const useMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: ({ pageParam = 1 }) =>
      chatApi.getMessages({ chatId, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!chatId,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      messages: data.pages.flatMap((page) => page.data),
    }),
  });
};

export const useAddOptimisticMessage = () => {
  const queryClient = useQueryClient();

  return (chatId: string, message: Message) => {
    queryClient.setQueryData(chatKeys.messages(chatId), (old: any) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: any, index: number) =>
          index === 0
            ? { ...page, data: [...page.data, message] }
            : page
        ),
      };
    });
  };
};

export const useRemoveOptimisticMessage = () => {
  const queryClient = useQueryClient();

  return (chatId: string, tempId: string) => {
    queryClient.setQueryData(chatKeys.messages(chatId), (old: any) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((msg: Message) => msg.tempId !== tempId),
        })),
      };
    });
  };
};
