import { IconBell } from "@tabler/icons-react";
import styles from "./Header.module.scss";
import { IconUser, IconLogout2 } from "@tabler/icons-react";
import { useAuthStore } from "../../../shared/store/auth-store";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const logout = useAuthStore((state) => state.logout);

  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.BtnLogOutAndLogo}>
        <button className={styles.iconButton} onClick={logout}>
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
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Новости
          </p>
        </Link>

        <Link to="/interesting">
          <p
            className={`${styles.navItem} ${
              location.pathname === "/interesting" ? styles.active : ""
            } `}
          >
            Интересное
          </p>
        </Link>
      </nav>

      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <IconBell stroke={2} />
        </button>
      </div>
    </header>
  );
};
