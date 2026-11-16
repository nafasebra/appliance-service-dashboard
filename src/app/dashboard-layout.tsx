import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '@/app/components/dashboard-header';
import { DashboardSidebar } from '@/app/components/dashboard-sidebar';
import { DashboardFooter } from '@/app/components/dashboard-footer';
import { useDemo } from '@/features/operations/model/demo-store';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Modal } from '@/shared/ui/primitives';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardShell />
    </SidebarProvider>
  );
}

function DashboardShell() {
  const [helpOpen, setHelpOpen] = useState(false);
  const { storageError } = useDemo();

  return (
    <>
      <Link
        className="fixed top-[-100px] right-5 z-[100] rounded-md bg-primary p-3 text-white focus:top-2.5"
        to="."
        hash="main-content"
      >
        رفتن به محتوای اصلی
      </Link>

      <DashboardSidebar onOpenHelp={() => setHelpOpen(true)} />

      <SidebarInset className="dark:bg-background dark:text-foreground">
        <DashboardHeader />

        {storageError ? (
          <Alert className="mx-9 mt-4 w-auto border-[#e9c77d] bg-[#fff8e8] text-[#795719] max-[761px]:mx-[18px] dark:border-[#65512c] dark:bg-[#302817] dark:text-[#e4bd72]">
            <AlertTriangle />
            <AlertTitle>ذخیره‌سازی مرورگر در دسترس نیست</AlertTitle>
            <AlertDescription className="text-inherit/80">
              تغییرات پس از بستن صفحه حفظ نمی‌شوند.
            </AlertDescription>
          </Alert>
        ) : null}

        <main
          id="main-content"
          className="mx-auto max-w-[1700px] p-[30px_36px_35px] min-[1600px]:px-12 max-[1201px]:p-[26px_24px] max-[761px]:p-[24px_18px]"
        >
          <Outlet />
        </main>

        <DashboardFooter />
      </SidebarInset>

      {helpOpen ? (
        <Modal title="راهنمای نسخه نمایشی" onClose={() => setHelpOpen(false)}>
          <div className="p-6 text-[12px] leading-[2.3] text-muted-foreground [&_p]:mb-[15px]">
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
      ) : null}
    </>
  );
}
