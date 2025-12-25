import { Stack, Loader, Text, Center } from '@mantine/core';
import type { ReactNode } from 'react';

interface ListContainerProps<T> {
  data?: T[];
  isLoading: boolean;
  error?: Error | null;
  emptyMessage?: string;
  children: (items: T[]) => ReactNode;
  gap?: string | number;
}

export function ListContainer<T>({
  data,
  isLoading,
  error,
  emptyMessage = 'Нет данных',
  children,
  gap = 'md',
}: ListContainerProps<T>) {
  if (isLoading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center p="xl">
        <Text c="red" size="sm">
          Ошибка загрузки: {error.message}
        </Text>
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center p="xl">
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </Center>
    );
  }

  return <Stack gap={gap}>{children(data)}</Stack>;
}
