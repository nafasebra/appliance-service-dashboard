import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Wrench,
  Users,
  Wallet,
  ChartNoAxesCombined,
} from 'lucide-react';

export const navigation = [
  { to: '/', label: 'نمای کلی', icon: LayoutDashboard },
  { to: '/requests', label: 'درخواست‌های خدمات', icon: ClipboardList },
  { to: '/dispatch', label: 'برنامه‌ریزی و اعزام', icon: CalendarDays },
  { to: '/technicians', label: 'تعمیرکاران', icon: Wrench },
  { to: '/customers', label: 'مشتریان', icon: Users },
  { to: '/finance', label: 'امور مالی', icon: Wallet },
  { to: '/reports', label: 'گزارش‌ها', icon: ChartNoAxesCombined },
] as const;
