import type { ReactNode } from "react";
import { Header } from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";
import { FabBtn } from "../fab-btn/FabBtn";
import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFab?: boolean;
  centered?: boolean;
}

export const PageLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFab = false,
  centered = false,
}: PageLayoutProps) => {
  return (
    <div className={styles.pageLayout}>
      {showHeader && <Header />}
      {showSidebar && <Sidebar withHeader={showHeader} />}
      {showFab && <FabBtn />}

      <main
        className={`${styles.content} ${
          showSidebar ? styles.withSidebar : ""
        } ${centered ? styles.centered : ""}`}
      >
        {children}
      </main>
    </div>
  );
};
