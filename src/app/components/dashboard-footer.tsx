import { useCompanySettings } from '@/shared/store/settings-store';
import { useTranslation } from 'react-i18next';

export function DashboardFooter() {
  const { t } = useTranslation();
  const settings = useCompanySettings((state) => state.settings);
  return (
    <footer className="flex justify-between border-t border-border py-6 px-9 text-3xs text-muted-foreground max-mobile:p-5 max-mobile:text-4xs max-mobile:[&_>_span:last-child]:hidden">
      <span>
        {t('ui.companynameSmartServiceManagement', {
          companyName: settings.companyName,
        })}
        {settings.phone ? ` · ${settings.phone}` : ''}
      </span>
      <span>{t('ui.builtForABetterCoordinatedTeam')}</span>
    </footer>
  );
}
