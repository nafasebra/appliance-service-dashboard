import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { OverviewPage } from '@/features/overview/overview-page';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: OverviewPage,
});
