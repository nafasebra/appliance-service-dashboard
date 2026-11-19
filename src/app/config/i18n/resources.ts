import en from './en.json' with { type: 'json' };
import fa from './fa.json' with { type: 'json' };
import { dashboardLabelKeys } from './legacy-labels.ts';
import type { LocaleShape, TranslationBundle } from '../../../shared/i18n/index.ts';

export const dashboardTranslations = {
  namespace: 'dashboard',
  locales: { en, fa: fa satisfies LocaleShape<typeof en> },
  labels: dashboardLabelKeys,
} as const satisfies TranslationBundle;

declare module '../../../shared/i18n/index.ts' {
  interface FeatureResources {
    dashboard: typeof en;
  }
}
