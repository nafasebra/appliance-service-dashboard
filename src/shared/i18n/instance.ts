import instance from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json' with { type: 'json' };
import fa from './locales/fa/common.json' with { type: 'json' };
import { legacyLabelKeys } from './legacy-labels.ts';
import {
  translationOptions,
  registerTranslationLabels,
  translateRegisteredLabel,
  type TranslationBundle,
  type Language,
} from './resources.ts';

export type { Language } from './resources.ts';

export const languageStorageKey = 'hamyar-service-language';

export function resolveLanguage(value: string | null | undefined): Language {
  return value?.split('-')[0] === 'en' ? 'en' : 'fa';
}

function readLanguage(): Language {
  if (typeof window === 'undefined') return 'fa';
  try {
    return resolveLanguage(localStorage.getItem(languageStorageKey));
  } catch {
    return 'fa';
  }
}

export const i18n = instance;
export const sharedTranslations = {
  namespace: 'common',
  locales: { en, fa },
  labels: legacyLabelKeys,
} as const satisfies TranslationBundle;

void i18n.use(initReactI18next).init(translationOptions(readLanguage(), [sharedTranslations]));
registerTranslationLabels(i18n, [sharedTranslations]);

function applyLanguage(language: string) {
  const supported = resolveLanguage(language);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = supported;
    document.documentElement.dir = supported === 'fa' ? 'rtl' : 'ltr';
    document.title = i18n.t('appTitle');
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute('content', i18n.t('appDescription'));
  }
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(languageStorageKey, supported);
  } catch {
    // Language switching remains available when browser storage is blocked.
  }
}

i18n.on('languageChanged', applyLanguage);
applyLanguage(i18n.language);

export function translateLabel(label: string): string {
  return translateRegisteredLabel(i18n, label);
}

export function getLocale(): string {
  return resolveLanguage(i18n.resolvedLanguage) === 'en' ? 'en-US' : 'fa-IR';
}
