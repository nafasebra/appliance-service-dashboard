import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const partsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parts',
  component: lazyRouteComponent(() =>
    import('@/pages/parts').then((page) => () => <page.PartsPage section="inventory" />),
  ),
});
export const partNeedsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-needs',
  component: lazyRouteComponent(() =>
    import('@/pages/parts').then((page) => () => <page.PartsPage section="needs" />),
  ),
});
export const partPurchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-purchases',
  component: lazyRouteComponent(() =>
    import('@/pages/parts').then((page) => () => <page.PartsPage section="purchases" />),
  ),
});
export const partAllocationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/part-allocations',
  component: lazyRouteComponent(() =>
    import('@/pages/parts').then((page) => () => <page.PartsPage section="allocations" />),
  ),
});
