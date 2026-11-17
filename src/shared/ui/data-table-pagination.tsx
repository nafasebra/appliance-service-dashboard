import type { ReactTable, RowData } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { DataTableFeatures } from './data-table-features';
import { number } from '../lib/format';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useTranslation } from 'react-i18next'

const pageSizes = [10, 20, 50];

export function DataTablePagination<TData extends RowData>({
  table,
}: {
  table: ReactTable<DataTableFeatures, TData>;
}) {
  const { t } = useTranslation()
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getRowCount();
  const pageCount = table.getPageCount();
  const start = total ? pageIndex * pageSize + 1 : 0;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <nav
      aria-label={t('key19', 'صفحه‌بندی جدول')}
      dir="rtl"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs text-muted-foreground"
    >
      <p role="status" aria-live="polite" aria-atomic="true">
        {number(start)} {t('key20', 'تا')} {number(end)} {t('key21', 'از')} {number(total)} {t('key22', 'مورد')}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span>{t('key23', 'تعداد در صفحه')}</span>
          <Select
            dir="rtl"
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" aria-label={t('key24', 'تعداد ردیف در هر صفحه')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {number(size)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span>
          {t('key25', 'صفحه')} {number(total ? pageIndex + 1 : 0)} {t('key21', 'از')} {number(pageCount)}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('key26', 'صفحه اول')}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsRight aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('key27', 'صفحه قبل')}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('key28', 'صفحه بعد')}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t('key29', 'صفحه آخر')}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsLeft aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
