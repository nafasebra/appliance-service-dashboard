import { createRouter } from '@tanstack/react-router';
import {
  cartableRoute,
  cartableAssignmentRoute,
  cartableActiveRoute,
  cartableCollectionRoute,
  cartableSettlementRoute,
  cartableArchiveRoute,
} from './routes/cartable-routes.tsx';
import { indexRoute } from './routes/index-route.tsx';
import {
  customerAccountsRoute,
  receivablesRoute,
  receiptsRoute,
  expensesRoute,
} from './routes/accounting-routes.tsx';
import { settingsRoute } from './routes/settings-route.tsx';
import { rootRoute } from './routes/root-route.tsx';
import {
  partsRoute,
  partNeedsRoute,
  partPurchasesRoute,
  partAllocationsRoute,
} from './routes/parts-routes.tsx';
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
} from './routes/service-routes.tsx';

const routeTree = rootRoute.addChildren([
  cartableRoute,
  cartableAssignmentRoute,
  cartableActiveRoute,
  cartableCollectionRoute,
  cartableSettlementRoute,
  cartableArchiveRoute,
  customerAccountsRoute,
  receivablesRoute,
  receiptsRoute,
  expensesRoute,
  settingsRoute,
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
