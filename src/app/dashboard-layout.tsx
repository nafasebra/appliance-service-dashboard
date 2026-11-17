import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '@/app/components/dashboard-header';
import { DashboardSidebar } from '@/app/components/dashboard-sidebar';
import { DashboardFooter } from '@/app/components/dashboard-footer';
import { useDemo } from '@/shared/store/demo-store';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Modal } from '@/shared/ui/primitives';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { useTranslation } from 'react-i18next'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardShell />
    </SidebarProvider>
  );
}

function DashboardShell() {
  const { t } = useTranslation()
  const [helpOpen, setHelpOpen] = useState(false);
  const storageError = useDemo((state) => state.storageError);

  return (
    <>
      <Link
        className="fixed -top-25 right-5 z-100 rounded-md bg-primary p-3 text-white focus:top-2.5"
        to="."
        hash="main-content"
      >
        {t('key', 'رفتن به محتوای اصلی')}
      </Link>

      <DashboardSidebar onOpenHelp={() => setHelpOpen(true)} />

      <SidebarInset className="dark:bg-background dark:text-foreground">
        <DashboardHeader />

        {storageError ? (
          <Alert className="mx-9 mt-4 w-auto border-border bg-status-new text-muted-foreground max-mobile:mx-4.5 dark:border-border dark:bg-status-new dark:text-muted-foreground">
            <AlertTriangle />
            <AlertTitle>{t('key2', 'ذخیره‌سازی مرورگر در دسترس نیست')}</AlertTitle>
            <AlertDescription className="text-inherit/80">
              {t('key3', 'تغییرات پس از بستن صفحه حفظ نمی‌شوند.')}
            </AlertDescription>
          </Alert>
        ) : null}

        <main
          id="main-content"
          className="mx-auto max-w-425 pt-7.5 px-9 pb-8.75 wide:px-12 max-desktop:py-6.5 max-desktop:px-6 max-mobile:py-6 max-mobile:px-4.5"
        >
          <Outlet />
        </main>

        <DashboardFooter />
      </SidebarInset>

      {helpOpen ? (
        <Modal title={t('key4', 'راهنمای نسخه نمایشی')} onClose={() => setHelpOpen(false)}>
          <div className="p-6 text-xs leading-loose text-muted-foreground [&_p]:mb-3.75">
            <p>
              {t('key5', 'از «درخواست جدید» یک خدمت برای مشتریان نمونه ثبت کنید. با بازکردن ردیف درخواست، تعمیرکار، زمان مراجعه و وضعیت را تغییر دهید.')}
            </p>
            <p>
              {t('key6', 'در صفحه اعزام، تاریخ روز را انتخاب کنید تا برنامه تعمیرکاران نمایش داده شود. دریافت از مشتری، هزینه و تسویه تعمیرکار در امور مالی ثبت می‌شود.')}
            </p>
            <p>
              {t('key7', 'این نسخه بک‌اند ندارد. اطلاعات فقط در همین مرورگر ذخیره می‌شوند. تومان، وضعیت‌ها و جریان پرداخت، انتخاب‌های موقت برای نمایش‌اند.')}
            </p>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
