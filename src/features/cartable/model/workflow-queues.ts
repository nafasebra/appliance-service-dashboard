import type { Job, Transaction } from '../../../entities/service/model/types.ts';
import { getOrderAccount } from '../../../entities/service/model/customer-account.ts';

export const workflowQueues = [
  'inbox',
  'assignment',
  'active',
  'collection',
  'settlement',
  'archive',
] as const;
export type WorkflowQueue = (typeof workflowQueues)[number];

export function getWorkflowAccount(job: Job, transactions: Transaction[]) {
  const account = getOrderAccount(job, transactions);
  const payouts = transactions.reduce(
    (sum, item) => sum + (item.jobId === job.id && item.kind === 'payout' ? item.amount : 0),
    0,
  );
  return {
    ...account,
    payable: job.status === 'completed' ? Math.max(0, job.total - job.commission - payouts) : 0,
  };
}

export function getWorkflowQueue(job: Job, transactions: Transaction[]): WorkflowQueue {
  if (job.status === 'new') return 'inbox';
  if (job.status === 'accepted') return 'assignment';
  if (job.status === 'scheduled' || job.status === 'working') return 'active';
  if (job.status === 'cancelled') return 'archive';
  const account = getWorkflowAccount(job, transactions);
  if (account.outstanding > 0) return 'collection';
  if (account.payable > 0) return 'settlement';
  return 'archive';
}
