import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { RequestsPage } from '@/features/operations/requests-page';
import { DispatchPage } from '@/features/operations/dispatch-page';
import { CustomersPage } from '@/features/operations/people-pages';
import { TechnicianManagementPage } from '@/features/operations/technician-management-page';
import { TechnicianSpecialtiesPage } from '@/features/operations/technician-specialties-page';
import { TechnicianJobsPage } from '@/features/operations/technician-jobs-page';
import { TechnicianFinancePage } from '@/features/operations/technician-finance-page';
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
  component: TechnicianManagementPage,
});
export const technicianSpecialtiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-specialties',
  component: TechnicianSpecialtiesPage,
});
export const technicianJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-jobs',
  component: TechnicianJobsPage,
});
export const technicianFinanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-finance',
  component: TechnicianFinancePage,
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
