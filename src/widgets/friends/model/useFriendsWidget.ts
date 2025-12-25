import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  usePotentialFriends,
  useAuthStore,
  userKeys,
  useSendFriendRequest,
  useSentFriendRequests,
  useIncomingFriendRequests,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useFriends,
  useUsers,
  useUsersByEmails,
} from '@/entities/user';

export const useFriendsWidget = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: users, isLoading, error, refetch } = usePotentialFriends(user?.email);
  const { data: allUsers } = useUsers();
  const sendFriendRequest = useSendFriendRequest();
  const { data: sentRequests } = useSentFriendRequests(user?.email);
  const { data: incomingRequests, isLoading: incomingLoading } = useIncomingFriendRequests(user?.email);
  const { data: friends, isLoading: friendsLoading } = useFriends(user?.email);
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();

  const { data: incomingRequestUsers } = useUsersByEmails(incomingRequests);
  const { data: friendUsers } = useUsersByEmails(friends);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
    refetch();
  }, [queryClient, refetch]);

  const handleCopyData = useCallback(async () => {
    try {
      if (!allUsers) {
        alert('Данные пользователей еще загружаются');
        return;
      }
      const jsonData = JSON.stringify(allUsers, null, 2);
      await navigator.clipboard.writeText(jsonData);
      alert('Данные скопированы в буфер обмена!');
    } catch (error) {
      alert('Ошибка при копировании данных');
    }
  }, [allUsers]);

  const handleAddFriend = useCallback(
    async (friendEmail: string) => {
      if (!user) return;

      try {
        await sendFriendRequest.mutateAsync({
          fromUserId: user.id,
          toUserEmail: friendEmail,
        });
      } catch (error) {
        // Error handled by mutation
      }
    },
    [user, sendFriendRequest]
  );

  const isRequestSent = useCallback(
    (userEmail: string) => {
      return sentRequests?.includes(userEmail) || false;
    },
    [sentRequests]
  );

  const handleAcceptRequest = useCallback(
    async (senderEmail: string) => {
      if (!user) return;

      try {
        await acceptRequest.mutateAsync({
          userId: user.id,
          senderEmail,
        });
      } catch (error) {
        // Error handled by mutation
      }
    },
    [user, acceptRequest]
  );

  const handleRejectRequest = useCallback(
    async (senderEmail: string) => {
      if (!user) return;

      try {
        await rejectRequest.mutateAsync({
          userId: user.id,
          senderEmail,
        });
      } catch (error) {
        // Error handled by mutation
      }
    },
    [user, rejectRequest]
  );

  return {
    users,
    isLoading,
    error,
    incomingRequestUsers,
    friendUsers,
    incomingLoading,
    friendsLoading,
    handleRefresh,
    handleCopyData,
    handleAddFriend,
    isRequestSent,
    handleAcceptRequest,
    handleRejectRequest,
  };
};
