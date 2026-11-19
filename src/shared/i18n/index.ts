export {
  i18n,
  sharedTranslations,
  translateLabel,
  getLocale,
  languageStorageKey,
  resolveLanguage,
} from './instance.ts';
export interface FeatureResources {}
export type { Language, LocaleShape, TranslationBundle } from './resources.ts';
export {
  buildResources,
  registerTranslationLabels,
  translateRegisteredLabel,
} from './resources.ts';
export { createI18n } from './create-i18n.ts';
export { LocalizationProvider } from './provider.tsx';
