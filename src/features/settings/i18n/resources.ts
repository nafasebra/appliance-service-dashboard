import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/resources.ts';
import { settingsLabelKeys } from './legacy-labels.ts';

export const settingsTranslations = {
  namespace: 'settings',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: settingsLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/resources.ts' {
  interface FeatureResources {
    settings: typeof en;
  }
}
