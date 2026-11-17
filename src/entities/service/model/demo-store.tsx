import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { appendTransaction } from './customer-account';
import { initialData } from './demo-data';
import type { DemoData, Job, Transaction, Technician } from './types';
import { isDemoData, validateJobUpdate } from './validation';

const storageKey = 'hamyar-service-demo-v1';
interface DemoContextValue extends DemoData {
  saveTechnician: (technician: Technician) => string | null;
  saveJob: (job: Job) => string | null;
  addTransaction: (transaction: Transaction) => string | null;
  resetDemo: () => void;
  storageError: boolean;
}
const DemoContext = createContext<DemoContextValue | null>(null);

function readDemo(): DemoData {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isDemoData(parsed)) return parsed;
    }
  } catch {
    /* A blocked or damaged browser store falls back to the demo seed. */
  }
  return initialData;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(readDemo);
  const current = useRef(data);
  const [storageError, setStorageError] = useState(false);
  function update(next: DemoData) {
    current.current = next;
    setData(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  return (
    <DemoContext.Provider
      value={{
        ...data,
        storageError,
        saveTechnician: (technician) => {
          const data = current.current;
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
          const data = current.current;
          const validationError = validateJobUpdate(
            data.jobs.find((item) => item.id === job.id),
            job,
            data.transactions,
          );
          if (validationError) return validationError;
          update({
            ...data,
            jobs: data.jobs.some((item) => item.id === job.id)
              ? data.jobs.map((item) => (item.id === job.id ? job : item))
              : [job, ...data.jobs],
          });
          return null;
        },
        addTransaction: (transaction) => {
          try {
            update(appendTransaction(current.current, transaction));
            return null;
          } catch (error) {
            return error instanceof Error ? error.message : 'ثبت تراکنش انجام نشد.';
          }
        },
        resetDemo: () => update(structuredClone(initialData)),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
