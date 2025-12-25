import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/entities/user';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  NotificationType,
} from '@/entities/notification';
import { IconBell, IconUserPlus, IconUserCheck } from '@tabler/icons-react';

export const useNotificationsWidget = () => {
  const { user } = useAuthStore();
  const { data: notifications, isLoading, error } = useNotifications(user?.email);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markAsRead.mutateAsync(notificationId);
      } catch (error) {
        // Ошибка обрабатывается в mutation
      }
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await markAllAsRead.mutateAsync(user.email);
    } catch (error) {
      // Ошибка обрабатывается в mutation
    }
  }, [user, markAllAsRead]);

  const handleDelete = useCallback(
    async (notificationId: string) => {
      try {
        await deleteNotification.mutateAsync(notificationId);
      } catch (error) {
        // Ошибка обрабатывается в mutation
      }
    },
    [deleteNotification]
  );

  const getNotificationIcon = useCallback((type: NotificationType) => {
    switch (type) {
      case NotificationType.FRIEND_REQUEST:
        return <IconUserPlus size={20} />;
      case NotificationType.FRIEND_REQUEST_ACCEPTED:
        return <IconUserCheck size={20} />;
      default:
        return <IconBell size={20} />;
    }
  }, []);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.isRead).length || 0;
  }, [notifications]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    getNotificationIcon,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
    isDeleting: deleteNotification.isPending,
  };
};
