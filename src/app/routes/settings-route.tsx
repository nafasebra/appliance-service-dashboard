import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { lazyRouteComponent } from '@tanstack/react-router';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: lazyRouteComponent(() => import('@/pages/settings'), 'SettingsPage'),
});
