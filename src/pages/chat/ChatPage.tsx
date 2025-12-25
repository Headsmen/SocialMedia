import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
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

