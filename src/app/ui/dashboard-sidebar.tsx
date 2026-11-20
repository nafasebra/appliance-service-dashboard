import { useSharedTranslation } from '@/shared/hooks';
import { useDashboardTranslation } from '../hooks/use-dashboard-translation';
import { JobStatus, useDemo } from '@/entities/service';
import { translateLabel } from '@/shared/i18n';
import { Link } from '@tanstack/react-router';
import { ArrowUpLeft, LifeBuoy, RotateCcw, Wrench, X } from 'lucide-react';
import { navigationGroups } from '../lib/navigation';
import { useCompanySettings } from '@/entities/company';
import { useDashboardSidebar } from '../hooks/use-dashboard-sidebar';
import { cn } from '@/shared/lib';
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
  const { closeSidebar, closeSidebarOnMobile, isIconOnly, isMobile } = useDashboardSidebar();
  const newJobCount = jobs.filter((job) => job.status === JobStatus.New).length;
  const companyLabel = i18n.dir() === 'ltr' ? settings.brandName : settings.companyName;

  return (
    <Sidebar
      id="dashboard-sidebar"
      side={i18n.dir() === 'rtl' ? 'right' : 'left'}
      className={cn('py-6', isIconOnly ? 'px-2' : 'px-4')}
    >
      <SidebarHeader
        className={cn('flex items-center gap-2 pb-6', isIconOnly ? 'justify-center' : 'px-2')}
      >
        <Link
          to="/"
          onClick={closeSidebarOnMobile}
          aria-label={companyLabel}
          title={isIconOnly ? companyLabel : undefined}
          className="flex min-w-0 items-center gap-3"
        >
          <span className="grid size-10 shrink-0 -rotate-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Wrench size={24} aria-hidden="true" />
          </span>
          {!isIconOnly && (
            <strong className="min-w-0 truncate text-section tracking-tight" title={companyLabel}>
              {companyLabel}
              {i18n.dir() === 'rtl' ? (
                <span className="mt-1 block text-body font-normal text-muted-foreground">
                  {settings.brandName}
                </span>
              ) : null}
            </strong>
          )}
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="ms-auto shrink-0"
            aria-label={tShared('sidebar.closeMenu')}
            onClick={closeSidebar}
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label={tShared('sidebar.navigation')}>
          {navigationGroups.map((group, index) => (
            <SidebarGroup
              key={group.label}
              className={cn(isIconOnly && index > 0 && 'mt-3 border-t border-sidebar-border pt-3')}
            >
              <SidebarGroupLabel
                className={
                  isIconOnly ? 'sr-only' : 'mx-3 mb-3 mt-1 text-caption text-muted-foreground'
                }
              >
                {translateLabel(group.label)}
              </SidebarGroupLabel>
              <SidebarGroupContent className={isIconOnly ? 'pb-0' : 'pb-4'}>
                <SidebarMenu aria-label={translateLabel(group.label)}>
                  {group.items.map(({ to, label, icon: Icon }) => (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={to}
                          aria-label={translateLabel(label)}
                          title={isIconOnly ? translateLabel(label) : undefined}
                          aria-describedby={
                            to === '/requests' && newJobCount > 0
                              ? 'sidebar-request-count'
                              : undefined
                          }
                          activeOptions={{ exact: to === '/' || to === '/cartable' }}
                          className={cn(
                            'relative flex min-h-11 items-center rounded-md transition-colors',
                            isIconOnly ? 'justify-center px-2' : 'gap-3 px-3 py-3',
                          )}
                          activeProps={{
                            className:
                              'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                          }}
                          inactiveProps={{
                            className:
                              'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          }}
                          onClick={closeSidebarOnMobile}
                        >
                          <Icon
                            size={20}
                            strokeWidth={1.7}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                          <span className={isIconOnly ? 'sr-only' : undefined}>
                            {translateLabel(label)}
                          </span>
                          {to === '/requests' && newJobCount > 0 && (
                            <SidebarMenuBadge
                              id="sidebar-request-count"
                              className={cn(
                                'rounded-md bg-muted px-1.5 text-primary',
                                isIconOnly
                                  ? 'end-0 top-0 min-w-4 text-center'
                                  : 'end-2 top-1/2 -translate-y-1/2 py-0.5',
                              )}
                            >
                              {newJobCount}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'flex flex-col gap-3',
          isIconOnly ? 'items-center border-t border-sidebar-border pt-3' : 'pt-10',
        )}
      >
        {isIconOnly ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHelp}
            aria-label={t('guide.dashboardGuide')}
            title={t('guide.dashboardGuide')}
          >
            <LifeBuoy aria-hidden="true" />
          </Button>
        ) : (
          <div className="relative rounded-lg border border-border bg-linear-130 from-accent to-card px-3.5 pb-3.5 pt-5 text-card-foreground">
            <span className="-mt-10 mb-3 grid size-10 place-items-center rounded-lg border border-border bg-accent text-accent-foreground">
              <LifeBuoy size={23} aria-hidden="true" />
            </span>
            <strong className="text-caption text-foreground">{t('guide.stayOneStepAhead')}</strong>
            <p className="mb-4 mt-2 text-caption text-muted-foreground">
              {t('guide.howToUseTheDemo')}
            </p>
            <Button variant="outline" onClick={onOpenHelp} className="w-full justify-between">
              {t('guide.dashboardGuide')} <ArrowUpLeft size={16} aria-hidden="true" />
            </Button>
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size={isIconOnly ? 'icon' : 'default'}
              aria-label={t('reset.resetSampleData')}
              title={isIconOnly ? t('reset.resetSampleData') : undefined}
            >
              <RotateCcw size={17} aria-hidden="true" />
              {!isIconOnly && t('reset.resetSampleData')}
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
