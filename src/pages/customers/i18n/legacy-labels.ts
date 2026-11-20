import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const customersLabelKeys = {
  مشتریان: 'navigation.customers',
  'مریم احمدی': 'demo.customers.c1.name',
  'علی رضایی': 'demo.customers.c2.name',
  'سارا محمدی': 'demo.customers.c3.name',
  'حسین کریمی': 'demo.customers.c4.name',
  'نگار موسوی': 'demo.customers.c5.name',
  'رضا نادری': 'demo.customers.c6.name',
  'تهران، سعادت‌آباد، خیابان سرو': 'demo.customers.c1.address',
  'تهران، پونک، خیابان همیلا': 'demo.customers.c2.address',
  'تهران، شهرک غرب، بلوار دادمان': 'demo.customers.c3.address',
  'تهران، جنت‌آباد، خیابان بهار': 'demo.customers.c4.address',
  'تهران، مرزداران، خیابان الوند': 'demo.customers.c5.address',
  'تهران، ونک، خیابان ملاصدرا': 'demo.customers.c6.address',
} as const satisfies Readonly<Record<string, ParseKeys<'customers'>>>;
