import { Card, Text, Image, Group, Avatar, ActionIcon } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '@/shared/lib/utils';
import type { Post } from '@/entities/post';
import { useAuthStore } from '@/entities/user';
import { usePostActions } from '../model/usePostActions';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
  authorName?: string;
  authorAvatar?: string;
  authorEmail?: string;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
}

export function PostCard({ post, authorName, authorAvatar, authorEmail, onDelete, onLike }: PostCardProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const isAuthor = currentUser?.id === post.userId;
  const isLiked = currentUser?.id ? post.likedBy?.includes(currentUser.id) : false;

  const timeAgo = formatRelativeTime(post.createdAt);
  const { handleDelete, handleLike } = usePostActions({ postId: post.id, onDelete, onLike });

  const handleProfileClick = () => {
    if (authorEmail) {
      navigate(`/profile/${authorEmail}`);
    }
  };

  return (
    <Card withBorder padding="lg" radius="md" className={styles.card}>
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <Avatar
            src={authorAvatar}
            radius="xl"
            size="md"
            style={{ cursor: authorEmail ? 'pointer' : 'default' }}
            onClick={handleProfileClick}
          />
          <div>
            <Text
              fw={500}
              size="sm"
              style={{ cursor: authorEmail ? 'pointer' : 'default' }}
              onClick={handleProfileClick}
            >
              {authorName || 'Пользователь'}
            </Text>
            <Text c="dimmed" size="xs">
              {timeAgo}
            </Text>
          </div>
        </Group>

        {isAuthor && onDelete && (
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={handleDelete}
          >
            <IconTrash size={18} />
          </ActionIcon>
        )}
      </Group>

      <Text size="sm" mb="md" style={{ whiteSpace: 'pre-wrap' }}>
        {post.content}
      </Text>

      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt="Post image"
          radius="md"
          mb="md"
          fit="contain"
          mah={400}
        />
      )}

      <Group gap="xl" mt="md">
        <Group gap="xs">
          <ActionIcon
            variant="transparent"
            onClick={handleLike}
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          >
            {isLiked ? (
              <IconHeartFilled size={20} className={styles.heartIconLiked} />
            ) : (
              <IconHeart size={20} className={styles.heartIcon} />
            )}
          </ActionIcon>
          <Text
            size="sm"
            c={isLiked ? 'red' : 'dimmed'}
            className={`${styles.likeCount} ${isLiked ? styles.liked : ''}`}
          >
            {post.likesCount}
          </Text>
        </Group>

        <Group gap="xs">
          <ActionIcon variant="transparent">
            <IconMessageCircle size={20} />
          </ActionIcon>
          <Text size="sm" c="dimmed">
            {post.commentsCount}
          </Text>
        </Group>
      </Group>
    </Card>
  );
}
