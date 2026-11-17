import { create } from 'zustand';
import { initialPartsData, isPartsData, type PartsData } from './parts.ts';

const storageKey = 'hamyar-parts-v1';
interface PartsState {
  data: PartsData;
  storageError: boolean;
  change: (operation: (data: PartsData) => PartsData) => string | null;
}

function readParts(): PartsData {
  if (typeof window === 'undefined') return structuredClone(initialPartsData);
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isPartsData(parsed)) return parsed;
  } catch {
    /* Use the seed when browser storage cannot be read. */
  }
  return structuredClone(initialPartsData);
}

export const useParts = create<PartsState>((set, get) => ({
  data: readParts(),
  storageError: false,
  change: (operation) => {
    try {
      const data = operation(get().data);
      if (!isPartsData(data)) return 'اطلاعات قطعات معتبر نیست؛ موجودی و مقادیر را بررسی کنید.';
      let storageError = false;
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        storageError = true;
      }
      set({ data, storageError });
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'ثبت اطلاعات انجام نشد.';
    }
  },
}));
