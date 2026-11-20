import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index';
import { financeLabelKeys } from './legacy-labels';

export const financeTranslations = {
  namespace: 'finance',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: financeLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index' {
  interface FeatureResources {
    finance: typeof en;
  }
}
