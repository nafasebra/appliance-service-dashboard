import type { ParseKeys } from 'i18next';

// Existing model labels and errors are translated without changing saved records.
export const techniciansLabelKeys = {
  'نام، تلفن، تخصص و محدوده فعالیت را کامل وارد کنید.':
    'validation.enterTheTechnicianSNamePhoneSpecialtyAnd',
} as const satisfies Readonly<Record<string, ParseKeys<'technicians'>>>;
