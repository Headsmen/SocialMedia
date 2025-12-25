import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
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
