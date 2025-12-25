import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";
import { ChatWidget } from "@/widgets/chat";

export function ChatPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <ChatWidget />
      </main>
    </div>
  );
}

