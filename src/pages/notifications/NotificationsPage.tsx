import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";
import { NotificationsWidget } from "@/widgets/notifications-list";

export function NotificationsPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <NotificationsWidget />
      </main>
    </div>
  );
}




