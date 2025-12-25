import { Box, Text, Group } from '@mantine/core';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { MessageBubbleProps } from '../model/types';
import styles from './MessageBubble.module.scss';

export const MessageBubble = ({ message, isOwn, senderName, showSender }: MessageBubbleProps) => {
  const formattedTime = format(new Date(message.createdAt), 'HH:mm', { locale: ru });

  return (
    <Box className={`${styles.messageWrapper} ${isOwn ? styles.own : styles.other}`}>
      {showSender && !isOwn && senderName && (
        <Text size="xs" c="dimmed" mb={4} className={styles.senderName}>
          {senderName}
        </Text>
      )}
      <Box className={`${styles.bubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}>
        <Text className={styles.content}>{message.content}</Text>
        <Group gap={4} className={styles.meta} justify="flex-end">
          <Text size="xs" className={styles.time}>
            {formattedTime}
          </Text>
          {isOwn && (
            <Text size="xs" >
              {message.isRead ? '✓✓' : '✓'}
            </Text>
          )}
        </Group>
      </Box>
    </Box>
  );
};
