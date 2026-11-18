import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const settingsLabelKeys = {
  'نام شرکت، شعبه و ساعت مراجعه را بررسی کنید.': 'validation.checkTheCompanyNameBranchAndVisitTime',
  'ذخیره‌سازی مرورگر در دسترس نیست؛ تنظیمات ذخیره نشد.':
    'validation.browserStorageIsUnavailableSettingsWereNotSaved',
  تنظیمات: 'navigation.settings',
} as const satisfies Readonly<Record<string, ParseKeys<'settings'>>>;
