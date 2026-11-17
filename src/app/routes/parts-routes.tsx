import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { PartsPage } from '@/features/parts/parts-page';

export const partsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parts',
  component: () => <PartsPage section="inventory" />,
});
export const partNeedsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-needs',
  component: () => <PartsPage section="needs" />,
});
export const partPurchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-purchases',
  component: () => <PartsPage section="purchases" />,
});
export const partAllocationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-allocations',
  component: () => <PartsPage section="allocations" />,
});
