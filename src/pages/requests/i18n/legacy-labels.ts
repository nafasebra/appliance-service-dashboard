import type { ParseKeys } from 'i18next';
export const requestsPageLabelKeys = {
  'درخواست‌های خدمات': 'navigation.serviceRequests',
  'درخواست جدید': 'actions.newRequest',
} as const satisfies Readonly<Record<string, ParseKeys<'requests-page'>>>;
