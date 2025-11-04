import { IconUsers, IconMessage, IconMusic } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  withHeader?: boolean;
}

export const Sidebar = ({ withHeader = true }: SidebarProps) => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const headerHeight = 73;

      const progress = Math.min(scrollTop / headerHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    // Вызываем сразу для начального состояния
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const sidebarTop = 73 - scrollProgress * 73;
  const sidebarHeight = `calc(100vh - ${73 - scrollProgress * 73}px)`;

  // Вычисляем прозрачность границы: от 0.1 до 1
  const borderOpacity = 0.1 + scrollProgress * 0.9;

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
