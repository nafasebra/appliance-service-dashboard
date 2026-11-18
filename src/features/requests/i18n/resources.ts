import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/resources.ts';

export const requestsTranslations = {
  namespace: 'requests',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/resources.ts' {
  interface FeatureResources {
    requests: typeof en;
  }
}
