import { api } from "@/shared/api/config/axiosInstance"

export interface FriendRequest {
  id?: string;
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  toUserId: string;
  toUserEmail: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const friendRequestsApi = {
  sendFriendRequest: async (data: Omit<FriendRequest, 'id' | 'status' | 'createdAt'>): Promise<FriendRequest> => {
    const response = await api.post<FriendRequest>('/FriendRequests', {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  getFriendRequests: async (userEmail: string): Promise<FriendRequest[]> => {
    const response = await api.get<FriendRequest[]>(`/FriendRequests?toUserEmail=${userEmail}`);
    return response.data;
  },

  getSentRequests: async (userEmail: string): Promise<FriendRequest[]> => {
    const response = await api.get<FriendRequest[]>(`/FriendRequests?fromUserEmail=${userEmail}`);
    return response.data;
  },

  checkRequestExists: async (fromEmail: string, toEmail: string): Promise<boolean> => {
    const response = await api.get<FriendRequest[]>(
      `/FriendRequests?fromUserEmail=${fromEmail}&toUserEmail=${toEmail}`
    );
    return response.data.length > 0;
  },

  acceptRequest: async (id: string): Promise<FriendRequest> => {
    const response = await api.patch<FriendRequest>(`/FriendRequests/${id}`, {
      status: 'accepted',
    });
    return response.data;
  },

  rejectRequest: async (id: string): Promise<FriendRequest> => {
    const response = await api.patch<FriendRequest>(`/FriendRequests/${id}`, {
      status: 'rejected',
    });
    return response.data;
  },
};
