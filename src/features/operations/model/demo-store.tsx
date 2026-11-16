import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialData } from './demo-data';
import type { DemoData, Job, Transaction } from './types';
import { isDemoData, validateJobUpdate } from './validation';

const storageKey = 'hamyar-service-demo-v1';
interface DemoContextValue extends DemoData {
  saveJob: (job: Job) => string | null;
  addTransaction: (transaction: Transaction) => void;
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
  const [storageError, setStorageError] = useState(false);
  function update(next: DemoData) {
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
        saveJob: (job) => {
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
        addTransaction: (transaction) =>
          update({ ...data, transactions: [...data.transactions, transaction] }),
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
