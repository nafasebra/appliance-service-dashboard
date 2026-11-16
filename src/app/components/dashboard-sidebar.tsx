import { Link } from '@tanstack/react-router';
import { ArrowUpLeft, LifeBuoy, RotateCcw, Wrench, X } from 'lucide-react';
import { navigation } from '@/app/const';
import { useDashboardSidebar } from '@/app/hooks/use-dashboard-sidebar';
import { useDemo } from '@/features/operations/model/demo-store';
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

const persianNumber = new Intl.NumberFormat('fa');

export function DashboardSidebar({ onOpenHelp }: { onOpenHelp: () => void }) {
  const { jobs, resetDemo } = useDemo();
  const { closeSidebar, closeSidebarOnMobile } = useDashboardSidebar();
  let newJobCount = 0;

  for (const job of jobs) {
    if (job.status === 'new') newJobCount += 1;
  }

  return (
    <Sidebar
      id="dashboard-sidebar"
      side="right"
      dir="rtl"
      className="p-[31px_18px_16px] max-[1201px]:px-3.5"
    >
      <SidebarHeader className="flex-row items-center gap-2 p-[0_9px_28px] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-[11px] [&_strong]:text-[19px] [&_strong]:tracking-[-0.6px] [&_strong_span]:mt-[7px] [&_strong_span]:block [&_strong_span]:font-[Arial,_sans-serif] [&_strong_span]:text-[8px] [&_strong_span]:tracking-[2.1px] [&_strong_span]:text-[#84908a]">
        <Link to="/" onClick={closeSidebarOnMobile}>
          <span className="grid h-[43px] w-[43px] -rotate-[7deg] place-items-center rounded-[13px] bg-primary text-white">
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
          className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border border-transparent bg-transparent text-[#89998c] hover:border-[#e3ebe1] hover:bg-[#f0f5ef] dark:hover:border-[#35483f] dark:hover:bg-[#1c2a24]"
          aria-label="بستن منو"
          onClick={closeSidebar}
        >
          <X size={19} />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="m-[4px_14px_12px] h-auto text-[10px] text-[#a1a9a6]">
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
                          "relative flex min-h-[46px] items-center gap-3 rounded-[9px] bg-sidebar-accent p-[11px_14px] text-[12px] font-bold text-sidebar-accent-foreground before:absolute before:start-[-18px] before:h-[24px] before:w-[3px] before:rounded-[3px] before:bg-primary before:content-['']",
                      }}
                      inactiveProps={{
                        className:
                          'flex min-h-[46px] items-center gap-3 rounded-[9px] p-[11px_14px] text-[12px] text-[#69746e] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      }}
                      onClick={closeSidebarOnMobile}
                    >
                      <Icon size={20} strokeWidth={1.7} />
                      <span>{label}</span>
                      {to === '/requests' ? (
                        <SidebarMenuBadge className="end-2 top-1/2 -translate-y-1/2 rounded-[5px] bg-[#deebe2] p-[2px_7px] text-[10px] text-primary dark:bg-[#263b31] dark:text-[#8fc4a9]">
                          {persianNumber.format(newJobCount)}
                        </SidebarMenuBadge>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pt-[45px]">
        <div className="relative rounded-[12px] border border-[#e4ece6] bg-[linear-gradient(130deg,_#f2f7f3,_#fff)] p-[20px_14px_14px] [&_button]:flex [&_button]:w-full [&_button]:items-center [&_button]:justify-between [&_button]:rounded-[6px] [&_button]:border [&_button]:border-[#d9e3dc] [&_button]:bg-white [&_button]:p-[9px] [&_button]:text-[10px] [&_p]:m-[8px_0_16px] [&_p]:text-[10px] [&_p]:text-muted-foreground [&_strong]:text-[12px] dark:border-[#33453d] dark:bg-[#1c2823] dark:text-[#dce7e1] dark:[&_button]:border-[#3a5e4d] dark:[&_button]:bg-[#294538] dark:[&_button]:text-[#d3ebdf] dark:[&_button:hover]:border-[#4a725f] dark:[&_button:hover]:bg-[#345846] dark:[&_button:hover]:text-white dark:[&_strong]:text-[#f1f7f3]">
          <span className="mb-[13px] mt-[-39px] grid h-[39px] w-[39px] place-items-center rounded-[12px] border-[5px] border-white bg-[#e5eee6] text-primary dark:bg-[#263b31] dark:text-[#8fc4a9]">
            <LifeBuoy size={23} />
          </span>
          <strong>یک قدم جلوتر از کارها</strong>
          <p>راهنمای استفاده از نسخه نمایشی</p>
          <Button variant="outline" onClick={onOpenHelp}>
            راهنمای داشبورد <ArrowUpLeft size={16} />
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto items-center gap-[9px] border-0 bg-transparent p-[19px_9px] text-[10px] text-[#7a827d]"
            >
              <RotateCcw size={17} />
              بازنشانی داده‌های نمونه
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>بازنشانی اطلاعات نمونه؟</AlertDialogTitle>
              <AlertDialogDescription>
                درخواست‌ها و تراکنش‌هایی که در این مرورگر اضافه یا ویرایش کرده‌اید با داده‌های اولیه
                جایگزین می‌شوند.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={resetDemo}>
                بازنشانی داده‌ها
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
