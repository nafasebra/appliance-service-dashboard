import 'i18next';
import type en from './locales/en/common.json';
import type { FeatureResources } from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    strictKeyChecks: true;
    resources: { common: typeof en } & FeatureResources;
  }
}
