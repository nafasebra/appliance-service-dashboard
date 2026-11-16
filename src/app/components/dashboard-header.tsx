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
      <header className="flex h-[83px] items-center justify-between gap-5 border-b border-border bg-white p-[0_36px] max-[1201px]:px-6 max-[761px]:h-[69px] max-[761px]:gap-2.5 max-[761px]:px-[15px] dark:bg-[#17211d] dark:text-foreground">
        <div className="flex items-center gap-5 max-[1201px]:[&_>_.topbar-divider]:hidden max-[761px]:gap-3">
          <SidebarTrigger
            aria-controls="dashboard-sidebar"
            className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border border-transparent bg-transparent text-[#89998c] hover:border-[#e3ebe1] hover:bg-[#f0f5ef] dark:hover:border-[#35483f] dark:hover:bg-[#1c2a24]"
          />
          <Breadcrumb>
            <BreadcrumbList className="text-[11px] max-[761px]:text-[10px]">
              {pathname === '/' ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>داشبورد</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem className="max-[480px]:hidden">
                    <BreadcrumbLink asChild>
                      <Link to="/">داشبورد</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="max-[480px]:hidden" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="h-[25px] w-px bg-border" />
          <span className="flex items-center gap-[7px] text-[10px] text-[#7c867f] max-[1201px]:hidden [&_i]:h-[6px] [&_i]:w-[6px] [&_i]:rounded-full [&_i]:bg-[#5ea88a]">
            <i />
            شعبه تهران
          </span>
        </div>

        <div className="flex items-center gap-5 max-[761px]:gap-3">
          <NotificationButton />
          <ThemeToggleButton />
        </div>
      </header>

      <NoticAlert />
    </>
  );
}
