import { customersLabelKeys } from './legacy-labels.ts';
import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index.ts';

export const customersTranslations = {
  namespace: 'customers',
  labels: customersLabelKeys,
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index.ts' {
  interface FeatureResources {
    customers: typeof en;
  }
}
