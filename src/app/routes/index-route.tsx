import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { lazyRouteComponent } from '@tanstack/react-router';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('@/pages/overview'), 'OverviewPage'),
});
