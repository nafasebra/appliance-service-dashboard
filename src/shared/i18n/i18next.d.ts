import 'i18next';
import type en from './locales/en/translation.json';
import type { FeatureResources } from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    strictKeyChecks: true;
    resources: { translation: typeof en } & FeatureResources;
  }
}
