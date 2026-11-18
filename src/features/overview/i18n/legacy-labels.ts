import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const overviewLabelKeys = {
  'نمای کلی': 'navigation.overview',
} as const satisfies Readonly<Record<string, ParseKeys<'overview'>>>;
