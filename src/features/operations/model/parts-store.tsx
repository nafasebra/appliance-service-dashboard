import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { initialPartsData, isPartsData, type PartsData } from './parts';

const storageKey = 'hamyar-parts-v1';
interface PartsContextValue {
  data: PartsData;
  storageError: boolean;
  change: (operation: (data: PartsData) => PartsData) => string | null;
}
const PartsContext = createContext<PartsContextValue | null>(null);

function readParts(): PartsData {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isPartsData(parsed)) return parsed;
  } catch {
    /* Use the seed when browser storage is unavailable. */
  }
  return structuredClone(initialPartsData);
}

export function PartsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(readParts);
  const current = useRef(data);
  const [storageError, setStorageError] = useState(false);
  function change(operation: (data: PartsData) => PartsData): string | null {
    try {
      const next = operation(current.current);
      if (!isPartsData(next)) return 'اطلاعات قطعات معتبر نیست؛ موجودی و مقادیر را بررسی کنید.';
      current.current = next;
      setData(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'ثبت اطلاعات انجام نشد.';
    }
  }
  return (
    <PartsContext.Provider value={{ data, change, storageError }}>{children}</PartsContext.Provider>
  );
}

export function useParts() {
  const context = useContext(PartsContext);
  if (!context) throw new Error('useParts requires PartsProvider');
  return context;
}
