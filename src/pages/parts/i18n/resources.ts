import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index';
import { partsLabelKeys } from './legacy-labels';

export const partsTranslations = {
  namespace: 'parts',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: partsLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index' {
  interface FeatureResources {
    parts: typeof en;
  }
}
