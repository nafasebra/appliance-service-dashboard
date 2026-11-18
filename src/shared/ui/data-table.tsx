import { useSharedTranslation } from '@/shared/hooks/use-shared-translation';
import type { ReactNode } from 'react';
import { useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
  dataTableDefaults,
  dataTableFeatures,
  type DataTableFeatures,
} from './data-table-features';
import { Button } from './button';
import { DataTablePagination } from './data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import i18next from 'i18next';
import { translateLabel } from '../i18n';

export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  getRowId: (row: TData) => string;
  emptyMessage?: ReactNode;
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  emptyMessage = i18next.t('table.noRecordsToDisplay'),
}: DataTableProps<TData>) {
  const t = useSharedTranslation();
  const table = useTable({
    ...dataTableDefaults,
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="min-w-0">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const definition = header.column.columnDef.header;
                const label =
                  typeof definition === 'string' ? (
                    translateLabel(definition)
                  ) : (
                    <table.FlexRender header={header} />
                  );
                const Icon =
                  sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;
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
                        onClick={() => {
                          header.column.toggleSorting();
                          table.resetPageIndex();
                        }}
                      >
                        {label}
                        <Icon aria-hidden="true" />
                        <span className="sr-only">
                          {sorted === 'asc'
                            ? t('table.ascendingSwitchToDescending')
                            : sorted === 'desc'
                              ? t('table.descendingClearSorting')
                              : t('table.sortAscending')}
                        </span>
                      </Button>
                    ) : (
                      label
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!rows.length && emptyMessage ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
