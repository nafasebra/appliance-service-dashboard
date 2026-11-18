import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const reportsLabelKeys = {
  گزارش‌ها: 'navigation.reports',
} as const satisfies Readonly<Record<string, ParseKeys<'reports'>>>;
