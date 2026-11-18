import { createRouter } from '@tanstack/react-router';
import {
  cartableRoute,
  cartableAssignmentRoute,
  cartableActiveRoute,
  cartableCollectionRoute,
  cartableSettlementRoute,
  cartableArchiveRoute,
} from '@/app/routes/cartable-routes';
import { indexRoute } from '@/app/routes/index-route';
import {
  customerAccountsRoute,
  receivablesRoute,
  receiptsRoute,
  expensesRoute,
} from '@/app/routes/accounting-routes';
import { settingsRoute } from '@/app/routes/settings-route';
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
