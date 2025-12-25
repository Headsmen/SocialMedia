import { useQuery } from '@tanstack/react-query';
import { commentApi } from '@/shared/api';
import { commentKeys } from '../config/commentKeys';

const COMMENTS_PER_PAGE = 10;
const STALE_TIME = 5 * 60 * 1000;

export const useComments = (page: number = 1, limit: number = COMMENTS_PER_PAGE) => {
  return useQuery({
    queryKey: commentKeys.list({ page, limit }),
    queryFn: () => commentApi.getComments({ page, limit }),
    staleTime: STALE_TIME,
    placeholderData: (previousData) => previousData,
  });
};