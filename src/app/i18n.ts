import { requestsPageTranslations } from '@/pages/requests';
import { financePageTranslations } from '@/pages/finance';
import { requestsTranslations } from '@/features/requests';
import { dashboardTranslations } from './config/i18n/resources';
import { cartableTranslations } from '@/pages/cartable';
import { dispatchTranslations } from '@/pages/dispatch';
import { techniciansTranslations } from '@/pages/technicians';
import { financeTranslations } from '@/features/finance';
import { partsTranslations } from '@/pages/parts';
import { overviewTranslations } from '@/pages/overview';
import { reportsTranslations } from '@/pages/reports';
import { settingsTranslations } from '@/pages/settings';
import { customersTranslations } from '@/pages/customers';
import {
  i18n,
  sharedTranslations,
  buildResources,
  registerTranslationLabels,
} from '../shared/i18n/index';

// App composition owns feature dependencies. One entry registers both locales.
export const translationBundles = [
  sharedTranslations,
  requestsPageTranslations,
  financePageTranslations,
  dashboardTranslations,
  cartableTranslations,
  customersTranslations,
  requestsTranslations,
  dispatchTranslations,
  techniciansTranslations,
  financeTranslations,
  partsTranslations,
  overviewTranslations,
  reportsTranslations,
  settingsTranslations,
] as const;
const resources = buildResources(translationBundles);
registerTranslationLabels(i18n, translationBundles);
for (const [language, namespaces] of Object.entries(resources)) {
  for (const [namespace, messages] of Object.entries(namespaces)) {
    i18n.addResourceBundle(language, namespace, messages, true, true);
  }
}
