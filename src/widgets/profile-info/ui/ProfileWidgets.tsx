import { Paper, Button, Loader, Center, Text, Group, ActionIcon, Stack, Indicator } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { AvatarUpload } from './AvatarUpload';
import { useProfileWidget } from '../model/useProfileWidget';

interface ProfileWidgetsProps {
  userEmail?: string;
}

function ProfileWidgets({ userEmail }: ProfileWidgetsProps) {
  const {
    profileUser,
    isLoading,
    isOwnProfile,
    avatar,
    handleMessageClick,
    handleEditClick,
    handleAvatarUpload,
  } = useProfileWidget({ userEmail });

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!profileUser) {
    return (
      <Center h={200}>
        <Text c="dimmed">Пользователь не найден</Text>
      </Center>
    );
  }

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <Group wrap="nowrap" gap="md">
        <Indicator
          inline
          size={12}
          offset={7}
          position="bottom-end"
          color="green"
          disabled={false}
        >
          <AvatarUpload
            avatar={avatar}
            name={`${profileUser.firstName} ${profileUser.lastName}`}
            size={120}
            onUpload={handleAvatarUpload}
            editable={isOwnProfile}
          />
        </Indicator>

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text size="lg" fw={600} style={{ wordBreak: 'break-word' }}>
            {`${profileUser.firstName} ${profileUser.lastName}`}
          </Text>

          <Text size="sm" c="dimmed" style={{ wordBreak: 'break-all' }}>
            {profileUser.email}
          </Text>
        </Stack>

        {!isOwnProfile ? (
          <Button
            size="md"
            variant="filled"
            onClick={handleMessageClick}
          >
            Написать
          </Button>
        ) : (
          <ActionIcon
            size="lg"
            variant="subtle"
            onClick={handleEditClick}
            title="Редактировать профиль"
          >
            <IconPencil size={20} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
}

export default ProfileWidgets;
