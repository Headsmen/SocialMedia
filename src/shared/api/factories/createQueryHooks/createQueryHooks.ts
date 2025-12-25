import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function createQueryHooks<TData, TError = AxiosError>(baseKey: string) {

  const useList = (
    fetchFn: () => Promise<TData[]>,
    options?: Omit<UseQueryOptions<TData[], TError>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TData[], TError>({
      queryKey: [baseKey, 'list'],
      queryFn: fetchFn,
      ...options,
    });
  };

  const useOne = (
    id: string | undefined,
    fetchFn: (id: string) => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TData, TError>({
      queryKey: [baseKey, 'detail', id],
      queryFn: () => fetchFn(id!),
      enabled: !!id,
      ...options,
    });
  };

  const useCreate = <TCreateDto = Partial<TData>>(
    mutateFn: (data: TCreateDto) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TCreateDto>, 'mutationFn'>
  ) => {
    const queryClient = useQueryClient();

    return useMutation<TData, TError, TCreateDto>({
      mutationFn: mutateFn,
      onSuccess: (data, variables, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: [baseKey, 'list'] });
        options?.onSuccess?.(data, variables, context, mutationContext);
      },
      ...options,
    });
  };

  /**
   * Хук для обновления элемента
   */
  const useUpdate = <TUpdateDto = Partial<TData>>(
    mutateFn: (params: { id: string; data: TUpdateDto }) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, { id: string; data: TUpdateDto }>, 'mutationFn'>
  ) => {
    const queryClient = useQueryClient();

    return useMutation<TData, TError, { id: string; data: TUpdateDto }>({
      mutationFn: mutateFn,
      onSuccess: (data, variables, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: [baseKey, 'list'] });
        queryClient.invalidateQueries({ queryKey: [baseKey, 'detail', variables.id] });
        options?.onSuccess?.(data, variables, context, mutationContext);
      },
      ...options,
    });
  };
  
  const useDelete = (
    mutateFn: (id: string) => Promise<void>,
    options?: Omit<UseMutationOptions<void, TError, string>, 'mutationFn'>
  ) => {
    const queryClient = useQueryClient();

    return useMutation<void, TError, string>({
      mutationFn: mutateFn,
      onSuccess: (data, variables, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: [baseKey, 'list'] });
        queryClient.invalidateQueries({ queryKey: [baseKey, 'detail', variables] });
        options?.onSuccess?.(data, variables, context, mutationContext);
      },
      ...options,
    });
  };

  return {
    useList,
    useOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}
