import { Stack, Text, Loader, Center } from '@mantine/core';
import { ChatCard } from '@/widgets/chat-card';
import { useChatsList } from '../model/useChatsList';

export function ChatsList() {
  const { chats, isLoading, error, handleChatClick } = useChatsList();

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={200}>
        <Text c="red">Ошибка загрузки чатов</Text>
      </Center>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <Center h={200}>
        <Text c="dimmed">Нет активных чатов</Text>
      </Center>
    );
  }

  return (
    <Stack gap="xs">
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          userName={chat.userName}
          userAvatar={chat.userAvatar}
          lastMessage={chat.lastMessage}
          lastMessageTime={chat.lastMessageTime}
          unreadCount={chat.unreadCount}
          isOnline={chat.isOnline}
          onClick={() => handleChatClick(chat.email)}
        />
      ))}
    </Stack>
  );
}
