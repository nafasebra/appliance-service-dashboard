import { create } from 'zustand';
import { defaultCompanySettings, isCompanySettings, type CompanySettings } from './settings.ts';

const storageKey = 'hamyar-company-settings-v1';
interface CompanySettingsState {
  settings: CompanySettings;
  saveSettings: (value: CompanySettings) => string | null;
}

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

export const useCompanySettings = create<CompanySettingsState>((set) => ({
  settings: readSettings(),
  saveSettings: (settings) => {
    if (!isCompanySettings(settings)) return 'نام شرکت، شعبه و ساعت مراجعه را بررسی کنید.';
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      return 'ذخیره‌سازی مرورگر در دسترس نیست؛ تنظیمات ذخیره نشد.';
    }
    set({ settings });
    return null;
  },
}));
