import { api } from '@/shared/api/config/axiosInstance';
import { BaseCrudApi } from '../factories/BaseCrudApi';
import axios from 'axios';

export const NotificationType = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  FRIEND_REQUEST_ACCEPTED: 'FRIEND_REQUEST_ACCEPTED',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification {
  id?: string;
  userId: string;
  type: NotificationType;
  fromUserEmail: string;
  fromUserName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type CreateNotificationDto = Omit<Notification, 'id'>;

class NotificationsApi extends BaseCrudApi<Notification, CreateNotificationDto> {
  private collectionInitAttempted = false;

  constructor() {
    super(api, '/notifications');
  }

  private async initializeCollection(): Promise<void> {
    if (this.collectionInitAttempted) return;

    this.collectionInitAttempted = true;

    try {
      const testNotification: CreateNotificationDto = {
        userId: 'system',
        type: 'FRIEND_REQUEST',
        fromUserEmail: 'system',
        fromUserName: 'System',
        message: 'Collection initialization',
        isRead: true,
        createdAt: new Date().toISOString(),
      };

      await this.create(testNotification);
    } catch (error) {
      // Игнорируем ошибки инициализации
    }
  }

  async getUserNotifications(userEmail: string): Promise<Notification[]> {
    try {
      const response = await this.getAll();

      const userNotifications = response.data.filter(
        (notification) => notification.userId === userEmail
      );

      userNotifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return userNotifications;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async createNotification(notification: CreateNotificationDto): Promise<Notification> {
    try {
      const response = await this.create(notification);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        await this.initializeCollection();
        const response = await this.create(notification);
        return response.data;
      }
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await this.update(notificationId, { isRead: true });
    return response.data;
  }

  async markAllAsRead(userEmail: string): Promise<void> {
    const notifications = await this.getUserNotifications(userEmail);
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    await Promise.all(unreadNotifications.map((n) => this.markAsRead(n.id!)));
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.delete(notificationId);
  }
}

export const notificationsApi = new NotificationsApi();
