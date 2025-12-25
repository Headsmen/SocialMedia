import { Group, Avatar, Text, Stack } from '@mantine/core';
import { handleAvatarError } from '@/shared/lib/utils/imageErrorHandler';
import type { ReactNode } from 'react';
import styles from './UserCard.module.scss';

export interface UserCardData {
  name: string;
  email: string;
  avatar?: string;
  subtitle?: string;
}

interface UserCardProps {
  user: UserCardData;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const UserCard = ({ user, actions, onClick, className }: UserCardProps) => {
  return (
    <Group
      className={`${styles.card} ${className || ''}`}
      justify="space-between"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Group>
        <Avatar
          src={user.avatar}
          alt={user.name}
          radius="xl"
          size="md"
          onError={handleAvatarError}
        />
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            {user.name}
          </Text>
          <Text size="xs" c="dimmed">
            {user.subtitle || user.email}
          </Text>
        </Stack>
      </Group>
      {actions && <Group gap="xs">{actions}</Group>}
    </Group>
  );
};
