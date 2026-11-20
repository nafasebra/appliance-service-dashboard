export {
  i18n,
  sharedTranslations,
  translateLabel,
  getLocale,
  languageStorageKey,
  resolveLanguage,
} from './instance';
export interface FeatureResources {}
export type { Language, LocaleShape, TranslationBundle } from './resources';
export { buildResources, registerTranslationLabels, translateRegisteredLabel } from './resources';
export { createI18n } from './create-i18n';
export { LocalizationProvider } from './provider';
