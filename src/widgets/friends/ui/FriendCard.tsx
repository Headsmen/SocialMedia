import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";
import styles from "./FriendsAddForm.module.scss";

interface FriendCardProps {
  friendEmail: string;
  friendName: string;
  friendAvatar: string;
  className?: string;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friendEmail,
  friendName,
  friendAvatar,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${friendEmail}`);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${friendEmail}`);
  };

  return (
    <div className={`${styles.friendRequestForm} ${className}`}>
      <Group justify="space-between" className={styles.header}>
        <Group gap="sm">
          <Avatar
            src={friendAvatar}
            alt={friendName}
            radius="xl"
            size="md"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />

          <Stack gap={4} onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <Text size="sm" fw={500}>
              {friendName}
            </Text>
            <Text size="xs" c="dimmed">
              {friendEmail}
            </Text>
          </Stack>
        </Group>

        <ActionIcon
          color="blue"
          variant="filled"
          onClick={handleChatClick}
          title="Написать сообщение"
          size="lg"
        >
          <IconMessage size={18} />
        </ActionIcon>
      </Group>
    </div>
  );
};
