import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../shared/i18n/locales/en/translation.json' with { type: 'json' };
import fa from '../shared/i18n/locales/fa/translation.json' with { type: 'json' };
import {
  i18n,
  getLocale,
  languageStorageKey,
  resolveLanguage,
  translateLabel,
} from '../shared/i18n/index.ts';
import { legacyLabelKeys } from '../shared/i18n/legacy-labels.ts';
import { money } from '../shared/lib/format.ts';
import { formatJalaliDate } from '../shared/lib/date.ts';
import { initialData } from '../entities/service/model/demo-data.ts';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from '../shared/i18n/create-i18n.ts';
import { buildResources } from '../shared/i18n/resources.ts';
import { customersTranslations } from '../features/customers/i18n/resources.ts';
import { useCustomersTranslation } from '../features/customers/i18n/use-customers-translation.ts';
import { translationBundles } from './i18n.ts';

function flatten(value: unknown, prefix = ''): Record<string, string> {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof child === 'string' ? [[path, child]] : Object.entries(flatten(child, path));
    }),
  );
}

test('locale JSON files have matching nonempty keys and interpolation variables', () => {
  const english = flatten(en),
    persian = flatten(fa);
  assert.deepEqual(Object.keys(english).sort(), Object.keys(persian).sort());
  for (const [key, value] of Object.entries(persian)) {
    assert.ok(value.trim(), `Empty Persian translation: ${key}`);
    assert.ok(english[key]?.trim(), `Empty English translation: ${key}`);
    const placeholders = (text: string) =>
      [...text.matchAll(/{{\s*([^}]+)\s*}}/g)].map((match) => match[1].trim()).sort();
    assert.deepEqual(
      placeholders(value),
      placeholders(english[key]),
      `Placeholder mismatch: ${key}`,
    );
  }
  for (const key of Object.values(legacyLabelKeys)) {
    assert.ok(persian[key] && english[key], `Missing legacy label: ${key}`);
  }
});

test('live language changes update direction and persistence while preserving records', async () => {
  const records = structuredClone(initialData);
  const descriptors = new Map(
    ['window', 'document', 'localStorage'].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const documentStub = { documentElement: { lang: '', dir: '' }, title: '' };
  const saved = new Map<string, string>();
  let blocked = false;
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: documentStub });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (blocked) throw new Error('Storage blocked');
        saved.set(key, value);
      },
    },
  });
  try {
    await i18n.changeLanguage('en');
    assert.equal(getLocale(), 'en-US');
    assert.equal(documentStub.documentElement.lang, 'en');
    assert.equal(documentStub.documentElement.dir, 'ltr');
    assert.equal(documentStub.title, en.appTitle);
    assert.equal(saved.get(languageStorageKey), 'en');
    assert.deepEqual([...saved.keys()], [languageStorageKey]);
    assert.equal(money(1234), '1,234 toman');
    assert.match(formatJalaliDate('2026-11-17'), /1405/);
    assert.equal(translateLabel('همه وضعیت‌ها'), 'All statuses');
    assert.equal(translateLabel('یخچال'), 'Refrigerator');
    assert.equal(translateLabel('مریم احمدی'), 'مریم احمدی');
    assert.equal(i18n.t('requests.count', { count: 1 }), '1 request');
    assert.equal(i18n.t('requests.count', { count: 2 }), '2 requests');
    assert.deepEqual(initialData, records);
    blocked = true;
    await i18n.changeLanguage('fa');
    assert.equal(documentStub.documentElement.lang, 'fa');
    assert.equal(documentStub.documentElement.dir, 'rtl');
    assert.equal(translateLabel('یخچال'), 'یخچال');
    assert.equal(translateLabel('__proto__'), '__proto__');
  } finally {
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
    await i18n.changeLanguage('fa');
  }
});

test('unsupported saved language falls back to Persian', () => {
  assert.equal(resolveLanguage('en-US'), 'en');
  assert.equal(resolveLanguage('fa-IR'), 'fa');
  assert.equal(resolveLanguage('unsupported'), 'fa');
  assert.equal(resolveLanguage(null), 'fa');
});

test('feature catalogs keep matching keys and placeholders', () => {
  const english = flatten(customersTranslations.locales.en);
  const persian = flatten(customersTranslations.locales.fa);
  assert.deepEqual(Object.keys(english).sort(), Object.keys(persian).sort());
  for (const [key, value] of Object.entries(english)) {
    assert.ok(value.trim() && persian[key]?.trim(), key);
    const placeholders = (message: string) =>
      [...message.matchAll(/{{([^}]+)}}/g)].map((m) => m[1]).sort();
    assert.deepEqual(placeholders(value), placeholders(persian[key]), key);
  }
});

test('registration rejects namespace collisions before overwriting translations', () => {
  assert.throws(() => buildResources([customersTranslations, customersTranslations]), /duplicate/);
  assert.throws(
    () => buildResources([{ ...customersTranslations, namespace: '__proto__' }]),
    /Invalid/,
  );
});

test('feature hook renders with isolated server instances and follows language changes', async () => {
  const bundles = translationBundles;
  assert.equal(i18n.getFixedT('en', 'customers')('title'), 'Customers');
  const [english, persian] = await Promise.all([
    createI18n('en', bundles),
    createI18n('fa', bundles),
  ]);
  function CustomerSummary() {
    const t = useCustomersTranslation();
    return createElement(
      'h1',
      null,
      `${t('title')} | ${t('history.title', { name: 'Alex' })} | ${t('directory.count', { count: 2 })}`,
    );
  }
  const render = (instance: typeof english) =>
    renderToStaticMarkup(
      createElement(I18nextProvider, { i18n: instance }, createElement(CustomerSummary)),
    );
  assert.match(render(english), /Customers \| History for Alex \| 2 sample customers/);
  assert.match(render(persian), /مشتریان.*سوابق Alex.*2 مشتری نمونه/);
  assert.equal(
    english.getFixedT('en', 'customers')('directory.count', { count: 1 }),
    '1 sample customer',
  );
  assert.equal(
    english.getFixedT('en', 'customers')('directory.count', { count: 0 }),
    '0 sample customers',
  );
  await english.changeLanguage('fa');
  assert.match(render(english), /مشتریان/);
  await english.changeLanguage('en');
  assert.equal(persian.language, 'fa');
  english.addResourceBundle('en', 'customers', { title: 'Changed locally' }, true, true);
  assert.equal(customersTranslations.locales.en.title, 'Customers');
  assert.equal(persian.getFixedT('en', 'customers')('title'), 'Customers');
  assert.equal(i18n.language, 'fa');
});
