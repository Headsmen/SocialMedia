import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

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

