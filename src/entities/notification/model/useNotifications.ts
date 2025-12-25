import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications-api';

export const notificationKeys = {
  all: ['notifications'] as const,
  user: (userEmail?: string) => [...notificationKeys.all, userEmail] as const,
};

// Хук для получения уведомлений пользователя
export const useNotifications = (userEmail?: string) => {
  return useQuery({
    queryKey: notificationKeys.user(userEmail),
    queryFn: async () => {
      if (!userEmail) return [];
      return notificationsApi.getUserNotifications(userEmail);
    },
    enabled: !!userEmail,
    staleTime: 0,
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });
};

// Хук для пометки уведомления как прочитанного
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      return notificationsApi.markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// Хук для пометки всех уведомлений как прочитанных
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userEmail: string) => {
      return notificationsApi.markAllAsRead(userEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// Хук для удаления уведомления
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      return notificationsApi.deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// Хук для получения количества непрочитанных уведомлений
export const useUnreadCount = (userEmail?: string) => {
  const { data: notifications } = useNotifications(userEmail);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return { unreadCount };
};

// Хук для создания уведомления
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
