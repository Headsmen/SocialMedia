import { Stack, Text, Loader, Center } from '@mantine/core';
import { PostCard } from '@/widgets/post-card';
import { usePostsList } from '../model/usePostsList';

export function PostsList() {
  const { posts, isLoading, error, handleDelete, handleLike } = usePostsList();

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={200}>
        <Text c="red">Ошибка загрузки постов</Text>
      </Center>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Center h={200}>
        <Text c="dimmed">Нет постов для отображения</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {posts.map(({ post, authorName, authorAvatar, authorEmail }) => (
        <PostCard
          key={post.id}
          post={post}
          authorName={authorName}
          authorAvatar={authorAvatar}
          authorEmail={authorEmail}
          onDelete={handleDelete}
          onLike={handleLike}
        />
      ))}
    </Stack>
  );
}
