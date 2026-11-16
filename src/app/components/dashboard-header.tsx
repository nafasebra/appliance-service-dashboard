import { Link, useRouterState } from '@tanstack/react-router';
import { Bell, FlaskConical, Moon, Sun } from 'lucide-react';
import { navigation } from '@/app/const';
import { useDemo } from '@/features/operations/model/demo-store';
import { useTheme } from '@/shared/lib/theme';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { SidebarTrigger } from '@/shared/ui/sidebar';

const persianNumber = new Intl.NumberFormat('fa');

export function DashboardHeader() {
  const { jobs } = useDemo();
  const { theme, toggleTheme } = useTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const currentPage = navigation.find((item) => item.to === pathname)?.label ?? 'داشبورد';
  const newJobs = jobs.filter((job) => job.status === 'new');

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="relative grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border-border bg-background text-primary hover:bg-accent"
                aria-label="مشاهده اعلان‌ها"
              >
                <Bell size={18} />
                {newJobs.length > 0 ? (
                  <span className="absolute -end-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] leading-none text-white">
                    {persianNumber.format(newJobs.length)}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[340px] p-0 max-[380px]:w-[calc(100vw-32px)]"
            >
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-bold">اعلان‌ها</h2>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  آخرین درخواست‌های نیازمند بررسی
                </p>
              </div>
              <div className="max-h-[320px] overflow-y-auto p-2">
                {newJobs.length === 0 ? (
                  <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                    اعلان جدیدی ندارید.
                  </p>
                ) : (
                  newJobs.slice(0, 5).map((job) => (
                    <Link
                      key={job.id}
                      to="/requests"
                      className="flex gap-3 rounded-md px-3 py-3 hover:bg-accent"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="min-w-0">
                        <strong className="block truncate text-xs">
                          درخواست جدید {job.appliance}
                        </strong>
                        <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                          {job.issue}
                        </span>
                        <span className="mt-1.5 block text-[9px] text-muted-foreground">
                          {job.date} · {job.time}
                        </span>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon-sm"
            className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border-border bg-background text-primary hover:bg-accent"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'فعال‌کردن پوسته روشن' : 'فعال‌کردن پوسته تاریک'}
            title={theme === 'dark' ? 'پوسته روشن' : 'پوسته تاریک'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </header>

      <div className="flex justify-between gap-[15px] border-b border-[#e9eeeb] p-[10px_36px] text-[9px] text-[#8b938e] max-[981px]:[&_>_span:last-child]:hidden max-[761px]:p-[10px_18px] max-[761px]:text-[9px] dark:border-border dark:bg-[#131d19] dark:text-[#92a198] [&_>_span:first-child]:flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-1.5">
        <span>
          <FlaskConical size={14} />
          نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.
        </span>
        <span>دوشنبه، ۲۵ آبان ۱۴۰۵ · تاریخ مرجع نمونه</span>
      </div>
    </>
  );
}
