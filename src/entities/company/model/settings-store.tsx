import { createContext, useContext, useState, type ReactNode } from 'react';
import { defaultCompanySettings, isCompanySettings, type CompanySettings } from './settings';

const storageKey = 'hamyar-company-settings-v1';
const SettingsContext = createContext<{
  settings: CompanySettings;
  saveSettings: (value: CompanySettings) => string | null;
} | null>(null);

function readSettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isCompanySettings(parsed)) return parsed;
  } catch {
    /* Fall back to defaults when storage cannot be read. */
  }
  return defaultCompanySettings;
}

export function CompanySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(readSettings);
  function saveSettings(value: CompanySettings): string | null {
    if (!isCompanySettings(value)) return 'نام شرکت، شعبه و ساعت مراجعه را بررسی کنید.';
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
      setSettings(value);
      return null;
    } catch {
      return 'ذخیره‌سازی مرورگر در دسترس نیست؛ تنظیمات ذخیره نشد.';
    }
  }
  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useCompanySettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useCompanySettings requires CompanySettingsProvider');
  return context;
}
