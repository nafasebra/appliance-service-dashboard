import assert from 'node:assert/strict';
import test from 'node:test';
import { formatJalaliDate, parseIsoDate, toIsoDate } from './date.ts';

test('round-trips an ISO calendar date without a timezone shift', () => {
  const date = parseIsoDate('2026-11-16');

  assert.ok(date);
  assert.equal(toIsoDate(date), '2026-11-16');
  assert.notEqual(formatJalaliDate('2026-11-16'), 'انتخاب تاریخ');
});

test('rejects invalid ISO calendar dates', () => {
  assert.equal(parseIsoDate('2026-02-31'), undefined);
  assert.equal(parseIsoDate('1405/08/25'), undefined);
});
