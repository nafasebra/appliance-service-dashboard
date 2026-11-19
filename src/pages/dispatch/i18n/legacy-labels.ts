import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const dispatchLabelKeys = {
  'برنامه‌ریزی و اعزام': 'navigation.schedulingAndDispatch',
} as const satisfies Readonly<Record<string, ParseKeys<'dispatch'>>>;
