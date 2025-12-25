import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { ProfileWidgets } from '@/widgets/profile-info';
import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

function ProfilePage() {
  const { userEmail } = useParams<{ userEmail?: string }>();

  return (
    <div className="app-container">
      <Header />
      <Sidebar withHeader />
      <main className="main-content with-sidebar">
        <Container size="lg" py="xl">
          <ProfileWidgets userEmail={userEmail} />
        </Container>
      </main>
    </div>
  );
}

export { ProfilePage };
