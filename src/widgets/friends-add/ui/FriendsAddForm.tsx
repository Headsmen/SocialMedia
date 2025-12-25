import React from "react";
import { type FriendsForm } from "../model/types";
import { useFriendRequestSubmit } from "../model/useFriendRequestSubmit";
import styles from "./FriendsAddForm.module.scss";

interface FriendRequestFormProps {
  friend: FriendsForm;
  onSubmit?: () => Promise<void>;
  isRequestSent?: boolean;
  className?: string;
}

export const FriendsAddForm: React.FC<FriendRequestFormProps> = ({
  friend,
  onSubmit,
  isRequestSent = false,
  className = "",
}) => {
  const { isLoading, handleAddFriend, handleImageError } = useFriendRequestSubmit({
    onSubmit,
    isRequestSent,
  });

  return (
    <div className={`${styles.friendRequestForm} ${isRequestSent ? styles.requestSent : ''} ${className}`} id={friend.id}>
      <div className={styles.header}>
        <img
          src={friend.avatar}
          alt={friend.fullName}
          className={styles.avatar}
          onError={handleImageError}
        />

        <div className={styles.addFriendInfo}>
          <div className={styles.info}>
            <h3 className={styles.name}>{friend.fullName}</h3>
            
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleAddFriend}
            disabled={isLoading || isRequestSent}
            className={`${styles.button} ${
              isRequestSent ? styles["button--added"] : ""
            }`}
          >
            {isLoading ? (
              <span className={styles.buttonLoading}>
                <span className={styles.spinner}></span>
              </span>
            ) : isRequestSent ? (
              <span>✓</span>
            ) : (
              <span>+{friend.addFriend || ""}</span>
            )}
          </button>
        </div>
      </div>
      {isRequestSent && (
        <div className={styles.success}>
          ✓ Заявка отправлена. Ожидается принятие.
        </div>
      )}
    </div>
  );
};
