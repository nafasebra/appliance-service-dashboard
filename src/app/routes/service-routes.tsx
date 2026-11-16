import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { RequestsPage } from '@/features/operations/requests-page';
import { DispatchPage } from '@/features/operations/dispatch-page';
import { CustomersPage, TechniciansPage } from '@/features/operations/people-pages';
import { FinancePage } from '@/features/operations/finance-page';
import { ReportsPage } from '@/features/operations/reports-page';

export const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/requests',
  component: RequestsPage,
});
export const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dispatch',
  component: DispatchPage,
});
export const techniciansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technicians',
  component: TechniciansPage,
});
export const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});
export const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: FinancePage,
});
export const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});
