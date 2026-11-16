import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Wrench,
  Users,
  Wallet,
  ChartNoAxesCombined,
  Bell,
  X,
  LifeBuoy,
  RotateCcw,
  FlaskConical,
  ArrowUpLeft,
  Moon,
  Sun,
} from 'lucide-react';
import { useDemo } from '@/features/operations/model/demo-store';
import { useTheme } from '@/shared/lib/theme';
import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/shared/ui/sidebar';

const navigation = [
  { to: '/', label: 'نمای کلی', icon: LayoutDashboard },
  { to: '/requests', label: 'درخواست‌های خدمات', icon: ClipboardList },
  { to: '/dispatch', label: 'برنامه‌ریزی و اعزام', icon: CalendarDays },
  { to: '/technicians', label: 'تعمیرکاران', icon: Wrench },
  { to: '/customers', label: 'مشتریان', icon: Users },
  { to: '/finance', label: 'امور مالی', icon: Wallet },
  { to: '/reports', label: 'گزارش‌ها', icon: ChartNoAxesCombined },
] as const;

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardShell />
    </SidebarProvider>
  );
}

function DashboardShell() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { jobs, storageError, resetDemo } = useDemo();
  const { theme, toggleTheme } = useTheme();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const closeSidebarOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  return (
    <>
      <a
        className="fixed top-[-100px] right-[20px] z-[100] bg-primary text-white p-3 rounded-[6px] [&:focus]:top-[10px]"
        href="#main-content"
      >
        رفتن به محتوای اصلی
      </a>
      <Sidebar
        id="dashboard-sidebar"
        side="right"
        dir="rtl"
        className="p-[31px_18px_16px] max-[1201px]:px-3.5"
      >
        <SidebarHeader className="flex-row items-center p-[0_9px_28px] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-[11px] [&_strong]:text-[19px] [&_strong]:tracking-[-0.6px] [&_strong_span]:block [&_strong_span]:font-[Arial,_sans-serif] [&_strong_span]:text-[8px] [&_strong_span]:tracking-[2.1px] [&_strong_span]:text-[#84908a] [&_strong_span]:mt-[7px]">
          <Link to="/" onClick={closeSidebarOnMobile}>
            <span className="grid place-items-center w-[43px] h-[43px] bg-primary text-white rounded-[13px] rotate-[-7deg]">
              <Wrench size={24} />
            </span>
            <strong>
              همیار سرویس<span>HAMYAR SERVICE</span>
            </strong>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            className="ms-auto grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border border-transparent bg-transparent text-[#89998c] hover:border-[#e3ebe1] hover:bg-[#f0f5ef] dark:hover:border-[#35483f] dark:hover:bg-[#1c2a24]"
            aria-label="بستن منو"
            onClick={() => (isMobile ? setOpenMobile(false) : setOpen(false))}
          >
            <X size={19} />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="bg-[#f7f9f8] border border-border rounded-[9px] p-[12px_10px] text-[11px] flex items-center justify-between [&_>_span]:text-[9px] [&_>_span]:bg-[#eaf2ed] [&_>_span]:text-primary [&_>_span]:p-[3px_6px] [&_>_span]:rounded-[4px] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] dark:[&_>_span]:bg-[#263b31] dark:[&_>_span]:text-[#8fc4a9]">
              پنل مدیریت شرکت<span>نسخه اولیه</span>
            </div>
            <SidebarGroupLabel className="m-[27px_14px_12px] h-auto text-[10px] text-[#a1a9a6]">
              مدیریت کسب‌وکار
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu aria-label="منوی اصلی">
                {navigation.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={to}
                        activeOptions={{ exact: to === '/' }}
                        activeProps={{
                          className:
                            "flex items-center gap-3 min-h-[46px] p-[11px_14px] text-[12px] rounded-[9px] bg-sidebar-accent text-sidebar-accent-foreground font-bold relative [&:before]:content-[''] [&:before]:absolute [&:before]:start-[-18px] [&:before]:h-[24px] [&:before]:w-[3px] [&:before]:rounded-[3px] [&:before]:bg-primary",
                        }}
                        inactiveProps={{
                          className:
                            'flex items-center gap-3 min-h-[46px] p-[11px_14px] text-[#69746e] rounded-[9px] text-[12px] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        }}
                        onClick={closeSidebarOnMobile}
                      >
                        <Icon size={20} strokeWidth={1.7} />
                        <span>{label}</span>
                        {to === '/requests' && (
                          <SidebarMenuBadge className="end-2 top-1/2 -translate-y-1/2 rounded-[5px] bg-[#deebe2] p-[2px_7px] text-[10px] text-primary dark:bg-[#263b31] dark:text-[#8fc4a9]">
                            {new Intl.NumberFormat('fa').format(
                              jobs.filter((job) => job.status === 'new').length,
                            )}
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="pt-[45px]">
          <div className="relative border border-[#e4ece6] bg-[linear-gradient(130deg,_#f2f7f3,_#fff)] rounded-[12px] p-[20px_14px_14px] [&_strong]:text-[12px] [&_p]:text-[10px] [&_p]:text-muted-foreground [&_p]:m-[8px_0_16px] [&_button]:border [&_button]:border-[#d9e3dc] [&_button]:w-full [&_button]:bg-white [&_button]:rounded-[6px] [&_button]:flex [&_button]:items-center [&_button]:justify-between [&_button]:p-[9px] [&_button]:text-[10px] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] dark:[&_strong]:text-[#f1f7f3] dark:[&_button]:bg-[#294538] dark:[&_button]:border-[#3a5e4d] dark:[&_button]:text-[#d3ebdf] dark:[&_button:hover]:bg-[#345846] dark:[&_button:hover]:border-[#4a725f] dark:[&_button:hover]:text-[#ffffff]">
            <span className="grid place-items-center bg-[#e5eee6] text-primary w-[39px] h-[39px] border-[5px] border-white rounded-[12px] mt-[-39px] mb-[13px] dark:bg-[#263b31] dark:text-[#8fc4a9]">
              <LifeBuoy size={23} />
            </span>
            <strong>یک قدم جلوتر از کارها</strong>
            <p>راهنمای استفاده از نسخه نمایشی</p>
            <Button variant="outline" onClick={() => setHelpOpen(true)}>
              راهنمای داشبورد <ArrowUpLeft size={16} />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-[9px] text-[#7a827d] p-[19px_9px] border-0 bg-transparent text-[10px] h-auto"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw size={17} />
            بازنشانی داده‌های نمونه
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="dark:bg-background dark:text-foreground">
        <header className="h-[83px] border-b border-b-[var(--border)] p-[0_36px] bg-white flex items-center justify-between gap-5 max-[1201px]:px-6 max-[761px]:h-[69px] max-[761px]:px-[15px] max-[761px]:gap-2.5 dark:bg-[#17211d] dark:border-border dark:text-foreground dark:border-border">
          <div className="flex gap-5 items-center max-[1201px]:[&_>_.topbar-divider]:hidden max-[761px]:gap-3">
            <SidebarTrigger
              aria-controls="dashboard-sidebar"
              className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border border-transparent bg-transparent text-[#89998c] hover:border-[#e3ebe1] hover:bg-[#f0f5ef] dark:hover:border-[#35483f] dark:hover:bg-[#1c2a24]"
            />
            <span className="text-[12px] text-[#555f59] max-[761px]:text-[10px]">
              مدیریت یکپارچه خدمات
            </span>
            <span className="h-[25px] w-[1px] bg-border" />
            <span className="flex items-center gap-[7px] text-[#7c867f] text-[10px] [&_i]:inline-block [&_i]:h-[6px] [&_i]:w-[6px] [&_i]:rounded-full [&_i]:bg-[#5ea88a] max-[1201px]:hidden">
              <i />
              شعبه تهران
            </span>
          </div>
          <div className="flex gap-5 items-center max-[761px]:gap-3 max-[761px]:[&_>_.topbar-divider]:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="relative grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border-border bg-background text-primary hover:bg-accent"
                  aria-label="مشاهده اعلان‌ها"
                >
                  <Bell size={18} />
                  {jobs.some((job) => job.status === 'new') && (
                    <span className="absolute -end-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] leading-none text-white">
                      {new Intl.NumberFormat('fa').format(
                        jobs.filter((job) => job.status === 'new').length,
                      )}
                    </span>
                  )}
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
                  {jobs.filter((job) => job.status === 'new').length === 0 ? (
                    <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                      اعلان جدیدی ندارید.
                    </p>
                  ) : (
                    jobs
                      .filter((job) => job.status === 'new')
                      .slice(0, 5)
                      .map((job) => (
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
              className="grid place-items-center h-[31px] w-[31px] border border-transparent rounded-[6px] text-[#89998c] bg-transparent shrink-0 [&:hover]:bg-[#f0f5ef] [&:hover]:border-[#e3ebe1] dark:[&:hover]:bg-[#1c2a24] dark:[&:hover]:border-[#35483f] border-border bg-background text-primary"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'فعال‌کردن پوسته روشن' : 'فعال‌کردن پوسته تاریک'}
              title={theme === 'dark' ? 'پوسته روشن' : 'پوسته تاریک'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </header>
        <div className="flex justify-between gap-[15px] p-[10px_36px] text-[#8b938e] text-[9px] border-b border-b-[#e9eeeb] [&_>_span:first-child]:flex [&_>_span:first-child]:gap-1.5 [&_>_span:first-child]:items-center max-[981px]:[&_>_span:last-child]:hidden max-[761px]:p-[10px_18px] max-[761px]:text-[9px] dark:bg-[#131d19] dark:border-border dark:text-[#92a198]">
          <span>
            <FlaskConical size={14} />
            نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.
          </span>
          <span>دوشنبه، ۲۵ آبان ۱۴۰۵ · تاریخ مرجع نمونه</span>
        </div>
        {storageError && (
          <div
            className="p-[12px_36px] bg-[#fff0da] text-[#9d772e] text-[11px] dark:bg-[#3a301e] dark:text-[#e4bd72]"
            role="alert"
          >
            ذخیره‌سازی مرورگر در دسترس نیست؛ تغییرات پس از بستن صفحه حفظ نمی‌شوند.
          </div>
        )}
        <main
          id="main-content"
          className="p-[31px_36px_36px] max-w-[1640px] m-auto p-[30px_36px_35px] max-w-[1700px] mx-auto min-[1600px]:px-12 max-[1201px]:p-[26px_24px] max-[761px]:p-[24px_18px]"
        >
          <Outlet />
        </main>
        <footer className="flex justify-between p-[24px_36px] border-t border-t-[var(--border)] text-[9px] text-[#9fa89f] max-[761px]:p-5 max-[761px]:text-[8px] max-[761px]:[&_>_span:last-child]:hidden dark:border-border">
          <span>همیار سرویس · مدیریت هوشمند خدمات</span>
          <span>طراحی‌شده برای یک تیم هماهنگ‌تر</span>
        </footer>
      </SidebarInset>
      {helpOpen && (
        <Modal title="راهنمای نسخه نمایشی" onClose={() => setHelpOpen(false)}>
          <div className="p-6 [&_p]:text-[12px] [&_p]:text-[#6c7f63] [&_p]:leading-[2.3] [&_p]:mb-[15px]">
            <p>
              از «درخواست جدید» یک خدمت برای مشتریان نمونه ثبت کنید. با بازکردن ردیف درخواست،
              تعمیرکار، زمان مراجعه و وضعیت را تغییر دهید.
            </p>
            <p>
              در صفحه اعزام، تاریخ روز را انتخاب کنید تا برنامه تعمیرکاران نمایش داده شود. دریافت از
              مشتری، هزینه و تسویه تعمیرکار در امور مالی ثبت می‌شود.
            </p>
            <p>
              این نسخه بک‌اند ندارد. اطلاعات فقط در همین مرورگر ذخیره می‌شوند. تومان، وضعیت‌ها و
              جریان پرداخت، انتخاب‌های موقت برای نمایش‌اند.
            </p>
          </div>
        </Modal>
      )}
      {resetOpen && (
        <Modal title="بازنشانی اطلاعات نمونه؟" onClose={() => setResetOpen(false)}>
          <div className="p-6 [&_p]:text-[12px] [&_p]:text-[#6c7f63] [&_p]:leading-[2.3] [&_p]:mb-[15px]">
            <p>
              درخواست‌ها و تراکنش‌هایی که در این مرورگر اضافه یا ویرایش کرده‌اید با داده‌های اولیه
              جایگزین می‌شوند.
            </p>
            <div className="flex gap-[9px] mt-[5px]">
              <Button
                variant="destructive"
                className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-[#b34d4d] border-[#b34d4d] text-white"
                onClick={() => {
                  resetDemo();
                  setResetOpen(false);
                }}
              >
                بازنشانی داده‌ها
              </Button>
              <Button
                variant="outline"
                className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1]"
                onClick={() => setResetOpen(false)}
              >
                انصراف
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
