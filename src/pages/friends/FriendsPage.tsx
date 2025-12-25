import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
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

