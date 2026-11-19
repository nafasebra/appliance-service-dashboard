import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTable, type ColumnDef } from '@tanstack/react-table';
import {
  dataTableDefaults,
  dataTableFeatures,
  type DataTableFeatures,
} from '@/shared/ui/data-table-features';

interface RecordRow {
  id: string;
  amount: number;
  date: string;
  customer?: string;
}

const data: RecordRow[] = [
  { id: 'a', amount: 1000000, date: '2026-11-17', customer: 'یاسمن' },
  { id: 'b', amount: 900, date: '2026-01-01', customer: 'آرمان' },
  { id: 'c', amount: 12000, date: '2026-10-10' },
];
const columns: ColumnDef<DataTableFeatures, RecordRow>[] = [
  { accessorKey: 'amount', header: 'مبلغ' },
  { accessorKey: 'date', header: 'تاریخ' },
  { accessorKey: 'customer', header: 'مشتری' },
  { id: 'actions', header: 'عملیات', enableSorting: false },
];

function createTestTable(rows = data) {
  let instance: ReturnType<typeof useTable<DataTableFeatures, RecordRow>> | undefined;
  function Harness() {
    instance = useTable({
      ...dataTableDefaults,
      features: dataTableFeatures,
      columns,
      data: rows,
      getRowId: (row) => row.id,
    });
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  assert.ok(instance);
  return instance;
}

test('table sorts raw amounts numerically and cycles ascending, descending and original order', () => {
  const table = createTestTable();
  const ids = () => table.getRowModel().rows.map((row) => row.id);
  const column = table.getColumn('amount');
  assert.ok(column);
  assert.deepEqual(ids(), ['a', 'b', 'c']);
  column.toggleSorting();
  assert.equal(column.getIsSorted(), 'asc');
  assert.deepEqual(ids(), ['b', 'c', 'a']);
  column.toggleSorting();
  assert.deepEqual(ids(), ['a', 'c', 'b']);
  column.toggleSorting();
  assert.deepEqual(ids(), ['a', 'b', 'c']);
  assert.deepEqual(
    data.map((row) => row.id),
    ['a', 'b', 'c'],
  );
  const actions = table.getColumn('actions');
  assert.ok(actions);
  assert.equal(actions.getCanSort(), false);
});

test('table sorts ISO dates chronologically, Persian names alphabetically and missing values last', () => {
  const table = createTestTable();
  const date = table.getColumn('date');
  const customer = table.getColumn('customer');
  assert.ok(date);
  assert.ok(customer);
  date.toggleSorting(false);
  assert.deepEqual(
    table.getRowModel().rows.map((row) => row.id),
    ['b', 'c', 'a'],
  );
  customer.toggleSorting(false);
  assert.deepEqual(
    table.getRowModel().rows.map((row) => row.id),
    ['b', 'a', 'c'],
  );
  customer.toggleSorting(true);
  assert.deepEqual(
    table.getRowModel().rows.map((row) => row.id),
    ['a', 'b', 'c'],
  );
  assert.equal(table.atoms.sorting.get().length, 1);
  assert.deepEqual(createTestTable([]).getRowModel().rows, []);
});

test('pagination slices rows, respects page boundaries and preserves record IDs', () => {
  const records = Array.from({ length: 23 }, (_, index) => ({
    id: String(index),
    amount: 23 - index,
    date: '2026-11-17',
  }));
  const table = createTestTable(records);
  assert.equal(table.getRowCount(), 23);
  assert.equal(table.getPageCount(), 3);
  assert.equal(table.getCanPreviousPage(), false);
  assert.equal(table.getRowModel().rows.length, 10);
  table.nextPage();
  assert.equal(table.getRowModel().rows[0].id, '10');
  table.lastPage();
  assert.deepEqual(
    table.getRowModel().rows.map((row) => row.id),
    ['20', '21', '22'],
  );
  assert.equal(table.getCanNextPage(), false);
  assert.equal(table.atoms.pagination.get().pageIndex, 2);
  table.previousPage();
  assert.equal(table.atoms.pagination.get().pageIndex, 1);
  table.firstPage();
  assert.equal(table.getRowModel().rows[0].id, '0');
});

test('sorting runs across all rows before pagination and page size changes retain the first visible row', () => {
  const table = createTestTable(
    Array.from({ length: 23 }, (_, index) => ({
      id: String(index),
      amount: 23 - index,
      date: '2026-11-17',
    })),
  );
  const amount = table.getColumn('amount');
  assert.ok(amount);
  amount.toggleSorting(false);
  assert.equal(table.getRowModel().rows[0].original.amount, 1);
  table.lastPage();
  table.setPageSize(20);
  assert.equal(table.atoms.pagination.get().pageIndex, 1);
  assert.equal(table.getRowModel().rows.length, 3);
  table.setPageSize(50);
  assert.equal(table.atoms.pagination.get().pageIndex, 0);
  assert.equal(table.getRowModel().rows.length, 23);
  table.resetPageIndex();
  assert.equal(table.atoms.pagination.get().pageIndex, 0);
  const empty = createTestTable([]);
  assert.equal(empty.getPageCount(), 0);
  assert.equal(empty.getCanPreviousPage(), false);
  assert.equal(empty.getCanNextPage(), false);
});
