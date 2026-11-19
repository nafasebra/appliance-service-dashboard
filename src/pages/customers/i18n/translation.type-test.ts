import type { TFunction } from 'i18next';
import type { LocaleShape } from '../../../shared/i18n/index.ts';
import type en from './en.json';

// Compiled by typecheck; never imported into the application bundle.
export function checkCustomersTranslationTypes(t: TFunction<'customers'>) {
  t('title');
  t('history.title', { name: 'Customer' });
  t('directory.count', { count: 2 });
  // @ts-expect-error Invalid keys must fail even when a default value is supplied.
  t('missing.key', { defaultValue: 'Missing' });
  // @ts-expect-error Other namespaces must not leak through the feature hook.
  t('ui.customers');
}

export function checkLocaleShape(messages: LocaleShape<typeof en>) {
  // @ts-expect-error Every locale must contain all business concepts.
  const incomplete: LocaleShape<typeof en> = { title: 'Customers' };
  return [messages, incomplete];
}
