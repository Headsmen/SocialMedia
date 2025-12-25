// src/entities/user/hooks/useFriendRequests.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users-api';
import { userKeys } from '../config/userKeys';

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fromUserId, toUserEmail }: { fromUserId: string; toUserEmail: string }) => {
      const result = await usersApi.addFriendRequest(fromUserId, toUserEmail);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.refetchQueries({ queryKey: userKeys.all });
    },
  });
};

// Хук для получения отправленных запросов текущего пользователя
export const useSentFriendRequests = (userEmail?: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'sent-requests', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];
      const user = await usersApi.getUserByEmail(userEmail);
      return user?.FriendRequests || [];
    },
    enabled: !!userEmail,
    staleTime: 0, // Данные всегда считаются устаревшими для быстрого обновления
  });
};

export const useIncomingFriendRequests = (userEmail?: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'incoming-requests', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];
      const user = await usersApi.getUserByEmail(userEmail);
      return user?.IncomingRequests || [];
    },
    enabled: !!userEmail,
    staleTime: 0,
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, senderEmail }: { userId: string; senderEmail: string }) => {
      return usersApi.acceptFriendRequest(userId, senderEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.refetchQueries({ queryKey: userKeys.all });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, senderEmail }: { userId: string; senderEmail: string }) => {
      return usersApi.rejectFriendRequest(userId, senderEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.refetchQueries({ queryKey: userKeys.all });
    },
  });
};

export const useFriends = (userEmail?: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'friends', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];
      const user = await usersApi.getUserByEmail(userEmail);
      return user?.Friends || [];
    },
    enabled: !!userEmail,
    staleTime: 0,
  });
};
