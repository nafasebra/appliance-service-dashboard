import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import { appLabelKeys } from './legacy-labels.ts';
import type { LocaleShape, TranslationBundle } from '../../shared/i18n/resources.ts';

export const appTranslations = {
  namespace: 'app',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: appLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../shared/i18n/resources.ts' {
  interface FeatureResources {
    app: typeof en;
  }
}
