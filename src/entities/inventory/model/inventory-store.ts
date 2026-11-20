import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { initialPartsData, isPartsData, type PartsData } from './parts';

const storageKey = 'hamyar-parts-v1';
export interface PartsState {
  data: PartsData;
  storageError: boolean;
}

export interface PartsActions {
  change: (operation: (data: PartsData) => PartsData) => string | null;
}

export type PartsStore = PartsState & PartsActions;

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

export const useParts = create<PartsStore>()(
  subscribeWithSelector((set, get) => ({
    data: readParts(),
    storageError: false,
    change: (operation) => {
      try {
        // Isolate callbacks so rejected or throwing operations cannot mutate live state.
        const data = structuredClone(operation(structuredClone(get().data)));
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
  })),
);
