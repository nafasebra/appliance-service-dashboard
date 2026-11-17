import { navigation } from '@/app/const';

export const isPartsRoute = (path: string) => path === '/parts' || path.startsWith('/part-');
export const isTechnicianRoute = (path: string) =>
  path === '/technicians' || path.startsWith('/technician-');

export function getNavigationGroups() {
  return [
    {
      label: 'مدیریت کسب‌وکار',
      items: navigation.filter(
        (item) => !isPartsRoute(item.to) && !isTechnicianRoute(item.to) && item.to !== '/settings',
      ),
    },
    { label: 'مدیریت تعمیرکاران', items: navigation.filter((item) => isTechnicianRoute(item.to)) },
    { label: 'مدیریت قطعات', items: navigation.filter((item) => isPartsRoute(item.to)) },
    { label: 'سیستم', items: navigation.filter((item) => item.to === '/settings') },
  ];
}
