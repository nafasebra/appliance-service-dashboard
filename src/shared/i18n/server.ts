// Browser-independent entry point for isolated, per-request translation instances.
export { createI18n } from './create-i18n.ts';
export {
  buildResources,
  registerTranslationLabels,
  translateRegisteredLabel,
} from './resources.ts';
export type { Language, LocaleShape, TranslationBundle } from './resources.ts';
