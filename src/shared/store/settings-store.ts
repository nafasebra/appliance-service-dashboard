import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  defaultCompanySettings,
  isCompanySettings,
  type CompanySettings,
} from '../../entities/company/model/settings.ts';

const storageKey = 'hamyar-company-settings-v1';
export interface CompanySettingsState {
  settings: CompanySettings;
}

export interface CompanySettingsActions {
  saveSettings: (value: CompanySettings) => string | null;
}

export type CompanySettingsStore = CompanySettingsState & CompanySettingsActions;

function readSettings(): CompanySettings {
  if (typeof window === 'undefined') return { ...defaultCompanySettings };
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isCompanySettings(parsed)) return parsed;
  } catch {
    /* Fall back to defaults when storage cannot be read. */
  }
  return { ...defaultCompanySettings };
}

export const useCompanySettings = create<CompanySettingsStore>()(
  subscribeWithSelector((set) => ({
    settings: readSettings(),
    saveSettings: (settings) => {
      if (!isCompanySettings(settings)) return 'نام شرکت، شعبه و ساعت مراجعه را بررسی کنید.';
      settings = structuredClone(settings);
      try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
      } catch {
        return 'ذخیره‌سازی مرورگر در دسترس نیست؛ تنظیمات ذخیره نشد.';
      }
      set({ settings });
      return null;
    },
  })),
);
