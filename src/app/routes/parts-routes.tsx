import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const partsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parts',
  component: lazyRouteComponent(
    () =>
      import('@/pages/parts').then((page) => ({
        PartsPage: () => <page.PartsPage section="inventory" />,
      })),
    'PartsPage',
  ),
});
export const partNeedsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-needs',
  component: lazyRouteComponent(
    () =>
      import('@/pages/parts').then((page) => ({
        PartsPage: () => <page.PartsPage section="needs" />,
      })),
    'PartsPage',
  ),
});
export const partPurchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-purchases',
  component: lazyRouteComponent(
    () =>
      import('@/pages/parts').then((page) => ({
        PartsPage: () => <page.PartsPage section="purchases" />,
      })),
    'PartsPage',
  ),
});
export const partAllocationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-allocations',
  component: lazyRouteComponent(
    () =>
      import('@/pages/parts').then((page) => ({
        PartsPage: () => <page.PartsPage section="allocations" />,
      })),
    'PartsPage',
  ),
});
