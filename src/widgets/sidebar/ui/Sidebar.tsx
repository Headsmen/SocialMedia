import { IconUsers, IconMessage, IconMusic } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebarScroll } from "../model/useSidebarScroll";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  withHeader?: boolean;
}

export const Sidebar = ({ withHeader = true }: SidebarProps) => {
  const location = useLocation();
  const { sidebarTop, sidebarHeight, borderOpacity } = useSidebarScroll();

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
    <aside
      className={`${styles.sidebar} ${!withHeader ? styles.fullHeight : ""}`}
      style={{
        top: `${sidebarTop}px`,
        height: sidebarHeight,
        borderRightColor: `rgba(137, 137, 137, ${borderOpacity})`,
      }}
    >
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
