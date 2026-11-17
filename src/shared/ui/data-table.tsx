import type { ReactNode } from 'react';
import { useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
  dataTableDefaults,
  dataTableFeatures,
  type DataTableFeatures,
} from './data-table-features';
import { Button } from './button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData>[];
  getRowId: (row: TData) => string;
  emptyMessage?: ReactNode;
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  emptyMessage = 'موردی برای نمایش وجود ندارد.',
}: DataTableProps<TData>) {
  const table = useTable({
    ...dataTableDefaults,
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted();
              const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  aria-sort={
                    sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
                  }
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                      <Icon aria-hidden="true" />
                      <span className="sr-only">
                        {sorted === 'asc'
                          ? 'صعودی؛ تغییر به نزولی'
                          : sorted === 'desc'
                            ? 'نزولی؛ حذف مرتب‌سازی'
                            : 'مرتب‌سازی صعودی'}
                      </span>
                    </Button>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
        {!table.getRowModel().rows.length && emptyMessage ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );
}
