import { Stack, Loader, Text, Button, Box, ScrollArea } from '@mantine/core';
import { MessageBubble } from './MessageBubble';
import { useMessages } from '@/entities/chat';
import type { Message } from '@/entities/chat';
import { useMessageListScroll } from '../model/useMessageListScroll';
import styles from './MessageList.module.scss';

interface MessageListProps {
  chatId: string;
  currentUserId: string;
}

export const MessageList = ({ chatId, currentUserId }: MessageListProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(chatId);
  const messages = data?.messages || [];

  const { scrollRef } = useMessageListScroll({ messages, currentUserId });

  if (isLoading) {
    return (
      <Box className={styles.centered}>
        <Loader />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box className={styles.centered}>
        <Text c="dimmed">Нет сообщений. Начните общение!</Text>
      </Box>
    );
  }

  return (
    <ScrollArea className={styles.scrollArea} viewportRef={scrollRef}>
      <Stack gap="xs" className={styles.messageStack}>
        {hasNextPage && (
          <Box style={{ textAlign: 'center', padding: '10px' }}>
            <Button
              variant="subtle"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              size="sm"
            >
              Загрузить старые сообщения
            </Button>
          </Box>
        )}
        {messages.map((message: Message, index: number) => {
          const isOwn = message.senderId === currentUserId;
          const prevMessage = messages[index - 1];
          const showSender = !prevMessage || prevMessage.senderId !== message.senderId;

          return (
            <MessageBubble
              key={message.id || message.tempId}
              message={message}
              isOwn={isOwn}
              showSender={showSender}
            />
          );
        })}
      </Stack>
    </ScrollArea>
  );
};
