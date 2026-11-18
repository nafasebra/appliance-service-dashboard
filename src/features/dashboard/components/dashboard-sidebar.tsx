import { useSharedTranslation } from '@/shared/i18n/use-shared-translation';
import { useDashboardTranslation } from '@/features/dashboard/i18n/use-dashboard-translation';
import { JobStatus } from '@/entities/service/model/types';
import { translateLabel } from '@/shared/i18n';
import { Link } from '@tanstack/react-router';
import { ArrowUpLeft, LifeBuoy, RotateCcw, Wrench, X } from 'lucide-react';
import { navigationGroups } from '@/features/dashboard/utils/navigation';
import { useCompanySettings } from '@/shared/store/settings-store';
import { useDashboardSidebar } from '@/features/dashboard/hooks/use-dashboard-sidebar';
import { useDemo } from '@/shared/store/demo-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { useTranslation } from 'react-i18next';

export function DashboardSidebar({ onOpenHelp }: { onOpenHelp: () => void }) {
  const t = useDashboardTranslation();
  const tShared = useSharedTranslation();
  const { i18n } = useTranslation();
  const settings = useCompanySettings((state) => state.settings);
  const jobs = useDemo((state) => state.jobs);
  const resetDemo = useDemo((state) => state.resetDemo);
  const { closeSidebar, closeSidebarOnMobile } = useDashboardSidebar();
  let newJobCount = 0;

  for (const job of jobs) {
    if (job.status === JobStatus.New) newJobCount += 1;
  }

  return (
    <Sidebar
      id="dashboard-sidebar"
      side={i18n.dir() === 'rtl' ? 'right' : 'left'}
      className="pt-7.75 px-4.5 pb-4 max-desktop:px-3.5"
    >
      <SidebarHeader className="flex flex-row items-center gap-2 pt-0 px-2.25 pb-7 [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-2.75 [&_strong]:text-lg [&_strong]:tracking-tight [&_strong_span]:mt-1.75 [&_strong_span]:block [&_strong_span]:font-latin [&_strong_span]:text-4xs [&_strong_span]:tracking-widest [&_strong_span]:text-muted-foreground">
        <Link to="/" onClick={closeSidebarOnMobile}>
          <span className="grid h-10.75 w-10.75 -rotate-7 place-items-center rounded-lg bg-primary text-white">
            <Wrench size={24} />
          </span>
          <strong className="min-w-0 truncate" title={settings.companyName}>
            {settings.companyName}
            <span>{settings.brandName}</span>
          </strong>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className="grid h-7.75 w-7.75 shrink-0 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent dark:hover:border-border dark:hover:bg-accent"
          aria-label={tShared('sidebar.closeMenu')}
          onClick={closeSidebar}
        >
          <X size={19} />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="mt-1 mx-3.5 mb-3 h-auto text-2xs text-muted-foreground">
              {translateLabel(group.label)}
            </SidebarGroupLabel>
            <SidebarGroupContent className="hide-scrollbar pb-4">
              <SidebarMenu aria-label={translateLabel(group.label)} className="hide-scrollbar">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={to}
                        activeOptions={{ exact: to === '/' || to === '/cartable' }}
                        activeProps={{
                          className:
                            "relative flex min-h-11.5 items-center gap-3 rounded-md bg-sidebar-accent py-2.75 px-3.5 text-xs font-bold text-sidebar-accent-foreground before:absolute before:-start-4.5 before:h-6 before:w-0.75 before:rounded-xs before:bg-primary before:content-['']",
                        }}
                        inactiveProps={{
                          className:
                            'flex min-h-11.5 items-center gap-3 rounded-md py-2.75 px-3.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        }}
                        onClick={closeSidebarOnMobile}
                      >
                        <Icon size={20} strokeWidth={1.7} />
                        <span>{translateLabel(label)}</span>
                        {to === '/requests' ? (
                          <SidebarMenuBadge className="end-2 top-1/2 -translate-y-1/2 rounded-md bg-muted py-0.5 px-1.75 text-2xs text-primary dark:bg-accent dark:text-primary">
                            {newJobCount}
                          </SidebarMenuBadge>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="pt-11.25">
        <div className="relative rounded-lg border border-border bg-linear-130 from-accent to-card px-3.5 pt-5 pb-3.5 text-card-foreground">
          <span className="mb-3.25 -mt-9.75 grid size-9.75 place-items-center rounded-lg border border-border bg-accent text-accent-foreground">
            <LifeBuoy size={23} />
          </span>
          <strong className="text-xs text-foreground">{t('guide.stayOneStepAhead')}</strong>
          <p className="mt-2 mb-4 text-2xs text-muted-foreground">{t('guide.howToUseTheDemo')}</p>
          <Button
            variant="outline"
            className="w-full justify-between border-border bg-card p-2.25 text-2xs text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={onOpenHelp}
          >
            {t('guide.dashboardGuide')} <ArrowUpLeft size={16} />
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto items-center gap-2.25 border-0 bg-transparent py-4.75 px-2.25 text-2xs text-muted-foreground"
            >
              <RotateCcw size={17} />
              {t('reset.resetSampleData')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('reset.resetSampleRecords')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('reset.requestsAndTransactionsAddedOrEditedInThis')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tShared('actions.cancel2')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={resetDemo}>
                {t('reset.resetData')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
