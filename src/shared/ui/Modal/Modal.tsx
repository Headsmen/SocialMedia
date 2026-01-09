import { Modal as MantineModal } from '@mantine/core';
import type { ReactNode } from 'react';

export interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  withCloseButton?: boolean;
  overlayProps?: Record<string, unknown>;
  fullScreen?: boolean;
}

export function Modal({
  opened,
  onClose,
  title,
  children,
  size = 'md',
  centered = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  withCloseButton = true,
  overlayProps,
  fullScreen = false,
}: ModalProps) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      withCloseButton={withCloseButton}
      overlayProps={overlayProps}
      fullScreen={fullScreen}
    >
      {children}
    </MantineModal>
  );
}
