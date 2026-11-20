import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route.tsx';
import { lazyRouteComponent } from '@tanstack/react-router';

export const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/requests',
  component: lazyRouteComponent(() => import('@/pages/requests').then((page) => page.RequestsPage)),
});
export const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dispatch',
  component: lazyRouteComponent(() => import('@/pages/dispatch').then((page) => page.DispatchPage)),
});
export const techniciansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technicians',
  component: lazyRouteComponent(() =>
    import('@/pages/technicians').then((page) => page.TechnicianManagementPage),
  ),
});
export const technicianSpecialtiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-specialties',
  component: lazyRouteComponent(() =>
    import('@/pages/technicians').then((page) => page.TechnicianSpecialtiesPage),
  ),
});
export const technicianJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-jobs',
  component: lazyRouteComponent(() =>
    import('@/pages/technicians').then((page) => page.TechnicianJobsPage),
  ),
});
export const technicianFinanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/technician-finance',
  component: lazyRouteComponent(() =>
    import('@/pages/technicians').then((page) => page.TechnicianFinancePage),
  ),
});
export const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: lazyRouteComponent(() =>
    import('@/pages/customers').then((page) => page.CustomersPage),
  ),
});
export const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: lazyRouteComponent(() => import('@/pages/finance').then((page) => page.FinancePage)),
});
export const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: lazyRouteComponent(() => import('@/pages/reports').then((page) => page.ReportsPage)),
});
