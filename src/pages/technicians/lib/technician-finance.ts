import { JobStatus, type Job, type Transaction } from '@/entities/service';

export function getJobPayable(id: string, jobs: Job[], transactions: Transaction[]): number {
  const job = jobs.find((item) => item.id === id);
  if (!job || job.status !== JobStatus.Completed) return 0;
  return (
    job.total -
    job.commission -
    transactions.reduce(
      (sum, item) => sum + (item.jobId === id && item.kind === 'payout' ? item.amount : 0),
      0,
    )
  );
}
