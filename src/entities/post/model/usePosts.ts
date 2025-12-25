import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts-api';
import { postKeys } from './postKeys';
import type { Post, CreatePostData } from './types';

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: postKeys.lists(),
    queryFn: postsApi.getPosts,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePost = (id: string) => {
  return useQuery<Post, Error>({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostData>({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

interface ToggleLikeContext {
  previousPosts?: Post[];
}

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, { postId: string; userId: string }, ToggleLikeContext>({
    mutationFn: ({ postId, userId }) => postsApi.toggleLike(postId, userId),

    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists());

      queryClient.setQueryData<Post[]>(postKeys.lists(), (oldPosts) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((post) => {
          if (post.id !== postId) return post;

          const likedBy = post.likedBy || [];
          const isLiked = likedBy.includes(userId);

          const updatedLikedBy = isLiked
            ? likedBy.filter((id) => id !== userId)
            : [...likedBy, userId];

          return {
            ...post,
            likedBy: updatedLikedBy,
            likesCount: updatedLikedBy.length,
          };
        });
      });

      return { previousPosts };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
