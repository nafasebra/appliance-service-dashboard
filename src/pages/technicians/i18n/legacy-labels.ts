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
  'محمد حسینی': 'demo.technicians.t1.name',
  'امیر محمدی': 'demo.technicians.t2.name',
  'علی کاظمی': 'demo.technicians.t3.name',
  'مهدی رستمی': 'demo.technicians.t4.name',
  'یخچال و فریزر': 'demo.technicians.t1.specialty',
  'لباسشویی و ظرفشویی': 'demo.technicians.t2.specialty',
  'اجاق گاز و فر': 'demo.technicians.t4.specialty',
  'غرب تهران': 'demo.technicians.t1.area',
  'شمال غرب تهران': 'demo.technicians.t2.area',
  'مرکز تهران': 'demo.technicians.t3.area',
} as const satisfies Readonly<Record<string, ParseKeys<'technicians'>>>;
