import { Link, useRouterState } from '@tanstack/react-router';
import { navigation } from '@/app/const';
import { NotificationButton } from '@/app/components/notification-button';
import { ThemeToggleButton } from '@/app/components/theme-toggle-button';
import { NoticAlert } from '@/app/components/notic-alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { SidebarTrigger } from '@/shared/ui/sidebar';

export function DashboardHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const currentPage = navigation.find((item) => item.to === pathname)?.label ?? 'داشبورد';

  return (
    <>
      <header className="flex h-20.75 items-center justify-between gap-5 border-b border-border bg-white py-0 px-9 max-desktop:px-6 max-mobile:h-17.25 max-mobile:gap-2.5 max-mobile:px-3.75 dark:bg-card dark:text-foreground">
        <div className="flex items-center gap-5 max-desktop:[&_>_.topbar-divider]:hidden max-mobile:gap-3">
          <SidebarTrigger
            aria-controls="dashboard-sidebar"
            className="grid h-7.75 w-7.75 shrink-0 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent dark:hover:border-border dark:hover:bg-accent"
          />
          <Breadcrumb>
            <BreadcrumbList className="text-ui max-mobile:text-2xs">
              {pathname === '/' ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>داشبورد</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem className="max-phone:hidden">
                    <BreadcrumbLink asChild>
                      <Link to="/">داشبورد</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="max-phone:hidden" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="h-6.25 w-px bg-border" />
          <span className="flex items-center gap-1.75 text-2xs text-muted-foreground max-desktop:hidden [&_i]:h-1.5 [&_i]:w-1.5 [&_i]:rounded-full [&_i]:bg-primary">
            <i />
            شعبه تهران
          </span>
        </div>

        <div className="flex items-center gap-5 max-mobile:gap-3">
          <NotificationButton />
          <ThemeToggleButton />
        </div>
      </header>

      <NoticAlert />
    </>
  );
}
