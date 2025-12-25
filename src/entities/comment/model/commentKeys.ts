export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: { page: number; limit: number }) =>
    [...commentKeys.lists(), filters] as const,
  infinite: () => [...commentKeys.all, 'infinite'] as const,
  detail: (id: string | number) => [...commentKeys.all, 'detail', id] as const,
};
