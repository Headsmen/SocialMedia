import { Textarea, ActionIcon, Group, Box } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useMessageInput } from '../model/useMessageInput';
import type { MessageInputProps } from '../model/types';
import styles from './MessageInput.module.scss';

export const MessageInput = ({ chatId, onSend, disabled }: MessageInputProps) => {
  const { message, handleChange, handleSend, handleKeyDown } = useMessageInput({
    chatId,
    onSendMessage: onSend,
  });

  return (
    <Box className={styles.container}>
      <Group gap="sm" align="flex-end" className={styles.inputGroup}>
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение..."
          disabled={disabled}
          autosize
          minRows={1}
          maxRows={5}
          className={styles.textarea}
        />
        <ActionIcon
          size="lg"
          variant="filled"
          color="blue"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={styles.sendButton}
        >
          <IconSend size={20} />
        </ActionIcon>
      </Group>
    </Box>
  );
};
