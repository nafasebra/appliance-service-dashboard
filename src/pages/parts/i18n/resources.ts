import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index.ts';
import { partsLabelKeys } from './legacy-labels.ts';

export const partsTranslations = {
  namespace: 'parts',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: partsLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index.ts' {
  interface FeatureResources {
    parts: typeof en;
  }
}
