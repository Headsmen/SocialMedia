import { IconBell, IconUser, IconLogout2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Badge } from "@mantine/core";
import { useHeaderActions } from "./model/useHeaderActions";
import styles from "./Header.module.scss";

export const Header = () => {
  const { unreadCount, unreadBadgeText, handleLogout, isActiveRoute } = useHeaderActions();

  return (
    <header className={styles.header}>
      <div className={styles.BtnLogOutAndLogo}>
        <button className={styles.iconButton} onClick={handleLogout}>
          <IconLogout2 />
        </button>
        <Link to="/profile">
          <button className={styles.iconButton}>
            <IconUser />
          </button>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/">
          <p
            className={`${styles.navItem} ${
              isActiveRoute("/") ? styles.active : ""
            }`}
          >
            Новости
          </p>
        </Link>

        <Link to="/interesting">
          <p
            className={`${styles.navItem} ${
              isActiveRoute("/interesting") ? styles.active : ""
            } `}
          >
            Интересное
          </p>
        </Link>
      </nav>

      <div className={styles.actions}>
        <Link to="/notification" style={{ position: 'relative', display: 'inline-block' }}>
          <button className={styles.iconButton}>
            <IconBell stroke={2} />
          </button>
          {unreadCount > 0 && (
            <Badge
              size="sm"
              circle
              color="red"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                minWidth: 20,
                height: 20,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadBadgeText}
            </Badge>
          )}
        </Link>
      </div>
    </header>
  );
};
