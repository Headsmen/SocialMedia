import { ActionIcon, Title, Group, Avatar, Text, Box, Stack, Indicator } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MessageList } from '@/widgets/message-list';
import { MessageInput } from '@/widgets/message-input';
import { useChatDialog } from '../model/useChatDialog';
import { useNavigate } from 'react-router-dom';
import styles from './ChatDialogWidget.module.scss';

export function ChatDialogWidget() {
  const navigate = useNavigate();
  const {
    user,
    currentUser,
    isLoading,
    chatId,
    isOnline,
    isUserTyping,
    handleSendMessage,
    handleBack,
  } = useChatDialog();

  const handleProfileClick = () => {
    if (user?.email) {
      navigate(`/profile/${user.email}`);
    }
  };

  if (isLoading) {
    return <Text>Загрузка...</Text>;
  }

  if (!user || !currentUser) {
    return <Text>Пользователь не найден</Text>;
  }

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Group className={styles.header} gap="md" p="md">
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={handleBack}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>

        <Indicator
          inline
          size={12}
          offset={7}
          position="bottom-end"
          color={isOnline ? 'green' : 'gray'}
          disabled={!isOnline}
        >
          <Avatar
            src={user.avatar}
            size="md"
            radius="xl"
            style={{ cursor: 'pointer' }}
            onClick={handleProfileClick}
          />
        </Indicator>

        <Stack gap={0} style={{ cursor: 'pointer' }} onClick={handleProfileClick}>
          <Title order={3}>{`${user.firstName} ${user.lastName}`}</Title>
          {isUserTyping && (
            <Text size="sm" c="dimmed">печатает...</Text>
          )}
          {!isUserTyping && isOnline && (
            <Text size="sm" c="green">онлайн</Text>
          )}
        </Stack>
      </Group>

      {/* Messages */}
      <Box className={styles.messagesContainer}>
        <MessageList chatId={chatId} currentUserId={currentUser.id} />
      </Box>

      {/* Input */}
      <Box className={styles.inputContainer}>
        <MessageInput chatId={chatId} onSend={handleSendMessage} />
      </Box>
    </Box>
  );
}
