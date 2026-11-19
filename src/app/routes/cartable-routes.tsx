import { createRoute } from '@tanstack/react-router';
import { CartablePage } from '@/pages/cartable';
import { rootRoute } from './root-route.tsx';

export const cartableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable',
  component: () => <CartablePage queue="inbox" />,
});
export const cartableAssignmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/assignment',
  component: () => <CartablePage queue="assignment" />,
});
export const cartableActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/active',
  component: () => <CartablePage queue="active" />,
});
export const cartableCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/collection',
  component: () => <CartablePage queue="collection" />,
});
export const cartableSettlementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/settlement',
  component: () => <CartablePage queue="settlement" />,
});
export const cartableArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cartable/archive',
  component: () => <CartablePage queue="archive" />,
});
