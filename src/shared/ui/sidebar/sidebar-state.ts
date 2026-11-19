// Match --breakpoint-mobile and --breakpoint-desktop in app/styles/index.css.
export const sidebarMedia = {
  mobile: '(width < 47.5625rem)',
  desktop: '(width >= 75.0625rem)',
} as const;

export type SidebarViewport = 'mobile' | 'tablet' | 'desktop';
export type SidebarMode = 'hidden' | 'icon' | 'full';

export function getSidebarViewport(mobile: boolean, desktop: boolean): SidebarViewport {
  return mobile ? 'mobile' : desktop ? 'desktop' : 'tablet';
}

export function getSidebarMode(
  viewport: SidebarViewport,
  open: boolean,
  openMobile: boolean,
): SidebarMode {
  if (viewport === 'mobile') return openMobile ? 'full' : 'hidden';
  if (viewport === 'tablet') return 'icon';
  return open ? 'full' : 'icon';
}
