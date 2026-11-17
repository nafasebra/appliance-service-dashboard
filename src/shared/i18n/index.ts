import instance from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json' with { type: 'json' };
import fa from './locales/fa/translation.json' with { type: 'json' };
import { legacyLabelKeys } from './legacy-labels.ts';

export type Language = 'fa' | 'en';
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

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fa: { translation: fa } },
  lng: readLanguage(),
  fallbackLng: 'fa',
  supportedLngs: ['fa', 'en'],
  load: 'languageOnly',
  returnEmptyString: false,
  initAsync: false,
  interpolation: { escapeValue: false },
});

function applyLanguage(language: string) {
  const supported = resolveLanguage(language);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = supported;
    document.documentElement.dir = supported === 'fa' ? 'rtl' : 'ltr';
    document.title = i18n.t('appTitle');
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
  const key = Object.hasOwn(legacyLabelKeys, label) ? legacyLabelKeys[label] : label;
  return i18n.exists(key) ? i18n.t(key) : label;
}

export function getLocale(): string {
  return resolveLanguage(i18n.resolvedLanguage) === 'en' ? 'en-US' : 'fa-IR';
}
