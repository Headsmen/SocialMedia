import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { Table as MantineTable, Box, Button, Group, Text } from '@mantine/core';
import { useTable } from './model/useTable';
import styles from './Table.module.scss';

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  enableFiltering?: boolean;
}

export function Table<T>({
  data,
  columns,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  enableFiltering = true,
}: TableProps<T>) {
  const { table } = useTable({
    data,
    columns,
    enableSorting,
    enablePagination,
    pageSize,
    enableFiltering,
  });

  return (
    <Box>
      <MantineTable striped highlightOnHover withTableBorder className={styles.table}>
        <MantineTable.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <MantineTable.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <MantineTable.Th
                  key={header.id}
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <Group gap="xs" wrap="nowrap">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <Text size="xs">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </Text>
                      )}
                    </Group>
                  )}
                </MantineTable.Th>
              ))}
            </MantineTable.Tr>
          ))}
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {table.getRowModel().rows.map((row) => (
            <MantineTable.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <MantineTable.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </MantineTable.Td>
              ))}
            </MantineTable.Tr>
          ))}
        </MantineTable.Tbody>
      </MantineTable>

      {enablePagination && (
        <Group justify="space-between" mt="md">
          <Text size="sm">
            Страница {table.getState().pagination.pageIndex + 1} из{' '}
            {table.getPageCount()}
          </Text>
          <Group gap="xs">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Назад
            </Button>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Вперёд
            </Button>
          </Group>
        </Group>
      )}
    </Box>
  );
}
