import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/requests',
  component: lazyRouteComponent(() => import('@/pages/requests'), 'RequestsPage'),
});
export const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dispatch',
  component: lazyRouteComponent(() => import('@/pages/dispatch'), 'DispatchPage'),
});
export const techniciansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technicians',
  component: lazyRouteComponent(() => import('@/pages/technicians'), 'TechnicianManagementPage'),
});
export const technicianSpecialtiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-specialties',
  component: lazyRouteComponent(() => import('@/pages/technicians'), 'TechnicianSpecialtiesPage'),
});
export const technicianJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-jobs',
  component: lazyRouteComponent(() => import('@/pages/technicians'), 'TechnicianJobsPage'),
});
export const technicianFinanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-finance',
  component: lazyRouteComponent(() => import('@/pages/technicians'), 'TechnicianFinancePage'),
});
export const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: lazyRouteComponent(() => import('@/pages/customers'), 'CustomersPage'),
});
export const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: lazyRouteComponent(() => import('@/pages/finance'), 'FinancePage'),
});
export const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: lazyRouteComponent(() => import('@/pages/reports'), 'ReportsPage'),
});
