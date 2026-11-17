import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { CustomerAccountsPage } from '@/features/finance/customer-accounts-page';
import { ReceivablesPage } from '@/features/finance/receivables-page';
import { TransactionRegisterPage } from '@/features/finance/transaction-register-page';

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
