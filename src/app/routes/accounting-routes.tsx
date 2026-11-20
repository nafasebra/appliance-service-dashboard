import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const customerAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-accounts',
  component: lazyRouteComponent(() => import('@/pages/finance'), 'CustomerAccountsPage'),
});
export const receivablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receivables',
  component: lazyRouteComponent(() => import('@/pages/finance'), 'ReceivablesPage'),
});
export const receiptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipts',
  component: lazyRouteComponent(
    () =>
      import('@/pages/finance').then((page) => ({
        ReceiptPage: () => <page.TransactionRegisterPage kind="receipt" />,
      })),
    'ReceiptPage',
  ),
});
export const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: lazyRouteComponent(
    () =>
      import('@/pages/finance').then((page) => ({
        ExpensePage: () => <page.TransactionRegisterPage kind="expense" />,
      })),
    'ExpensePage',
  ),
});
