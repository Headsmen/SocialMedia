import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
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




