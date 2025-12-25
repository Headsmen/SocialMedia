import { Card, Avatar, Text, Group, Badge, Stack } from '@mantine/core';
import { formatRelativeTime } from '@/shared/lib/utils';
import type { ChatCardProps } from '../model/types';
import styles from './ChatCard.module.scss';

export function ChatCard({
  userName,
  userAvatar,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isOnline = false,
  onClick,
}: ChatCardProps) {
  const timeAgo = lastMessageTime ? formatRelativeTime(lastMessageTime) : null;

  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      className={styles.chatCard}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Group wrap="nowrap">
        <div style={{ position: 'relative' }}>
          <Avatar src={userAvatar} size="lg" radius="xl" />
          {isOnline && (
            <div
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                backgroundColor: '#40c057',
                border: '2px solid white',
                borderRadius: '50%',
              }}
            />
          )}
        </div>

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={500} size="sm" truncate>
              {userName}
            </Text>
            {timeAgo && (
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                {timeAgo}
              </Text>
            )}
          </Group>

          <Group justify="space-between" wrap="nowrap">
            <Text
              size="sm"
              c="dimmed"
              truncate
              style={{ flex: 1 }}
            >
              {lastMessage || 'Нет сообщений'}
            </Text>
            {unreadCount > 0 && (
              <Badge size="sm" circle color="red">
                {unreadCount}
              </Badge>
            )}
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
