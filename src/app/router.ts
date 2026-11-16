import { createRouter } from '@tanstack/react-router';
import { indexRoute } from '@/app/routes/index-route';
import { rootRoute } from '@/app/routes/root-route';
import {
  requestsRoute,
  dispatchRoute,
  techniciansRoute,
  customersRoute,
  financeRoute,
  reportsRoute,
} from '@/app/routes/service-routes';

const routeTree = rootRoute.addChildren([
  indexRoute,
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
