import { useSharedTranslation } from '@/shared/hooks';
import type { ReactTable, RowData } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { DataTableFeatures } from '@/shared/ui/data-table-features';

import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const pageSizes = [10, 20, 50];

export function DataTablePagination<TData extends RowData>({
  table,
}: {
  table: ReactTable<DataTableFeatures, TData>;
}) {
  const t = useSharedTranslation();
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getRowCount();
  const pageCount = table.getPageCount();
  const start = total ? pageIndex * pageSize + 1 : 0;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <nav
      aria-label={t('table.tablePagination')}
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-caption text-muted-foreground"
    >
      <p role="status" aria-live="polite" aria-atomic="true">
        {t('pagination.range', { start, end, total })}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span>{t('table.rowsPerPage')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" aria-label={t('table.numberOfRowsPerPage')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span>{t('pagination.page', { page: total ? pageIndex + 1 : 0, pages: pageCount })}</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('table.firstPage')}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsRight aria-hidden="true" className="ltr:rotate-180" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('table.previousPage')}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronRight aria-hidden="true" className="ltr:rotate-180" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('table.nextPage')}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLeft aria-hidden="true" className="ltr:rotate-180" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('table.lastPage')}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsLeft aria-hidden="true" className="ltr:rotate-180" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
