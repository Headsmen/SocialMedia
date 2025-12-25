import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

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

