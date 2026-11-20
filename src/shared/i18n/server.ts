// Browser-independent entry point for isolated, per-request translation instances.
export { createI18n } from './create-i18n';
export { buildResources, registerTranslationLabels, translateRegisteredLabel } from './resources';
export type { Language, LocaleShape, TranslationBundle } from './resources';
