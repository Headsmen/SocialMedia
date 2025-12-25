import { useModals, type PostFormData } from '@/shared/lib/hooks/useModals';
import { useCreatePost } from '@/entities/post';
import { useAuthStore } from '@/entities/user';
import { notifications } from '@mantine/notifications';

export const useFabBtn = () => {
  const createPostMutation = useCreatePost();
  const user = useAuthStore((state) => state.user);
  const { openPostModal } = useModals();

  const handleCreatePost = () => {
    openPostModal(
      async (data: PostFormData) => {
        if (!user?.id) {
          notifications.show({
            title: 'Ошибка',
            message: 'Необходимо авторизоваться',
            color: 'red',
          });
          return;
        }

        try {
          await createPostMutation.mutateAsync({
            content: data.content,
            imageUrl: data.imageUrl || undefined,
            userId: user.id,
          });

          notifications.show({
            title: 'Успех',
            message: 'Пост успешно создан',
            color: 'green',
          });
        } catch (error) {
          notifications.show({
            title: 'Ошибка',
            message: 'Не удалось создать пост',
            color: 'red',
          });
        }
      },
      { mode: 'create' }
    );
  };

  return {
    handleCreatePost,
  };
};
