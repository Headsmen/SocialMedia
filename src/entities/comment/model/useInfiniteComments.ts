import { useInfiniteQuery } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';

const COMMENTS_PER_PAGE = 10;

export const useInfiniteComments = () => {
  return useInfiniteQuery({
    queryKey: ['comments', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      commentApi.getComments({
        page: pageParam,
        limit: COMMENTS_PER_PAGE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Если есть ещё данные, возвращаем номер следующей страницы
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
