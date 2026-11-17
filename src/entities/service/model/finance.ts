import type { Job, Transaction } from './types.ts';

export function summarizeFinance(jobs: Job[], transactions: Transaction[]) {
  const completed = jobs.filter((job) => job.status === 'completed');
  const serviceValue = completed.reduce((sum, job) => sum + job.total, 0);
  const commission = completed.reduce((sum, job) => sum + job.commission, 0);
  const receipts = transactions
    .filter((item) => item.kind === 'receipt')
    .reduce((sum, item) => sum + item.amount, 0);
  const payouts = transactions
    .filter((item) => item.kind === 'payout')
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.kind === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  const payable = completed.reduce((sum, job) => {
    const paid = transactions
      .filter((item) => item.jobId === job.id && item.kind === 'payout')
      .reduce((total, item) => total + item.amount, 0);
    return sum + Math.max(0, job.total - job.commission - paid);
  }, 0);
  return {
    serviceValue,
    commission,
    receipts,
    payouts,
    expenses,
    cashFlow: receipts - payouts - expenses,
    payable,
  };
}

export function validateAmounts(total: number, commission: number) {
  return (
    Number.isSafeInteger(total) &&
    Number.isSafeInteger(commission) &&
    total >= 0 &&
    commission >= 0 &&
    commission <= total
  );
}
