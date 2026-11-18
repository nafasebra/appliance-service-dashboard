import type { DemoData, Job, JobStatus } from './types.ts';
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
      if (job.status !== 'new') return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: 'accepted' };
      break;
    case 'assign':
      if (job.status !== 'accepted') return { ok: false, failure: { code: 'invalidTransition' } };
      if (!data.technicians.some((item) => item.id === action.technicianId))
        return { ok: false, failure: { code: 'invalidAssignment' } };
      next = {
        ...job,
        status: 'scheduled',
        technicianId: action.technicianId,
        date: action.date,
        time: action.time,
      };
      break;
    case 'start':
      if (job.status !== 'scheduled') return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: 'working' };
      break;
    case 'complete':
      if (job.status !== 'working') return { ok: false, failure: { code: 'invalidTransition' } };
      if (!validateAmounts(action.total, action.commission) || action.total === 0)
        return { ok: false, failure: { code: 'invalidAmount' } };
      next = { ...job, status: 'completed', total: action.total, commission: action.commission };
      break;
    case 'cancel':
      if (job.status === 'completed' || job.status === 'cancelled')
        return { ok: false, failure: { code: 'invalidTransition' } };
      next = { ...job, status: 'cancelled' };
      break;
  }
  const financialFailure = validateJobUpdate(job, next, data.transactions);
  if (financialFailure)
    return { ok: false, failure: { code: 'financialGuard', message: financialFailure } };
  const updated = { ...data, jobs: data.jobs.map((item) => (item.id === job.id ? next : item)) };
  if (!isDemoData(updated)) return { ok: false, failure: { code: 'invalidData' } };
  return { ok: true, data: updated };
}
