import { IconUsers, IconMessage, IconMusic } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  withHeader?: boolean;
}

export const Sidebar = ({ withHeader = true }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      icon: IconUsers,
      label: "Друзья",
      path: "/friends",
    },
    {
      icon: IconMessage,
      label: "Чат",
      path: "/chat",
    },
    {
      icon: IconMusic,
      label: "Музыка",
      path: "/music",
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${!withHeader ? styles.fullHeight : ""}`}>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
            >
              <Icon className={styles.icon} stroke={1.5} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
