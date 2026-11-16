import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { OverviewPage } from '@/features/operations/overview-page';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: OverviewPage,
});
