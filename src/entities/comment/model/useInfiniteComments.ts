import { useInfiniteQuery } from '@tanstack/react-query';
import { commentApi } from '@/shared/api';
import { commentKeys } from '../config/commentKeys';

const COMMENTS_PER_PAGE = 10;

export const useInfiniteComments = () => {
  return useInfiniteQuery({
    queryKey: commentKeys.infinite(),
    queryFn: ({ pageParam = 1 }) =>
      commentApi.getComments({
        page: pageParam,
        limit: COMMENTS_PER_PAGE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};