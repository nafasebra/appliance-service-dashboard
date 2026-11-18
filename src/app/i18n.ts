import { requestsTranslations } from '../features/requests/i18n/resources.ts';
import { dashboardTranslations } from '../features/dashboard/i18n/resources.ts';
import { cartableTranslations } from '../features/cartable/i18n/resources.ts';
import { dispatchTranslations } from '../features/dispatch/i18n/resources.ts';
import { techniciansTranslations } from '../features/technicians/i18n/resources.ts';
import { financeTranslations } from '../features/finance/i18n/resources.ts';
import { partsTranslations } from '../features/parts/i18n/resources.ts';
import { overviewTranslations } from '../features/overview/i18n/resources.ts';
import { reportsTranslations } from '../features/reports/i18n/resources.ts';
import { settingsTranslations } from '../features/settings/i18n/resources.ts';
import { customersTranslations } from '../features/customers/i18n/resources.ts';
import { i18n, sharedTranslations } from '../shared/i18n/index.ts';
import { buildResources, registerTranslationLabels } from '../shared/i18n/resources.ts';

// App composition owns feature dependencies. One entry registers both locales.
export const translationBundles = [
  sharedTranslations,
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
