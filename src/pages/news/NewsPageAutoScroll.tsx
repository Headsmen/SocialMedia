import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";
import { FabBtn } from "@/widgets/layout/fab-btn/FabBtn";
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

