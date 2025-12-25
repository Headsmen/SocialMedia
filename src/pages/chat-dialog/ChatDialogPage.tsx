import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";
import { ChatDialogWidget } from '@/widgets/chat';

function ChatDialogPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <ChatDialogWidget />
      </main>
    </div>
  );
}

export { ChatDialogPage };
