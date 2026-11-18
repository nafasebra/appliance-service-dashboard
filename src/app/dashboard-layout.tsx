import { useSharedTranslation } from '@/shared/hooks/use-shared-translation';
import { useDashboardTranslation } from '@/features/dashboard/hooks/use-dashboard-translation';
import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { useDemo } from '@/shared/store/demo-store';
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
  const t = useDashboardTranslation();
  const tShared = useSharedTranslation();
  const [helpOpen, setHelpOpen] = useState(false);
  const storageError = useDemo((state) => state.storageError);

  return (
    <>
      <Link
        className="fixed -top-25 right-5 z-100 rounded-md bg-primary p-3 text-white focus:top-2.5"
        to="."
        hash="main-content"
      >
        {t('accessibility.skipToMainContent')}
      </Link>

      <DashboardSidebar onOpenHelp={() => setHelpOpen(true)} />

      <SidebarInset className="dark:bg-background dark:text-foreground">
        <DashboardHeader />

        {storageError ? (
          <Alert className="mx-9 mt-4 w-auto border-border bg-status-new text-muted-foreground max-mobile:mx-4.5 dark:border-border dark:bg-status-new dark:text-muted-foreground">
            <AlertTriangle />
            <AlertTitle>{tShared('storage.browserStorageIsUnavailable')}</AlertTitle>
            <AlertDescription className="text-inherit/80">
              {tShared('storage.changesWillNotBeSavedAfterYouClose')}
            </AlertDescription>
          </Alert>
        ) : null}

        <main
          id="main-content"
          className="mx-auto max-w-425 pt-7.5 px-9 pb-8.75 wide:px-12 max-desktop:py-6.5 max-desktop:px-6 max-mobile:py-6 max-mobile:px-4.5"
        >
          <Outlet />
        </main>
      </SidebarInset>

      {helpOpen ? (
        <Modal title={t('guide.demoGuide')} onClose={() => setHelpOpen(false)}>
          <div className="p-6 text-xs leading-loose text-muted-foreground [&_p]:mb-3.75">
            <p>{t('guide.createAServiceRequestForASampleCustomer')}</p>
            <p>{t('guide.chooseADateOnTheDispatchPageTo')}</p>
            <p>{t('guide.thisDemoHasNoBackendDataStaysIn')}</p>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
