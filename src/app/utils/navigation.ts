import { navigation } from '@/app/const';

export const isPartsRoute = (path: string) => path === '/parts' || path.startsWith('/part-');
export const isTechnicianRoute = (path: string) =>
  path === '/technicians' || path.startsWith('/technician-');
const isFinanceRoute = (path: string) =>
  ['/finance', '/customer-accounts', '/receivables', '/receipts', '/expenses'].includes(path);
const isCartableRoute = (path: string) => path === '/cartable' || path.startsWith('/cartable/');

export const navigationGroups = [
  { label: 'cartable:title', items: navigation.filter((item) => isCartableRoute(item.to)) },
  {
    label: 'مدیریت کسب‌وکار',
    items: navigation.filter(
      (item) =>
        !isPartsRoute(item.to) &&
        !isTechnicianRoute(item.to) &&
        !isFinanceRoute(item.to) &&
        !isCartableRoute(item.to) &&
        item.to !== '/settings',
    ),
  },
  { label: 'مدیریت تعمیرکاران', items: navigation.filter((item) => isTechnicianRoute(item.to)) },
  { label: 'مدیریت قطعات', items: navigation.filter((item) => isPartsRoute(item.to)) },
  { label: 'حسابداری و امور مالی', items: navigation.filter((item) => isFinanceRoute(item.to)) },
  { label: 'سیستم', items: navigation.filter((item) => item.to === '/settings') },
];
