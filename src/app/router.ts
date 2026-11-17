import { createRouter } from '@tanstack/react-router';
import { indexRoute } from '@/app/routes/index-route';
import { rootRoute } from '@/app/routes/root-route';
import {
  partsRoute,
  partNeedsRoute,
  partPurchasesRoute,
  partAllocationsRoute,
} from '@/app/routes/parts-routes';
import {
  requestsRoute,
  dispatchRoute,
  techniciansRoute,
  technicianSpecialtiesRoute,
  technicianJobsRoute,
  technicianFinanceRoute,
  customersRoute,
  financeRoute,
  reportsRoute,
} from '@/app/routes/service-routes';

const routeTree = rootRoute.addChildren([
  partsRoute,
  partNeedsRoute,
  partPurchasesRoute,
  partAllocationsRoute,
  indexRoute,
  technicianSpecialtiesRoute,
  technicianJobsRoute,
  technicianFinanceRoute,
  requestsRoute,
  dispatchRoute,
  techniciansRoute,
  customersRoute,
  financeRoute,
  reportsRoute,
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
