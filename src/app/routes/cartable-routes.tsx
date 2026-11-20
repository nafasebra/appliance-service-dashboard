import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const cartableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="inbox" />,
      })),
    'CartablePage',
  ),
});
export const cartableAssignmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/assignment',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="assignment" />,
      })),
    'CartablePage',
  ),
});
export const cartableActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/active',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="active" />,
      })),
    'CartablePage',
  ),
});
export const cartableCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/collection',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="collection" />,
      })),
    'CartablePage',
  ),
});
export const cartableSettlementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/settlement',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="settlement" />,
      })),
    'CartablePage',
  ),
});
export const cartableArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/archive',
  component: lazyRouteComponent(
    () =>
      import('@/pages/cartable').then((page) => ({
        CartablePage: () => <page.CartablePage queue="archive" />,
      })),
    'CartablePage',
  ),
});
