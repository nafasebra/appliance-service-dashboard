import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index';
import { techniciansLabelKeys } from './legacy-labels';

export const techniciansTranslations = {
  namespace: 'technicians',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: techniciansLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index' {
  interface FeatureResources {
    technicians: typeof en;
  }
}
