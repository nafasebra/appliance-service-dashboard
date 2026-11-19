import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialData,
  type DemoData,
  JobStatus,
  applyJobWorkflow,
  type JobWorkflowAction,
  appendTransaction,
  isDemoData,
} from '@/entities/service';

import { getWorkflowAccount, getWorkflowQueue } from '@/pages/cartable';

const jobId = 'SR-1048';
function advance(data: DemoData, status: JobStatus, action: JobWorkflowAction): DemoData {
  const result = applyJobWorkflow(data, jobId, status, action);
  assert.ok(result.ok, JSON.stringify(result));
  return result.data;
}
function seed(): DemoData {
  return structuredClone(initialData);
}

test('request progresses through acceptance, assignment, repair, collection, settlement and archive', () => {
  let data = seed();
  const original = structuredClone(data);
  const queue = () =>
    getWorkflowQueue(
      data.jobs.find((job) => job.id === jobId)!,
      data.transactions,
    );
  assert.equal(queue(), 'inbox');
  data = advance(data, JobStatus.New, { type: 'accept' });
  assert.equal(queue(), 'assignment');
  assert.ok(isDemoData(data));
  data = advance(data, JobStatus.Accepted, {
    type: 'assign',
    technicianId: 't1',
    date: '2026-11-18',
    time: '10:30',
  });
  assert.equal(queue(), 'active');
  data = advance(data, JobStatus.Scheduled, { type: 'start' });
  data = advance(data, JobStatus.Working, { type: 'complete', total: 1000, commission: 200 });
  assert.equal(queue(), 'collection');
  assert.deepEqual(data.transactions, original.transactions);
  data = appendTransaction(data, {
    id: 'customer-partial',
    kind: 'receipt',
    jobId,
    amount: 400,
    date: '2026-11-18',
    description: 'Partial customer payment',
  });
  assert.equal(queue(), 'collection');
  assert.throws(() =>
    appendTransaction(data, {
      id: 'premature-payout',
      kind: 'payout',
      jobId,
      amount: 100,
      date: '2026-11-18',
      description: 'Premature payout',
    }),
  );
  data = appendTransaction(data, {
    id: 'customer-final',
    kind: 'receipt',
    jobId,
    amount: 600,
    date: '2026-11-18',
    description: 'Final customer payment',
  });
  assert.equal(queue(), 'settlement');
  data = appendTransaction(data, {
    id: 'technician-partial',
    kind: 'payout',
    jobId,
    amount: 300,
    date: '2026-11-18',
    description: 'Partial technician payout',
  });
  assert.equal(queue(), 'settlement');
  assert.equal(
    getWorkflowAccount(
      data.jobs.find((job) => job.id === jobId)!,
      data.transactions,
    ).payable,
    500,
  );
  data = appendTransaction(data, {
    id: 'technician-final',
    kind: 'payout',
    jobId,
    amount: 500,
    date: '2026-11-18',
    description: 'Final technician payout',
  });
  assert.equal(queue(), 'archive');
  assert.throws(() =>
    appendTransaction(data, {
      id: 'overpay',
      kind: 'payout',
      jobId,
      amount: 1,
      date: '2026-11-18',
      description: 'Overpayment',
    }),
  );
  assert.deepEqual(initialData, original);
});

test('stale, invalid and skipped transitions leave input data untouched', () => {
  const data = seed(),
    before = structuredClone(data);
  for (const [expected, action] of [
    [JobStatus.New, { type: 'start' }],
    [JobStatus.New, { type: 'complete', total: 1000, commission: 0 }],
    [JobStatus.New, { type: 'assign', technicianId: 't1', date: '2026-11-18', time: '10:00' }],
    [JobStatus.Accepted, { type: 'accept' }],
  ] as [JobStatus, JobWorkflowAction][])
    assert.equal(applyJobWorkflow(data, jobId, expected, action).ok, false);
  assert.equal(applyJobWorkflow(data, 'missing', JobStatus.New, { type: 'accept' }).ok, false);
  const accepted = advance(data, JobStatus.New, { type: 'accept' });
  assert.equal(
    applyJobWorkflow(accepted, jobId, JobStatus.Accepted, {
      type: 'assign',
      technicianId: 'missing',
      date: '2026-11-18',
      time: '10:00',
    }).ok,
    false,
  );
  assert.equal(
    applyJobWorkflow(accepted, jobId, JobStatus.Accepted, {
      type: 'assign',
      technicianId: 't1',
      date: '2026-02-30',
      time: '99:00',
    }).ok,
    false,
  );
  assert.deepEqual(data, before);
});

test('completion requires valid amounts and cancellation respects receipts', () => {
  let data = advance(seed(), JobStatus.New, { type: 'accept' });
  data = advance(data, JobStatus.Accepted, {
    type: 'assign',
    technicianId: 't1',
    date: '2026-11-18',
    time: '10:00',
  });
  data = advance(data, JobStatus.Scheduled, { type: 'start' });
  for (const [total, commission] of [
    [0, 0],
    [100, 101],
    [1.5, 0],
    [100, -1],
    [NaN, 0],
  ])
    assert.equal(
      applyJobWorkflow(data, jobId, JobStatus.Working, { type: 'complete', total, commission }).ok,
      false,
    );
  const cancelled = advance(data, JobStatus.Working, { type: 'cancel' });
  assert.equal(
    getWorkflowQueue(
      cancelled.jobs.find((job) => job.id === jobId)!,
      cancelled.transactions,
    ),
    'archive',
  );
  const priced = {
    ...data,
    jobs: data.jobs.map((job) => (job.id === jobId ? { ...job, total: 1000 } : job)),
  };
  const paid = appendTransaction(priced, {
    id: 'advance',
    kind: 'receipt',
    jobId,
    amount: 100,
    date: '2026-11-18',
    description: 'Customer advance',
  });
  assert.equal(applyJobWorkflow(paid, jobId, JobStatus.Working, { type: 'cancel' }).ok, false);
  const completed = advance(paid, JobStatus.Working, {
    type: 'complete',
    total: 1000,
    commission: 1000,
  });
  const fullyPaid = appendTransaction(completed, {
    id: 'remainder',
    kind: 'receipt',
    jobId,
    amount: 900,
    date: '2026-11-18',
    description: 'Remainder',
  });
  assert.equal(
    getWorkflowQueue(
      fullyPaid.jobs.find((job) => job.id === jobId)!,
      fullyPaid.transactions,
    ),
    'archive',
  );
});
