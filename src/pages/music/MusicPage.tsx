import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";

export function MusicPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <h2>Музыка</h2>
      </main>
    </div>
  );
}

