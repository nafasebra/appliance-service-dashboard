import { dispatchLabelKeys } from './legacy-labels.ts';
import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/resources.ts';

export const dispatchTranslations = {
  namespace: 'dispatch',
  labels: dispatchLabelKeys,
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/resources.ts' {
  interface FeatureResources {
    dispatch: typeof en;
  }
}
