import { modals } from '@mantine/modals';
import { UserForm } from './ui/UserForm';
import { PostForm } from './ui/PostForm';
import type { UserFormData, PostFormData, FormMode } from './model/types';

interface OpenModalOptions<T> {
  initialData?: T;
  mode?: FormMode;
}

export const useModals = () => {
  const openUserModal = (
    onSubmit: (data: UserFormData) => Promise<void>,
    options?: OpenModalOptions<UserFormData>
  ) => {
    const mode = options?.mode || 'edit';
    modals.open({
      title: mode === 'create' ? 'Создать пользователя' : 'Редактировать профиль',
      centered: true,
      children: (
        <UserForm
          initialData={options?.initialData}
          onSubmit={onSubmit}
          mode={mode}
        />
      ),
    });
  };

  const openPostModal = (
    onSubmit: (data: PostFormData) => Promise<void>,
    options?: OpenModalOptions<PostFormData>
  ) => {
    const mode = options?.mode || 'create';
    modals.open({
      title: mode === 'create' ? 'Создать пост' : 'Редактировать пост',
      centered: true,
      size: 'lg',
      children: (
        <PostForm
          initialData={options?.initialData}
          onSubmit={onSubmit}
          mode={mode}
        />
      ),
    });
  };

  // Backward compatibility
  const openUserEditModal = (
    initialData: UserFormData,
    onSubmit: (data: UserFormData) => Promise<void>
  ) => {
    openUserModal(onSubmit, { initialData, mode: 'edit' });
  };

  return {
    openUserModal,
    openPostModal,
    openUserEditModal, // deprecated, use openUserModal
  };
};

// Re-export types
export type { UserFormData, PostFormData, FormMode } from './model/types';
