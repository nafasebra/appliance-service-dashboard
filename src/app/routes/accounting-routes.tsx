import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { CustomerAccountsPage, ReceivablesPage, TransactionRegisterPage } from '@/pages/finance';

export const customerAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-accounts',
  component: CustomerAccountsPage,
});
export const receivablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receivables',
  component: ReceivablesPage,
});
export const receiptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipts',
  component: () => <TransactionRegisterPage kind="receipt" />,
});
export const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: () => <TransactionRegisterPage kind="expense" />,
});
