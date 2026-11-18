import type { InitOptions, Resource, i18n, ParseKeys } from 'i18next';

export const supportedLanguages = ['fa', 'en'] as const;
export type Language = (typeof supportedLanguages)[number];
export type Messages = { readonly [key: string]: string | Messages };
export type LocaleShape<T> = { [K in keyof T]: T[K] extends string ? string : LocaleShape<T[K]> };

// Features augment this interface locally; shared code never imports features.
export interface FeatureResources {}

export interface TranslationBundle {
  readonly namespace: string;
  readonly locales: Record<Language, Messages>;
  readonly labels?: Readonly<Record<string, string>>;
}

const labelRegistries = new WeakMap<i18n, ReadonlyMap<string, string>>();

export function registerTranslationLabels(
  instance: i18n,
  bundles: readonly TranslationBundle[],
): void {
  const labels = new Map<string, string>();
  for (const bundle of bundles) {
    for (const [label, key] of Object.entries(bundle.labels ?? {})) {
      const qualified = `${bundle.namespace}:${key}`;
      if (labels.has(label) && labels.get(label) !== qualified) {
        throw new Error(`Duplicate translation label: ${label}`);
      }
      labels.set(label, qualified);
    }
  }
  labelRegistries.set(instance, labels);
}

export function translateRegisteredLabel(instance: i18n, label: string): string {
  const key = labelRegistries.get(instance)?.get(label) ?? label;
  // Dynamic compatibility labels are checked at runtime before the typed lookup.
  return instance.exists(key) ? instance.t(key as ParseKeys) : label;
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
    defaultNS: 'common',
    ns: bundles.map(({ namespace }) => namespace),
    returnEmptyString: false,
    initAsync: false,
    interpolation: { escapeValue: false },
  };
}
