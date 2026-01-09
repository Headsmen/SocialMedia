import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUserByEmail, useUpdateUserName, useUpdateAvatar } from '@/entities/user';
import { notifications } from '@mantine/notifications';
import { useModals } from '@/shared/lib/hooks/modals';

interface UseProfileWidgetProps {
  userEmail?: string;
}

export const useProfileWidget = ({ userEmail }: UseProfileWidgetProps) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { data: profileUser, isLoading } = useUserByEmail(userEmail || currentUser?.email);
  const updateUserName = useUpdateUserName();
  const updateAvatar = useUpdateAvatar();
  const { openUserEditModal } = useModals();

  const isOwnProfile = !userEmail || userEmail === currentUser?.email;

  const avatar = profileUser?.avatar ||
    `https://ui-avatars.com/api/?name=${profileUser?.firstName}+${profileUser?.lastName}&background=random`;

  const handleMessageClick = () => {
    if (profileUser?.email) {
      navigate(`/chat/${profileUser.email}`);
    }
  };

  const handleEditClick = () => {
    if (!profileUser) return;

    openUserEditModal(
      {
        firstName: profileUser.firstName,
        lastName: profileUser.lastName,
      },
      async (data) => {
        if (!profileUser.id) return;

        try {
          await updateUserName.mutateAsync({
            userId: profileUser.id,
            firstName: data.firstName,
            lastName: data.lastName,
          });

          notifications.show({
            title: 'Успешно',
            message: 'Имя успешно обновлено',
            color: 'green',
          });
        } catch (error) {
          notifications.show({
            title: 'Ошибка',
            message: 'Не удалось обновить имя',
            color: 'red',
          });
        }
      }
    );
  };

  const handleAvatarUpload = async (file: File) => {
    if (!profileUser?.id) return;

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        await updateAvatar.mutateAsync({
          userId: profileUser.id!,
          avatarUrl: compressedBase64,
        });

        notifications.show({
          title: 'Успешно',
          message: 'Аватар успешно обновлен',
          color: 'green',
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить аватар',
        color: 'red',
      });
    }
  };

  return {
    profileUser,
    isLoading,
    isOwnProfile,
    avatar,
    handleMessageClick,
    handleEditClick,
    handleAvatarUpload,
    isUpdating: updateUserName.isPending || updateAvatar.isPending,
  };
};
