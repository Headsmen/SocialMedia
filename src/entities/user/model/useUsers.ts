import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type User } from '../api/users-api';
import { userKeys } from '../model/userKeys';

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: userKeys.all,
    queryFn: usersApi.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const usePotentialFriends = (currentUserEmail?: string) => {
  return useQuery<User[], Error>({
    queryKey: userKeys.potentialFriends(currentUserEmail),
    queryFn: async () => {
      if (!currentUserEmail) return [];

      const users = await usersApi.getAllUsers();
      const currentUser = await usersApi.getUserByEmail(currentUserEmail);

      if (!currentUser) return [];

      const friends = currentUser.Friends || [];
      const incomingRequests = currentUser.IncomingRequests || [];

      return users.filter(user =>
        user.email !== currentUserEmail &&
        !friends.includes(user.email) &&
        !incomingRequests.includes(user.email)
      );
    },
    staleTime: 0,
    enabled: !!currentUserEmail,
  });
};

export const useUserByEmail = (email?: string) => {
  return useQuery<User | undefined, Error>({
    queryKey: userKeys.byEmail(email),
    queryFn: () => usersApi.getUserByEmail(email!),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUsersByEmails = (emails?: string[]) => {
  return useQuery<User[], Error>({
    queryKey: userKeys.byEmails(emails),
    queryFn: async () => {
      if (!emails || emails.length === 0) return [];

      const usersPromises = emails.map(email => usersApi.getUserByEmail(email));
      const users = await Promise.all(usersPromises);
      return users.filter((u): u is User => u !== undefined);
    },
    enabled: !!emails && emails.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUsersByIds = (ids?: string[]) => {
  return useQuery<User[], Error>({
    queryKey: ['users', 'byIds', ids],
    queryFn: async () => {
      if (!ids || ids.length === 0) return [];

      const usersPromises = ids.map(id => usersApi.getUserById(id));
      const users = await Promise.all(usersPromises);
      return users.filter((u): u is User => u !== undefined);
    },
    enabled: !!ids && ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, firstName, lastName }: { userId: string; firstName: string; lastName: string }) =>
      usersApi.updateUserName(userId, firstName, lastName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, avatarUrl }: { userId: string; avatarUrl: string }) =>
      usersApi.updateAvatar(userId, avatarUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
