import { Loader, Text, Stack, Button, Group, Card, Badge } from '@mantine/core';
import { IconBell, IconCheck, IconTrash } from '@tabler/icons-react';
import { formatRelativeTime } from '@/shared/lib/utils';
import { useNotificationsWidget } from '../model/useNotificationsWidget';

export function NotificationsWidget() {
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    getNotificationIcon,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
  } = useNotificationsWidget();

  return (
    <>
      <Group justify="space-between" mb="md">
        <div>
          <h2>Уведомления</h2>
          {unreadCount > 0 && (
            <Text c="dimmed" size="sm">
              {unreadCount} непрочитанных
            </Text>
          )}
        </div>
        {notifications && notifications.length > 0 && unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="light"
            leftSection={<IconCheck size={16} />}
            loading={isMarkingAllAsRead}
          >
            Отметить все как прочитанные
          </Button>
        )}
      </Group>

      {isLoading && (
        <Stack align="center" mt="xl">
          <Loader size="lg" />
          <Text>Загрузка уведомлений...</Text>
        </Stack>
      )}

      {error && (
        <Text c="red" mt="md">
          Ошибка загрузки уведомлений
        </Text>
      )}

      {!isLoading && !error && (!notifications || notifications.length === 0) && (
        <Stack align="center" mt="xl" gap="md">
          <IconBell size={64} color="gray" />
          <Text c="dimmed" size="lg">
            У вас пока нет уведомлений
          </Text>
        </Stack>
      )}

      {notifications && notifications.length > 0 && (
        <Stack gap="md">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: notification.isRead ? 'transparent' : '#f0f7ff',
                borderLeft: notification.isRead ? undefined : '4px solid #1976d2',
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" style={{ flex: 1 }}>
                  <div style={{ color: notification.isRead ? '#666' : '#1976d2' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Text fw={notification.isRead ? 400 : 600} size="sm">
                        {notification.message}
                      </Text>
                      {!notification.isRead && (
                        <Badge size="xs" color="blue">
                          Новое
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">
                      {formatRelativeTime(notification.createdAt)}
                    </Text>
                  </div>
                </Group>

                <Group gap="xs" wrap="nowrap">
                  {!notification.isRead && (
                    <Button
                      size="compact-sm"
                      variant="subtle"
                      onClick={() => handleMarkAsRead(notification.id!)}
                      loading={isMarkingAsRead}
                      title="Отметить как прочитанное"
                    >
                      <IconCheck size={16} />
                    </Button>
                  )}
                  <Button
                    size="compact-sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(notification.id!)}
                    loading={isDeleting}
                    title="Удалить"
                  >
                    <IconTrash size={16} />
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
}
