import { create } from 'zustand';
import { appendTransaction } from './customer-account.ts';
import { initialData } from './demo-data.ts';
import type { DemoData, Job, Transaction, Technician } from './types.ts';
import { isDemoData, validateJobUpdate } from './validation.ts';

const storageKey = 'hamyar-service-demo-v1';
interface DemoState extends DemoData {
  saveTechnician: (technician: Technician) => string | null;
  saveJob: (job: Job) => string | null;
  addTransaction: (transaction: Transaction) => string | null;
  resetDemo: () => void;
  storageError: boolean;
}

function readDemo(): DemoData {
  if (typeof window === 'undefined') return structuredClone(initialData);
  try {
    const stored = localStorage.getItem(storageKey);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (isDemoData(parsed)) return parsed;
  } catch {
    /* Invalid or unavailable storage falls back to the demo seed. */
  }
  return structuredClone(initialData);
}

export const useDemo = create<DemoState>((set, get) => {
  function update(data: DemoData) {
    let storageError = false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      storageError = true;
    }
    set({ ...data, storageError });
  }
  function records(): DemoData {
    const { jobs, customers, technicians, transactions } = get();
    return { jobs, customers, technicians, transactions };
  }
  return {
    ...readDemo(),
    storageError: false,
    saveTechnician: (technician) => {
      const data = records();
      const next = {
        ...data,
        technicians: data.technicians.some((item) => item.id === technician.id)
          ? data.technicians.map((item) => (item.id === technician.id ? technician : item))
          : [...data.technicians, technician],
      };
      if (!isDemoData(next)) return 'نام، تلفن، تخصص و محدوده فعالیت را کامل وارد کنید.';
      update(next);
      return null;
    },
    saveJob: (job) => {
      const data = records();
      const failure = validateJobUpdate(
        data.jobs.find((item) => item.id === job.id),
        job,
        data.transactions,
      );
      if (failure) return failure;
      const next = {
        ...data,
        jobs: data.jobs.some((item) => item.id === job.id)
          ? data.jobs.map((item) => (item.id === job.id ? job : item))
          : [job, ...data.jobs],
      };
      if (!isDemoData(next)) return 'اطلاعات سفارش معتبر نیست.';
      update(next);
      return null;
    },
    addTransaction: (transaction) => {
      try {
        update(appendTransaction(records(), transaction));
        return null;
      } catch (error) {
        return error instanceof Error ? error.message : 'ثبت تراکنش انجام نشد.';
      }
    },
    resetDemo: () => update(structuredClone(initialData)),
  };
});
