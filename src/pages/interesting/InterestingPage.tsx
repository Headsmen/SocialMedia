import { Header } from "@/widgets/layout/header/Header";
import { Sidebar } from "@/widgets/layout/sidebar/Sidebar";

export function InterestingPage() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <h2>Интересное</h2>
      </main>
    </div>
  );
}

