import { useDashboardTranslation } from '@/features/dashboard/hooks/use-dashboard-translation';
import { translateLabel } from '@/shared/i18n';
import { Link, useRouterState } from '@tanstack/react-router';
import { navigation } from '@/features/dashboard/const/navigation';
import { NotificationButton } from '@/features/dashboard/components/notification-button';
import { LanguageSwitcher } from '@/shared/components/language-switcher';
import { ThemeToggleButton } from '@/shared/components/theme-toggle-button';
import { NoticAlert } from '@/features/dashboard/components/notic-alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { useCompanySettings } from '@/shared/store/settings-store';

export function DashboardHeader() {
  const t = useDashboardTranslation();
  const settings = useCompanySettings((state) => state.settings);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const currentPage =
    navigation.find((item) => item.to === pathname)?.label ?? t('navigation.dashboard');

  return (
    <>
      <header className="flex h-20.75 items-center justify-between gap-5 border-b border-border bg-white py-0 px-9 max-desktop:px-6 max-mobile:h-17.25 max-mobile:gap-2.5 max-mobile:px-3.75 dark:bg-card dark:text-foreground">
        <div className="flex min-w-0 items-center gap-5 max-desktop:[&_>_.topbar-divider]:hidden max-mobile:gap-3">
          <SidebarTrigger
            aria-controls="dashboard-sidebar"
            className="grid h-7.75 w-7.75 shrink-0 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent dark:hover:border-border dark:hover:bg-accent"
          />
          <Breadcrumb>
            <BreadcrumbList className="text-ui max-mobile:text-2xs">
              {pathname === '/' ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('navigation.dashboard')}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem className="max-phone:hidden">
                    <BreadcrumbLink asChild>
                      <Link to="/">{t('navigation.dashboard')}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="max-phone:hidden" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="truncate max-mobile:max-w-24">
                      {translateLabel(currentPage)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="h-6.25 w-px bg-border" />
          <span className="flex items-center gap-1.75 text-2xs text-muted-foreground max-desktop:hidden [&_i]:h-1.5 [&_i]:w-1.5 [&_i]:rounded-full [&_i]:bg-primary">
            <i />
            {settings.branchName}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5 max-mobile:gap-1.5">
          <LanguageSwitcher />
          <NotificationButton />
          <ThemeToggleButton />
        </div>
      </header>

      <NoticAlert />
    </>
  );
}
