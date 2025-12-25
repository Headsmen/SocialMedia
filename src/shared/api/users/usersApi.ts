import { api } from '@/shared/api/config/axiosInstance';
import { BaseCrudApi } from '../factories/BaseCrudApi';
import { notificationsApi, NotificationType } from '../notifications';

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt?: string;
  FriendRequests?: string[];
  IncomingRequests?: string[];
  Friends?: string[];
}

type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'FriendRequests' | 'IncomingRequests' | 'Friends'>;

class UsersApi extends BaseCrudApi<User, CreateUserDto> {
  constructor() {
    super(api, '/FriendsPlayers');
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await this.create({
      ...userData,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`,
      createdAt: new Date().toISOString(),
      FriendRequests: [],
      IncomingRequests: [],
      Friends: [],
    } as CreateUserDto);
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.getAll();
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.getById(id);
    return response.data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const response = await this.getAll({ email });
    return response.data[0];
  }

  async addFriendRequest(userId: string, friendEmail: string): Promise<User> {
    const user = await this.getUserById(userId);
    const recipient = await this.getUserByEmail(friendEmail);

    if (!recipient) {
      throw new Error('Пользователь с таким email не найден');
    }

    const friendRequests = user.FriendRequests || [];
    if (!friendRequests.includes(friendEmail)) {
      friendRequests.push(friendEmail);
    }

    const incomingRequests = recipient.IncomingRequests || [];
    if (!incomingRequests.includes(user.email)) {
      incomingRequests.push(user.email);
    }

    const senderResponse = await this.update(userId, {
      FriendRequests: friendRequests,
    });

    await this.update(recipient.id!, {
      IncomingRequests: incomingRequests,
    });

    try {
      await notificationsApi.createNotification({
        userId: recipient.email,
        type: NotificationType.FRIEND_REQUEST,
        fromUserEmail: user.email,
        fromUserName: `${user.firstName} ${user.lastName}`,
        message: `${user.firstName} ${user.lastName} отправил вам запрос в друзья`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      // Игнорируем ошибки создания уведомления
    }

    return senderResponse.data;
  }

  async acceptFriendRequest(userId: string, senderEmail: string): Promise<User> {
    const user = await this.getUserById(userId);
    const sender = await this.getUserByEmail(senderEmail);

    if (!sender) {
      throw new Error('Пользователь с таким email не найден');
    }

    const incomingRequests = (user.IncomingRequests || []).filter(
      (email) => email !== senderEmail
    );

    const userFriends = user.Friends || [];
    if (!userFriends.includes(senderEmail)) {
      userFriends.push(senderEmail);
    }

    const senderRequests = (sender.FriendRequests || []).filter((email) => email !== user.email);

    const senderFriends = sender.Friends || [];
    if (!senderFriends.includes(user.email)) {
      senderFriends.push(user.email);
    }

    const recipientResponse = await this.update(userId, {
      IncomingRequests: incomingRequests,
      Friends: userFriends,
    });

    await this.update(sender.id!, {
      FriendRequests: senderRequests,
      Friends: senderFriends,
    });

    try {
      await notificationsApi.createNotification({
        userId: sender.email,
        type: NotificationType.FRIEND_REQUEST_ACCEPTED,
        fromUserEmail: user.email,
        fromUserName: `${user.firstName} ${user.lastName}`,
        message: `${user.firstName} ${user.lastName} принял ваш запрос в друзья`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
    }

    return recipientResponse.data;
  }

  async rejectFriendRequest(userId: string, senderEmail: string): Promise<User> {
    const user = await this.getUserById(userId);
    const sender = await this.getUserByEmail(senderEmail);

    if (!sender) {
      throw new Error('Пользователь с таким email не найден');
    }

    const incomingRequests = (user.IncomingRequests || []).filter(
      (email) => email !== senderEmail
    );
    const senderRequests = (sender.FriendRequests || []).filter((email) => email !== user.email);

    const recipientResponse = await this.update(userId, {
      IncomingRequests: incomingRequests,
    });

    await this.update(sender.id!, {
      FriendRequests: senderRequests,
    });

    return recipientResponse.data;
  }

  async updateUserName(userId: string, firstName: string, lastName: string): Promise<User> {
    // Получаем текущие данные пользователя
    const currentUser = await this.getUserById(userId);

    // Проверяем, является ли текущая аватарка автогенерированной от ui-avatars.com
    const isAutoGeneratedAvatar = currentUser.avatar?.includes('ui-avatars.com');

    // Генерируем новую аватарку только если текущая была автогенерированной
    const newAvatar = isAutoGeneratedAvatar
      ? `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
      : currentUser.avatar;

    const response = await this.update(userId, {
      firstName,
      lastName,
      avatar: newAvatar,
    });
    return response.data;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const response = await this.update(userId, {
      avatar: avatarUrl,
    });
    return response.data;
  }
}

export const usersApi = new UsersApi();
