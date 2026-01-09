import { modals } from '@mantine/modals';
import { UserForm } from './ui/UserForm';
import { PostForm } from './ui/PostForm';
import type { UserFormData, PostFormData, FormMode } from './model/types';
import type { ReactNode } from 'react';

interface OpenModalOptions<T> {
  initialData?: T;
  mode?: FormMode;
}

interface OpenCustomModalOptions {
  title?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  withCloseButton?: boolean;
  fullScreen?: boolean;
}

export const useModals = () => {
  const openModal = (
    content: ReactNode,
    options?: OpenCustomModalOptions
  ) => {
    modals.open({
      title: options?.title,
      size: options?.size || 'md',
      centered: options?.centered ?? true,
      closeOnClickOutside: options?.closeOnClickOutside ?? true,
      closeOnEscape: options?.closeOnEscape ?? true,
      withCloseButton: options?.withCloseButton ?? true,
      fullScreen: options?.fullScreen ?? false,
      children: content,
    });
  };

  const openUserModal = (
    onSubmit: (data: UserFormData) => Promise<void>,
    options?: OpenModalOptions<UserFormData>
  ) => {
    const mode = options?.mode || 'edit';
    openModal(
      <UserForm
        initialData={options?.initialData}
        onSubmit={onSubmit}
        mode={mode}
      />,
      {
        title: mode === 'create' ? 'Создать пользователя' : 'Редактировать профиль',
      }
    );
  };

  const openPostModal = (
    onSubmit: (data: PostFormData) => Promise<void>,
    options?: OpenModalOptions<PostFormData>
  ) => {
    const mode = options?.mode || 'create';
    openModal(
      <PostForm
        initialData={options?.initialData}
        onSubmit={onSubmit}
        mode={mode}
      />,
      {
        title: mode === 'create' ? 'Создать пост' : 'Редактировать пост',
        size: 'lg',
      }
    );
  };

  // Закрыть все модалки
  const closeAllModals = () => {
    modals.closeAll();
  };

  // Backward compatibility
  const openUserEditModal = (
    initialData: UserFormData,
    onSubmit: (data: UserFormData) => Promise<void>
  ) => {
    openUserModal(onSubmit, { initialData, mode: 'edit' });
  };

  return {
    openModal,
    openUserModal,
    openPostModal,
    closeAllModals,
    openUserEditModal, // deprecated, use openUserModal
  };
};

// Re-export types
export type { UserFormData, PostFormData, FormMode } from './model/types';
