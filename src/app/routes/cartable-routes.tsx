import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const cartableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="inbox" />),
  ),
});
export const cartableAssignmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/assignment',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="assignment" />),
  ),
});
export const cartableActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/active',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="active" />),
  ),
});
export const cartableCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/collection',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="collection" />),
  ),
});
export const cartableSettlementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/settlement',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="settlement" />),
  ),
});
export const cartableArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/archive',
  component: lazyRouteComponent(() =>
    import('@/pages/cartable').then((page) => () => <page.CartablePage queue="archive" />),
  ),
});
