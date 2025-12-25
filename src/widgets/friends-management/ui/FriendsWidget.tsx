import { FriendsAddForm } from "@/widgets/friends-add/ui/FriendsAddForm";
import { IncomingRequestCard } from "@/widgets/friends-add/ui/IncomingRequestCard";
import { FriendCard } from "@/widgets/friends-add/ui/FriendCard";
import { Loader, Text, Stack, Button, Group, Divider } from "@mantine/core";
import { useFriendsWidget } from "../model/useFriendsWidget";

export function FriendsWidget() {
  const {
    users,
    isLoading,
    error,
    incomingRequestUsers,
    friendUsers,
    incomingLoading,
    friendsLoading,
    handleRefresh,
    handleCopyData,
    handleAddFriend,
    isRequestSent,
    handleAcceptRequest,
    handleRejectRequest,
  } = useFriendsWidget();

  return (
    <>
      <Group justify="space-between" mb="md">
        <h2>Друзья</h2>
        <Group gap="sm">
          <Button onClick={handleCopyData} variant="outline" color="gray">
            Скопировать данные
          </Button>
          <Button onClick={handleRefresh} loading={isLoading || incomingLoading || friendsLoading} variant="light">
            Обновить
          </Button>
        </Group>
      </Group>

      {/* Секция входящих запросов */}
      {incomingRequestUsers && incomingRequestUsers.length > 0 && (
        <>
          <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Входящие запросы в друзья</h3>
          <Stack gap="md" mb="xl">
            {incomingRequestUsers.map((sender) => (
              <IncomingRequestCard
                key={sender.email}
                senderEmail={sender.email}
                senderName={`${sender.firstName} ${sender.lastName}`}
                senderAvatar={sender.avatar || `https://ui-avatars.com/api/?name=${sender.firstName}+${sender.lastName}&background=random`}
                onAccept={async () => {
                  await handleAcceptRequest(sender.email);
                }}
                onReject={async () => {
                  await handleRejectRequest(sender.email);
                }}
              />
            ))}
          </Stack>
          <Divider my="lg" />
        </>
      )}

      {/* Секция друзей */}
      {friendUsers && friendUsers.length > 0 && (
        <>
          <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Мои друзья</h3>
          <Stack gap="md" mb="xl">
            {friendUsers.map((friend) => (
              <FriendCard
                key={friend.email}
                friendEmail={friend.email}
                friendName={`${friend.firstName} ${friend.lastName}`}
                friendAvatar={friend.avatar || `https://ui-avatars.com/api/?name=${friend.firstName}+${friend.lastName}&background=random`}
              />
            ))}
          </Stack>
          <Divider my="lg" />
        </>
      )}

      {/* Секция возможных друзей */}
      <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Возможные друзья</h3>

      {isLoading && (
        <Stack align="center" mt="xl">
          <Loader size="lg" />
          <Text>Загрузка пользователей...</Text>
        </Stack>
      )}

      {error && (
        <Text c="red" mt="md">
          Ошибка загрузки пользователей: {error.message}
        </Text>
      )}

      {!isLoading && !error && users && users.length === 0 && (
        <Text c="dimmed" mt="md">
          Нет доступных пользователей для добавления в друзья
        </Text>
      )}

      {users && users.length > 0 && (
        <Stack mt="md" gap="md">
          {users.map((potentialFriend) => (
            <FriendsAddForm
              key={potentialFriend.id}
              friend={{
                id: potentialFriend.id || "",
                userId: potentialFriend.email,
                fullName: `${potentialFriend.firstName} ${potentialFriend.lastName}`,
                avatar: potentialFriend.avatar || `https://ui-avatars.com/api/?name=${potentialFriend.firstName}+${potentialFriend.lastName}&background=random`,
                addFriend: "",
              }}
              onSubmit={async () => {
                await handleAddFriend(potentialFriend.email);
              }}
              isRequestSent={isRequestSent(potentialFriend.email)}
            />
          ))}
        </Stack>
      )}
    </>
  );
}
