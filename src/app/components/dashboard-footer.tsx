import { useCompanySettings } from '@/entities/company/model/settings-store';

export function DashboardFooter() {
  const settings = useCompanySettings((state) => state.settings);
  return (
    <footer className="flex justify-between border-t border-border py-6 px-9 text-3xs text-muted-foreground max-mobile:p-5 max-mobile:text-4xs max-mobile:[&_>_span:last-child]:hidden">
      <span>
        {settings.companyName} · مدیریت هوشمند خدمات{settings.phone ? ` · ${settings.phone}` : ''}
      </span>
      <span>طراحی‌شده برای یک تیم هماهنگ‌تر</span>
    </footer>
  );
}
