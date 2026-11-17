import { createSortedRowModel, rowSortingFeature, tableFeatures } from '@tanstack/react-table';
import { compareTableValues } from '../utils/table-sort.ts';

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    persian: (left, right, columnId) =>
      compareTableValues(left.getValue(columnId), right.getValue(columnId)),
  },
});

export type DataTableFeatures = typeof dataTableFeatures;

export const dataTableDefaults = {
  defaultColumn: { sortFn: 'persian', sortDescFirst: false, sortUndefined: 'last' },
  enableMultiSort: false,
} as const;
