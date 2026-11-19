import test from 'node:test';
import assert from 'node:assert/strict';
import {
  i18n,
  getLocale,
  languageStorageKey,
  resolveLanguage,
  translateLabel,
  sharedTranslations,
  buildResources,
  registerTranslationLabels,
  translateRegisteredLabel,
  type TranslationBundle,
} from '../shared/i18n/index.ts';

import { money, formatJalaliDate } from '@/shared/lib';

import { initialData } from '@/entities/service';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from '@/shared/i18n/server';

import { customersTranslations, useCustomersTranslation } from '@/pages/customers';

import { translationBundles } from './i18n.ts';
import { useRequestsPageTranslation } from '@/pages/requests';
import { useDispatchTranslation } from '@/pages/dispatch';
import { useTechniciansTranslation } from '@/pages/technicians';
import { useFinancePageTranslation } from '@/pages/finance';
import { usePartsTranslation } from '@/pages/parts';
import { useOverviewTranslation } from '@/pages/overview';
import { useReportsTranslation } from '@/pages/reports';
import { useSettingsTranslation } from '@/pages/settings';
import { useDashboardTranslation } from './hooks/use-dashboard-translation.tsx';
import { useSharedTranslation } from '@/shared/hooks';
import { useCartableTranslation } from '@/pages/cartable';

const { en, fa } = sharedTranslations.locales;
const legacyLabelKeys = sharedTranslations.labels;

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
    assert.equal(i18n.t('customers:directory.count', { count: 1 }), '1 sample customer');
    assert.equal(i18n.t('customers:directory.count', { count: 2 }), '2 sample customers');
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
  for (const bundle of translationBundles as readonly TranslationBundle[]) {
    const english = flatten(bundle.locales.en);
    const persian = flatten(bundle.locales.fa);
    assert.deepEqual(Object.keys(english).sort(), Object.keys(persian).sort());
    for (const [key, value] of Object.entries(english)) {
      assert.ok(value.trim() && persian[key]?.trim(), key);
      const placeholders = (message: string) =>
        [...message.matchAll(/{{([^}]+)}}/g)].map((m) => m[1]).sort();
      assert.deepEqual(placeholders(value), placeholders(persian[key]), key);
    }
    for (const [label, key] of Object.entries(bundle.labels ?? {})) {
      assert.ok(
        english[key] && persian[key],
        `${bundle.namespace}: missing compatibility key ${key}`,
      );
      assert.notEqual(translateRegisteredLabel(i18n, label), key);
    }
  }
});

test('registration rejects namespace collisions before overwriting translations', () => {
  assert.throws(() => buildResources([customersTranslations, customersTranslations]), /duplicate/);
  assert.throws(
    () => buildResources([{ ...customersTranslations, namespace: '__proto__' }]),
    /Invalid/,
  );
  assert.throws(
    () =>
      registerTranslationLabels(i18n, [
        { ...customersTranslations, labels: { duplicate: 'title' } },
        { ...customersTranslations, namespace: 'parts', labels: { duplicate: 'other' } },
      ]),
    /Duplicate translation label/,
  );
});

test('feature model labels translate through isolated registered bundles', async () => {
  const english = await createI18n('en', translationBundles);
  const persian = await createI18n('fa', translationBundles);
  assert.equal(
    translateRegisteredLabel(english, 'در انتظار استعلام'),
    'Awaiting availability check',
  );
  assert.equal(translateRegisteredLabel(persian, 'در انتظار استعلام'), 'در انتظار استعلام');
  assert.equal(translateRegisteredLabel(english, 'قطعه پیدا نشد.'), 'Part not found.');
  assert.equal(translateRegisteredLabel(english, 'مریم احمدی'), 'مریم احمدی');
  assert.equal(translateRegisteredLabel(english, '__proto__'), '__proto__');
});

test('every feature hook uses its own namespace and follows the provider locale', async () => {
  const instance = await createI18n('en', translationBundles);
  const probes = [
    {
      namespace: 'dashboard',
      key: 'notifications.notifications',
      useText: () => useDashboardTranslation()('notifications.notifications'),
    },
    {
      namespace: 'common',
      key: 'actions.close',
      useText: () => useSharedTranslation()('actions.close'),
    },
    {
      namespace: 'cartable',
      key: 'queues.inbox.title',
      useText: () => useCartableTranslation()('queues.inbox.title'),
    },
    {
      namespace: 'requests-page',
      key: 'list.requestList',
      useText: () => useRequestsPageTranslation()('list.requestList'),
    },
    {
      namespace: 'dispatch',
      key: 'schedule.scheduleDate',
      useText: () => useDispatchTranslation()('schedule.scheduleDate'),
    },
    {
      namespace: 'technicians',
      key: 'assignments.assignedOrders',
      useText: () => useTechniciansTranslation()('assignments.assignedOrders'),
    },
    {
      namespace: 'finance-page',
      key: 'ledger.receipts',
      useText: () => useFinancePageTranslation()('ledger.receipts'),
    },
    {
      namespace: 'parts',
      key: 'inventory.partName',
      useText: () => usePartsTranslation()('inventory.partName'),
    },
    {
      namespace: 'overview',
      key: 'summary.businessOverview',
      useText: () => useOverviewTranslation()('summary.businessOverview'),
    },
    {
      namespace: 'reports',
      key: 'performance.performanceReports',
      useText: () => useReportsTranslation()('performance.performanceReports'),
    },
    {
      namespace: 'settings',
      key: 'company.companyName',
      useText: () => useSettingsTranslation()('company.companyName'),
    },
    { namespace: 'customers', key: 'title', useText: () => useCustomersTranslation()('title') },
  ];
  for (const language of ['en', 'fa', 'en'] as const) {
    await instance.changeLanguage(language);
    for (const { namespace, key, useText } of probes) {
      function Probe() {
        return createElement('span', null, useText());
      }
      const bundle = translationBundles.find((item) => item.namespace === namespace)!;
      const expected = flatten(bundle.locales[language])[key];
      assert.equal(
        renderToStaticMarkup(
          createElement(I18nextProvider, { i18n: instance }, createElement(Probe)),
        ),
        `<span>${expected}</span>`,
        `${namespace} in ${language}`,
      );
    }
  }
  assert.equal(
    instance.getFixedT('en', 'dispatch')('schedule.summary', { count: 1 }),
    'Daily schedule · 1 visit · Tehran local time',
  );
  assert.equal(
    instance.getFixedT('en', 'dispatch')('schedule.summary', { count: 2 }),
    'Daily schedule · 2 visits · Tehran local time',
  );
  assert.equal(
    instance.getFixedT('en', 'requests')('editor.requestDetailsId', { id: 'JOB-1' }),
    'Request details: JOB-1',
  );
  assert.equal(
    instance.getFixedT('en', 'finance')('chart.point', {
      date: 'Today',
      incoming: 100,
      outgoing: 50,
    }),
    'Today: received 100, paid 50 toman',
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
