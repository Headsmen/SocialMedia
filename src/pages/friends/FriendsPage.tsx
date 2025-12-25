import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";
import { FriendsWidget } from "@/widgets/friends";

export function FriendsPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <FriendsWidget />
      </main>
    </div>
  );
}

