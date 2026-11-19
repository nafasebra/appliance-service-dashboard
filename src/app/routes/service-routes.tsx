import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { RequestsPage } from '@/pages/requests';
import { DispatchPage } from '@/pages/dispatch';
import { CustomersPage } from '@/pages/customers';
import {
  TechnicianManagementPage,
  TechnicianSpecialtiesPage,
  TechnicianJobsPage,
  TechnicianFinancePage,
} from '@/pages/technicians';

import { FinancePage } from '@/pages/finance';
import { ReportsPage } from '@/pages/reports';

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
