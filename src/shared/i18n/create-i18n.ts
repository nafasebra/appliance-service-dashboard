import { createInstance } from 'i18next';
import {
  translationOptions,
  registerTranslationLabels,
  type Language,
  type TranslationBundle,
} from './resources';

// No singleton, browser APIs, or React plugin globals: safe for one instance per request.
export async function createI18n(language: Language, bundles: readonly TranslationBundle[]) {
  const instance = createInstance();
  await instance.init(translationOptions(language, bundles));
  registerTranslationLabels(instance, bundles);
  return instance;
}
