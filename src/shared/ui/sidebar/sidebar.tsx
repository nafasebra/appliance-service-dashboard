import { useSharedTranslation } from '@/shared/hooks';
import * as React from 'react';
import { PanelLeftIcon } from 'lucide-react';
import { Dialog as DialogPrimitive, Slot } from 'radix-ui';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib';

import {
  getSidebarMode,
  getSidebarViewport,
  sidebarMedia,
  type SidebarMode,
} from './sidebar-state';

const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

function readViewport() {
  if (typeof window === 'undefined') return 'desktop';
  return getSidebarViewport(
    window.matchMedia(sidebarMedia.mobile).matches,
    window.matchMedia(sidebarMedia.desktop).matches,
  );
}

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  isTablet: boolean;
  mode: SidebarMode;
  triggerRef: React.RefObject<HTMLElement | null>;
  sidebarStyle: React.CSSProperties | undefined;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider.');
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [viewport, setViewport] = React.useState(readViewport);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const mode = getSidebarMode(viewport, open, openMobile);

  React.useEffect(() => {
    const media = Object.values(sidebarMedia).map((query) => window.matchMedia(query));
    const update = () => {
      const next = readViewport();
      setViewport(next);
      if (next !== 'mobile') setOpenMobile(false);
    };
    update();
    media.forEach((query) => query.addEventListener('change', update));
    return () => media.forEach((query) => query.removeEventListener('change', update));
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      if (!openMobile) triggerRef.current = document.activeElement as HTMLElement | null;
      setOpenMobile((value) => !value);
    } else if (!isTablet) setOpen((value) => !value);
  }, [isMobile, isTablet, openMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isTablet &&
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, isTablet]);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      isTablet,
      mode,
      triggerRef,
      sidebarStyle: style,
      toggleSidebar,
    }),
    [open, openMobile, isMobile, isTablet, mode, style, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        className={cn('flex min-h-svh w-full', className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = 'right',
  className,
  children,
  dir,
  style,
  ...props
}: React.ComponentProps<'aside'> & { side?: 'left' | 'right' }) {
  const t = useSharedTranslation();
  const { mode, openMobile, setOpenMobile, isMobile, triggerRef, sidebarStyle } = useSidebar();
  const iconOnly = mode === 'icon';

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/40" />
          <DialogPrimitive.Content
            asChild
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (triggerRef.current?.isConnected) triggerRef.current.focus();
            }}
          >
            <aside
              data-slot="sidebar"
              data-side={side}
              data-mode="full"
              data-state="expanded"
              dir={dir}
              style={{ ...sidebarStyle, ...style }}
              className={cn(
                'fixed inset-y-0 z-50 flex w-(--sidebar-width-mobile) flex-col border-sidebar-border bg-sidebar text-sidebar-foreground',
                side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
                className,
              )}
              {...props}
            >
              <DialogPrimitive.Title className="sr-only">
                {t('sidebar.navigation')}
              </DialogPrimitive.Title>
              {children}
            </aside>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'shrink-0 transition-[width] duration-200 motion-reduce:transition-none',
          iconOnly ? 'w-(--sidebar-width-icon)' : 'w-(--sidebar-width)',
        )}
      />
      <aside
        data-slot="sidebar"
        data-side={side}
        data-state={iconOnly ? 'collapsed' : 'expanded'}
        data-mode={mode}
        dir={dir}
        style={style}
        className={cn(
          'fixed inset-y-0 z-30 flex flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none',
          iconOnly ? 'w-(--sidebar-width-icon)' : 'w-(--sidebar-width)',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const t = useSharedTranslation();
  const { toggleSidebar, mode, isMobile, isTablet } = useSidebar();
  if (isTablet) return null;
  const label = isMobile
    ? mode === 'hidden'
      ? t('sidebar.openMenu')
      : t('sidebar.closeMenu')
    : mode === 'icon'
      ? t('sidebar.expandMenu')
      : t('sidebar.collapseMenu');
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      aria-expanded={mode === 'full'}
      className={cn('size-8', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="rtl:rotate-180" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-inset" className={cn('min-w-0 flex-1', className)} {...props} />;
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('shrink-0', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('min-h-0 flex-1 overflow-y-auto hide-scrollbar', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('shrink-0', className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('relative flex min-w-0 flex-col', className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn('text-caption text-sidebar-foreground/70', className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-content" className={cn('w-full', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={cn('relative', className)} {...props} />;
}

function SidebarMenuButton({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="sidebar-menu-button"
      className={cn('flex w-full items-center text-body', className)}
      {...props}
    />
  );
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="sidebar-menu-badge"
      className={cn(
        'pointer-events-none absolute text-caption font-medium tabular-nums',
        className,
      )}
      {...props}
    />
  );
}

export {
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
};
