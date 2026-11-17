import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { RequestsPage } from '@/features/requests/requests-page';
import { DispatchPage } from '@/features/dispatch/dispatch-page';
import { CustomersPage } from '@/features/customers/customers-page';
import { TechnicianManagementPage } from '@/features/technicians/technician-management-page';
import { TechnicianSpecialtiesPage } from '@/features/technicians/technician-specialties-page';
import { TechnicianJobsPage } from '@/features/technicians/technician-jobs-page';
import { TechnicianFinancePage } from '@/features/technicians/technician-finance-page';
import { FinancePage } from '@/features/finance/finance-page';
import { ReportsPage } from '@/features/reports/reports-page';

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
