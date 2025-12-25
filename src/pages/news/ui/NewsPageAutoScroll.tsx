import { PageLayout } from "@/widgets/layout";
import { NewsWidget } from "@/widgets/news-feed";

export function NewsPageAutoScroll() {
  return (
    <PageLayout showFab centered>
      <NewsWidget />
    </PageLayout>
  );
}

