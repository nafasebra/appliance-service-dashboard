import assert from 'node:assert/strict';
import test from 'node:test';
import { initialData } from './demo-data.ts';
import { isDemoData, validateJobUpdate } from './validation.ts';

test('accepts the complete demo seed', () => {
  assert.equal(isDemoData(structuredClone(initialData)), true);
});

test('rejects malformed records and broken references', () => {
  const malformed = structuredClone(initialData) as unknown as {
    jobs: Array<Record<string, unknown>>;
  };
  malformed.jobs[0].date = '2026-02-31';
  assert.equal(isDemoData(malformed), false);

  const brokenReference = structuredClone(initialData);
  brokenReference.jobs[0].customerId = 'missing-customer';
  assert.equal(isDemoData(brokenReference), false);
});

test('rejects persisted payouts that exceed technician share', () => {
  const invalid = structuredClone(initialData);
  const paidJob = invalid.jobs.find((job) => job.id === 'SR-1041');
  assert.ok(paidJob);
  paidJob.commission += 1;
  assert.equal(isDemoData(invalid), false);
});

test('protects a job after financial transactions are recorded', () => {
  const previous = initialData.jobs.find((job) => job.id === 'SR-1041');
  assert.ok(previous);

  assert.match(
    validateJobUpdate(previous, { ...previous, status: 'cancelled' }, initialData.transactions) ??
      '',
    /تکمیل‌شده/,
  );
  assert.match(
    validateJobUpdate(previous, { ...previous, technicianId: 't1' }, initialData.transactions) ??
      '',
    /تعمیرکار/,
  );
  assert.match(
    validateJobUpdate(
      previous,
      { ...previous, total: previous.total - 1 },
      initialData.transactions,
    ) ?? '',
    /پرداخت‌های ثبت‌شده/,
  );
  assert.equal(
    validateJobUpdate(
      previous,
      { ...previous, total: previous.total + 1 },
      initialData.transactions,
    ),
    null,
  );
});
