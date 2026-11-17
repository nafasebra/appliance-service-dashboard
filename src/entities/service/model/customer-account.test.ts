import test from 'node:test';
import assert from 'node:assert/strict';
import { initialData } from './demo-data.ts';
import { appendTransaction, getCustomerAccount, getOrderAccount } from './customer-account.ts';
import { validateJobUpdate } from './validation.ts';

test('customer account keeps receivables separate from advances on another job', () => {
  const data = structuredClone(initialData);
  const completed = data.jobs.find((job) => job.id === 'SR-1041')!;
  const open = data.jobs.find((job) => job.id === 'SR-1048')!;
  open.total = 1000000;
  data.transactions = [
    {
      id: 'partial',
      jobId: completed.id,
      kind: 'receipt',
      amount: 600000,
      date: '2026-11-16',
      description: 'partial payment',
    },
    {
      id: 'advance',
      jobId: open.id,
      kind: 'receipt',
      amount: 500000,
      date: '2026-11-16',
      description: 'advance payment',
    },
  ];
  assert.deepEqual(getCustomerAccount('c1', data.jobs, data.transactions), {
    charge: 1600000,
    receipts: 1100000,
    outstanding: 1000000,
    credit: 500000,
  });
  assert.equal(getOrderAccount(completed, data.transactions).status, 'partial');
  assert.equal(getOrderAccount(open, data.transactions).status, 'unfinalized');
});

test('receipt validation rejects duplicate entries, overpayment and invalid references', () => {
  const data = structuredClone(initialData);
  const receipt = {
    id: 'new-receipt',
    jobId: 'SR-1044',
    kind: 'receipt' as const,
    amount: 1,
    date: '2026-11-16',
    description: 'payment',
  };
  assert.throws(() => appendTransaction(data, receipt));
  assert.throws(() => appendTransaction(data, { ...receipt, jobId: 'missing' }));
  assert.throws(() => appendTransaction(data, { ...receipt, jobId: 'SR-1048' }));
  assert.throws(() => appendTransaction(data, { ...receipt, id: 'tr1' }));
  assert.throws(() => appendTransaction(data, { ...receipt, amount: -1 }));
});

test('partial payments use latest ledger balance and fully paid orders leave receivables', () => {
  let data = structuredClone(initialData);
  data.transactions = data.transactions.filter((item) => item.jobId !== 'SR-1044');
  const receipt = {
    id: 'first',
    jobId: 'SR-1044',
    kind: 'receipt' as const,
    amount: 1000000,
    date: '2026-11-16',
    description: 'payment',
    method: 'bank' as const,
    reference: 'reference-1',
  };
  data = appendTransaction(data, receipt);
  assert.equal(
    getOrderAccount(
      data.jobs.find((job) => job.id === receipt.jobId)!,
      data.transactions,
    ).outstanding,
    2200000,
  );
  assert.throws(() => appendTransaction(data, { ...receipt, id: 'excess', amount: 2200001 }));
  data = appendTransaction(data, { ...receipt, id: 'second', amount: 2200000 });
  assert.equal(
    getOrderAccount(
      data.jobs.find((job) => job.id === receipt.jobId)!,
      data.transactions,
    ).status,
    'paid',
  );
});

test('expenses persist without an order and payouts respect technician entitlement', () => {
  const data = structuredClone(initialData);
  const expense = {
    id: 'expense',
    jobId: '',
    kind: 'expense' as const,
    amount: 100,
    date: '2026-11-16',
    description: 'operating expense',
  };
  assert.equal(appendTransaction(data, expense).transactions.length, data.transactions.length + 1);
  assert.throws(() => appendTransaction(data, { ...expense, date: '2026-02-31' }));
  assert.throws(() => appendTransaction(data, { ...expense, kind: 'payout', jobId: 'SR-1041' }));
  assert.throws(() => appendTransaction(data, { ...expense, kind: 'payout', jobId: 'SR-1047' }));
});

test('recorded receipts protect customer ownership, amount and cancellation', () => {
  const data = structuredClone(initialData);
  const job = { ...data.jobs.find((item) => item.id === 'SR-1047')! };
  const receipt = {
    id: 'advance',
    jobId: job.id,
    kind: 'receipt' as const,
    amount: 500000,
    date: '2026-11-16',
    description: 'advance',
  };
  assert.ok(validateJobUpdate(job, { ...job, customerId: 'c1' }, [receipt]));
  assert.ok(validateJobUpdate(job, { ...job, total: 499999 }, [receipt]));
  assert.ok(validateJobUpdate(job, { ...job, status: 'cancelled' }, [receipt]));
  assert.equal(validateJobUpdate(job, { ...job, total: 1000000 }, [receipt]), null);
});
