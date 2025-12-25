import { chatApi as api } from '@/shared/api/config/axiosInstance';
import { BaseCrudApi } from '../factories/BaseCrudApi';

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface GetChatsResponse {
  data: Chat[];
  total: number;
}

export interface GetMessagesResponse {
  data: Message[];
  total: number;
  hasMore: boolean;
}

export interface GetMessagesParams {
  chatId: string;
  page?: number;
  limit?: number;
}

export interface SendMessageParams {
  chatId: string;
  content: string;
}

export interface CreateChatParams {
  participantIds: string[];
}

export interface MarkAsReadParams {
  chatId: string;
  messageIds: string[];
}

class ChatApi extends BaseCrudApi<Chat, CreateChatParams> {
  constructor() {
    super(api, '/chats');
  }

  async getChats(): Promise<GetChatsResponse> {
    const response = await this.getAll();
    return {
      data: response.data,
      total: response.data.length,
    };
  }

  async getChatById(chatId: string): Promise<Chat> {
    const response = await this.getById(chatId);
    return response.data;
  }

  async getMessages({
    chatId,
    page = 1,
    limit = 50,
  }: GetMessagesParams): Promise<GetMessagesResponse> {
    const response = await this.api.get<GetMessagesResponse>(
      `${this.endpoint}/${chatId}/messages`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  async sendMessage({ chatId, content }: SendMessageParams): Promise<Message> {
    const response = await this.api.post<Message>(`${this.endpoint}/${chatId}/messages`, {
      content,
    });
    return response.data;
  }

  async createChat(params: CreateChatParams): Promise<Chat> {
    const response = await this.create(params);
    return response.data;
  }

  async markMessagesAsRead(params: MarkAsReadParams): Promise<void> {
    await this.api.patch(`${this.endpoint}/${params.chatId}/messages/read`, {
      messageIds: params.messageIds,
    });
  }

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${chatId}/messages/${messageId}`);
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.delete(chatId);
  }

  async findOrCreateChatWithUser(userId: string): Promise<Chat> {
    const response = await this.api.post<Chat>(`${this.endpoint}/find-or-create`, {
      userId,
    });
    return response.data;
  }
}

export const chatApi = new ChatApi();
