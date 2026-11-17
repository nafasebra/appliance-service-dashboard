import { createInstance } from 'i18next';
import { translationOptions, type Language, type TranslationBundle } from './resources.ts';

// No singleton, browser APIs, or React plugin globals: safe for one instance per request.
export async function createI18n(language: Language, bundles: readonly TranslationBundle[]) {
  const instance = createInstance();
  await instance.init(translationOptions(language, bundles));
  return instance;
}
