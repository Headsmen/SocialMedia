import { Link } from "react-router-dom";
import type { Icon } from "@tabler/icons-react";

export interface NavItemConfig {
  path: string;
  label: string;
  icon?: Icon;
  isActive?: boolean;
  styles?: {
    navItem?: string;
    active?: string;
    icon?: string;
    label?: string;
  };
}

export class NavigationFactory {
  static createNavLink(config: NavItemConfig) {
    const { path, label, isActive, styles } = config;

    return (
      <Link key={path} to={path}>
        <p
          className={`${styles?.navItem || ""} ${
            isActive ? styles?.active || "" : ""
          }`}
        >
          {label}
        </p>
      </Link>
    );
  }

  static createSidebarLink(config: NavItemConfig) {
    const { path, label, icon: Icon, isActive, styles } = config;

    return (
      <Link
        key={path}
        to={path}
        className={`${styles?.navItem || ""} ${
          isActive ? styles?.active || "" : ""
        }`}
      >
        {Icon && <Icon className={styles?.icon} stroke={1.5} />}
        <span className={styles?.label}>{label}</span>
      </Link>
    );
  }

  static createNavGroup(items: NavItemConfig[], type: "header" | "sidebar") {
    if (type === "header") {
      return items.map((item) => this.createNavLink(item));
    }
    return items.map((item) => this.createSidebarLink(item));
  }
}
