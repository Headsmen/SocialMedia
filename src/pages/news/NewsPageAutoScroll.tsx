import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
import { FabBtn } from "@/widgets/fab-btn";
import { NewsWidget } from "@/widgets/news-feed";

export function NewsPageAutoScroll() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <FabBtn />
      <main className="main-content with-sidebar centered">
        <NewsWidget />
      </main>
    </div>
  );
}

