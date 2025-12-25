import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FriendsAddForm.module.scss";
import { IconMessage } from "@tabler/icons-react";
import { Avatar, IconButton, UserInfo } from "@/shared/ui";

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
      <div className={styles.header}>
        <Avatar
          src={friendAvatar}
          alt={friendName}
          fallbackName={friendName}
          size="md"
          onClick={handleProfileClick}
          className={styles.avatar}
        />

        <div className={styles.addFriendInfo}>
          <UserInfo
            name={friendName}
            subtitle={friendEmail}
            size="md"
            onClick={handleProfileClick}
          />
        </div>

        <div className={styles.actions}>
          <IconButton
            icon={<IconMessage />}
            onClick={handleChatClick}
            variant="success"
            size="md"
            title="Написать сообщение"
          />
        </div>
      </div>
    </div>
  );
};
