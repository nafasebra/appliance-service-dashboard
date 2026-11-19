import { useCallback } from 'react';
import { useSidebar } from '@/shared/ui/sidebar';

export function useDashboardSidebar() {
  const { isMobile, mode, setOpen, setOpenMobile } = useSidebar();

  const closeSidebar = useCallback(() => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  }, [isMobile, setOpen, setOpenMobile]);

  const closeSidebarOnMobile = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  return { closeSidebar, closeSidebarOnMobile, isMobile, isIconOnly: mode === 'icon' };
}
