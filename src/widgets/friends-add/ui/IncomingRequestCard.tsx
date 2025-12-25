import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { UserCard } from '@/shared/ui/UserCard';
import { useRequestActions } from '../model/useRequestActions';
import styles from './FriendsAddForm.module.scss';

interface IncomingRequestCardProps {
  senderEmail: string;
  senderName: string;
  senderAvatar: string;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  className?: string;
}

export const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({
  senderEmail,
  senderName,
  senderAvatar,
  onAccept,
  onReject,
  className = '',
}) => {
  const { handleAccept, handleReject, isAccepting, isRejecting, isProcessed } = useRequestActions({
    onAccept,
    onReject,
  });

  if (isProcessed) {
    return null;
  }

  return (
    <div className={`${styles.friendRequestForm} ${className}`}>
      <UserCard
        user={{
          name: senderName,
          email: senderEmail,
          avatar: senderAvatar,
        }}
        actions={
          <Group gap="xs">
            <ActionIcon
              color="red"
              variant="filled"
              onClick={handleReject}
              loading={isRejecting}
              disabled={isAccepting || isRejecting}
              title="Отклонить"
            >
              <IconX size={16} />
            </ActionIcon>
            <ActionIcon
              color="green"
              variant="filled"
              onClick={handleAccept}
              loading={isAccepting}
              disabled={isAccepting || isRejecting}
              title="Принять"
            >
              <IconCheck size={16} />
            </ActionIcon>
          </Group>
        }
      />
    </div>
  );
};
