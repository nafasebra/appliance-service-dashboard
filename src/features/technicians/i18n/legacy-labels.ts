import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const techniciansLabelKeys = {
  'نام، تلفن، تخصص و محدوده فعالیت را کامل وارد کنید.':
    'validation.enterTheTechnicianSNamePhoneSpecialtyAnd',
  'تخصص‌های تعمیرکاران': 'navigation.technicianSpecialties',
  تعمیرکار: 'common.technician',
  'انتخاب تعمیرکار': 'common.selectTechnician',
  'مدیریت تعمیرکاران': 'navigation.technicianManagement',
  'امور مالی تعمیرکاران': 'navigation.technicianFinances',
  'سفارش‌های در دست انجام': 'navigation.activeOrders',
  تعمیرکاران: 'navigation.technicians',
} as const satisfies Readonly<Record<string, ParseKeys<'technicians'>>>;
