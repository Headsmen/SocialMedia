import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { ProfileWidgets } from '@/widgets/profile-info';
import { PageLayout } from '@/widgets/layout';

function ProfilePage() {
  const { userEmail } = useParams<{ userEmail?: string }>();

  return (
    <PageLayout>
      <Container size="lg" py="xl">
        <ProfileWidgets userEmail={userEmail} />
      </Container>
    </PageLayout>
  );
}

export { ProfilePage };
