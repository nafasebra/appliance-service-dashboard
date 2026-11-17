import type { InitOptions, Resource } from 'i18next';

export const supportedLanguages = ['fa', 'en'] as const;
export type Language = (typeof supportedLanguages)[number];
export type Messages = { readonly [key: string]: string | Messages };
export type LocaleShape<T> = { [K in keyof T]: T[K] extends string ? string : LocaleShape<T[K]> };

// Features augment this interface locally; shared code never imports features.
export interface FeatureResources {}

export interface TranslationBundle {
  readonly namespace: string;
  readonly locales: Record<Language, Messages>;
}

export function buildResources(bundles: readonly TranslationBundle[]): Resource {
  const resources: Resource = { fa: {}, en: {} };
  const namespaces = new Set<string>();
  for (const bundle of bundles) {
    if (!/^[a-z][a-z0-9-]*$/.test(bundle.namespace) || namespaces.has(bundle.namespace)) {
      throw new Error(`Invalid or duplicate translation namespace: ${bundle.namespace}`);
    }
    namespaces.add(bundle.namespace);
    for (const language of supportedLanguages) {
      resources[language][bundle.namespace] = structuredClone(bundle.locales[language]);
    }
  }
  return resources;
}

export function translationOptions(
  language: Language,
  bundles: readonly TranslationBundle[],
): InitOptions {
  return {
    resources: buildResources(bundles),
    lng: language,
    fallbackLng: 'fa',
    supportedLngs: [...supportedLanguages],
    load: 'languageOnly',
    defaultNS: 'translation',
    ns: bundles.map(({ namespace }) => namespace),
    returnEmptyString: false,
    initAsync: false,
    interpolation: { escapeValue: false },
  };
}
