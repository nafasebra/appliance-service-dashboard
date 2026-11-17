import assert from 'node:assert/strict';
import test from 'node:test';
import { getCashChartData } from './cash-chart.ts';

test('groups receipts and outgoing payments by date and handles empty data', () => {
  const base = { jobId: 'job', date: '2026-11-16', description: 'test' };
  const result = getCashChartData([
    { ...base, id: '1', kind: 'receipt', amount: 100 },
    { ...base, id: '2', kind: 'payout', amount: 40 },
    { ...base, id: '3', kind: 'expense', amount: 10 },
  ]);
  assert.deepEqual(result.points, [{ date: base.date, incoming: 100, outgoing: 50 }]);
  assert.equal(result.max, 100);
  assert.deepEqual(getCashChartData([]), { points: [], max: 1 });
});
