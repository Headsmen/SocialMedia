import { createQueryHooks } from '@/shared/api/factories/createQueryHooks';
import { postsApi } from '../api/posts-api';
import type { Post, CreatePostData } from './types';

const postQueries = createQueryHooks<Post>('posts');

/**
 * Хук для получения списка постов
 */
export const usePosts = () => {
  return postQueries.useList(() => postsApi.getPosts(), {
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

/**
 * Хук для получения одного поста
 */
export const usePost = (id: string | undefined) => {
  return postQueries.useOne(id, (id) => postsApi.getPostById(id));
};

/**
 * Хук для создания поста
 */
export const useCreatePost = () => {
  return postQueries.useCreate<CreatePostData>((data) => postsApi.createPost(data));
};

/**
 * Хук для удаления поста
 */
export const useDeletePost = () => {
  return postQueries.useDelete((id) => postsApi.deletePost(id));
};

/**
 * Хук для лайка поста
 */
export const useToggleLike = () => {
  return postQueries.useUpdate<{ userId: string }>(({ id, data }) =>
    postsApi.toggleLike(id, data.userId)
  );
};
