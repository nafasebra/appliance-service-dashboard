import type { ParseKeys } from 'i18next';

// Existing model labels and errors are translated without changing saved records.
export const settingsLabelKeys = {
  'نام شرکت، شعبه و ساعت مراجعه را بررسی کنید.': 'validation.checkTheCompanyNameBranchAndVisitTime',
  'ذخیره‌سازی مرورگر در دسترس نیست؛ تنظیمات ذخیره نشد.':
    'validation.browserStorageIsUnavailableSettingsWereNotSaved',
} as const satisfies Readonly<Record<string, ParseKeys<'settings'>>>;
