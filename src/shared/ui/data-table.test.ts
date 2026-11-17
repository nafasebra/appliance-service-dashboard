import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTable, type ColumnDef } from '@tanstack/react-table';
import {
  dataTableDefaults,
  dataTableFeatures,
  type DataTableFeatures,
} from './data-table-features.ts';

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
