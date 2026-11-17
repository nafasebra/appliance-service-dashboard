import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';
import { compareTableValues } from '../utils/table-sort.ts';

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    persian: (left, right, columnId) =>
      compareTableValues(left.getValue(columnId), right.getValue(columnId)),
  },
});

export type DataTableFeatures = typeof dataTableFeatures;

export const dataTableDefaults = {
  defaultColumn: { sortFn: 'persian', sortDescFirst: false, sortUndefined: 'last' },
  enableMultiSort: false,
  autoResetPageIndex: true,
  initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
} as const;
