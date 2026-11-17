import { customersTranslations } from '../features/customers/i18n/resources.ts';
import { i18n, sharedTranslations } from '../shared/i18n/index.ts';
import { buildResources } from '../shared/i18n/resources.ts';

// App composition owns feature dependencies. One entry registers both locales.
export const translationBundles = [sharedTranslations, customersTranslations] as const;
const resources = buildResources(translationBundles);
for (const [language, namespaces] of Object.entries(resources)) {
  for (const [namespace, messages] of Object.entries(namespaces)) {
    i18n.addResourceBundle(language, namespace, messages, true, true);
  }
}
