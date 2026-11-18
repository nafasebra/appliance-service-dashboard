import { type DemoData, type Job, JobStatus } from './types.ts';
import { isDemoData, validateJobUpdate } from './validation.ts';
import { validateAmounts } from './finance.ts';

export type JobWorkflowAction =
  | { type: 'accept' }
  | { type: 'assign'; technicianId: string; date: string; time: string }
  | { type: 'start' }
  | { type: 'complete'; total: number; commission: number }
  | { type: 'cancel' };

export type WorkflowFailure =
  | {
      code:
        | 'notFound'
        | 'stale'
        | 'invalidTransition'
        | 'invalidAssignment'
        | 'invalidAmount'
        | 'invalidData';
    }
  | { code: 'financialGuard'; message: string };

type WorkflowResult = { ok: true; data: DemoData } | { ok: false; failure: WorkflowFailure };

export function applyJobWorkflow(
  data: DemoData,
  jobId: string,
  expectedStatus: JobStatus,
  action: JobWorkflowAction,
): WorkflowResult {
  const job = data.jobs.find((item) => item.id === jobId);
  if (!job) return { ok: false, failure: { code: 'notFound' } };
  if (job.status !== expectedStatus) return { ok: false, failure: { code: 'stale' } };
  let next: Job;
  switch (action.type) {
    case 'accept':
      if (job.status !== JobStatus.New)
        return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: JobStatus.Accepted };
      break;
    case 'assign':
      if (job.status !== JobStatus.Accepted)
        return { ok: false, failure: { code: 'invalidTransition' } };
      if (!data.technicians.some((item) => item.id === action.technicianId))
        return { ok: false, failure: { code: 'invalidAssignment' } };
      next = {
        ...job,
        status: JobStatus.Scheduled,
        technicianId: action.technicianId,
        date: action.date,
        time: action.time,
      };
      break;
    case 'start':
      if (job.status !== JobStatus.Scheduled)
        return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: JobStatus.Working };
      break;
    case 'complete':
      if (job.status !== JobStatus.Working)
        return { ok: false, failure: { code: 'invalidTransition' } };
      if (!validateAmounts(action.total, action.commission) || action.total === 0)
        return { ok: false, failure: { code: 'invalidAmount' } };
      next = {
        ...job,
        status: JobStatus.Completed,
        total: action.total,
        commission: action.commission,
      };
      break;
    case 'cancel':
      if (job.status === JobStatus.Completed || job.status === JobStatus.Cancelled)
        return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: JobStatus.Cancelled };
      break;
  }
  const financialFailure = validateJobUpdate(job, next, data.transactions);
  if (financialFailure)
    return { ok: false, failure: { code: 'financialGuard', message: financialFailure } };
  const updated = { ...data, jobs: data.jobs.map((item) => (item.id === job.id ? next : item)) };
  if (!isDemoData(updated)) return { ok: false, failure: { code: 'invalidData' } };
  return { ok: true, data: updated };
}
