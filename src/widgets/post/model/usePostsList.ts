import { usePosts, useDeletePost, useToggleLike } from '@/entities/post';
import { useUsersByIds, useAuthStore } from '@/entities/user';
import { notifications } from '@mantine/notifications';

export const usePostsList = () => {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const deletePostMutation = useDeletePost();
  const toggleLikeMutation = useToggleLike();
  const currentUser = useAuthStore((state) => state.user);

  const userIds = posts ? [...new Set(posts.map((post) => post.userId))] : [];
  const { data: users } = useUsersByIds(userIds);

  const handleDelete = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      notifications.show({
        title: 'Успех',
        message: 'Пост удален',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить пост',
        color: 'red',
      });
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser?.id) {
      notifications.show({
        title: 'Ошибка',
        message: 'Необходимо авторизоваться',
        color: 'red',
      });
      return;
    }

    try {
      await toggleLikeMutation.mutateAsync({
        postId,
        userId: currentUser.id,
      });
    } catch (err) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось поставить лайк',
        color: 'red',
      });
    }
  };

  const postsWithAuthors = posts?.map((post) => {
    const author = users?.find((user) => user.id === post.userId);
    return {
      post,
      authorName: author ? `${author.firstName} ${author.lastName}` : undefined,
      authorAvatar: author?.avatar,
      authorEmail: author?.email,
    };
  });

  return {
    posts: postsWithAuthors,
    isLoading,
    error,
    handleDelete,
    handleLike,
    refetch,
  };
};
