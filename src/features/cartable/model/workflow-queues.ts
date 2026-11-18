import { JobStatus, type Job, type Transaction } from '../../../entities/service/model/types.ts';

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
    payable:
      job.status === JobStatus.Completed ? Math.max(0, job.total - job.commission - payouts) : 0,
  };
}

export function getWorkflowQueue(job: Job, transactions: Transaction[]): WorkflowQueue {
  if (job.status === JobStatus.New) return 'inbox';
  if (job.status === JobStatus.Accepted) return 'assignment';
  if (job.status === JobStatus.Scheduled || job.status === JobStatus.Working) return 'active';
  if (job.status === JobStatus.Cancelled) return 'archive';
  const account = getWorkflowAccount(job, transactions);
  if (account.outstanding > 0) return 'collection';
  if (account.payable > 0) return 'settlement';
  return 'archive';
}
