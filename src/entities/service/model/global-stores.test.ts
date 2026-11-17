import test from 'node:test';
import assert from 'node:assert/strict';
import { useDemo } from './demo-store.ts';
import { initialData } from './demo-data.ts';
import { useParts } from '../../../features/parts/model/parts-store.ts';
import { initialPartsData } from '../../../features/parts/model/parts.ts';
import { useCompanySettings } from '../../company/model/settings-store.ts';
import { defaultCompanySettings } from '../../company/model/settings.ts';

const saved = new Map<string, string>();
let blocked = false;
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

test('shared stores use latest state, preserve subscriptions and retain legacy storage keys', () => {
  useDemo.setState({ ...structuredClone(initialData), storageError: false });
  const jobsBefore = useDemo.getState().jobs;
  const receipt = {
    id: 'zustand-receipt-1',
    kind: 'receipt' as const,
    jobId: 'SR-1047',
    amount: 1000000,
    date: '2026-11-17',
    description: 'payment',
  };
  assert.equal(useDemo.getState().addTransaction(receipt), null);
  assert.ok(useDemo.getState().addTransaction({ ...receipt, id: 'zustand-receipt-2' }));
  assert.equal(useDemo.getState().jobs, jobsBefore);
  assert.equal(
    useDemo.getState().transactions.filter((item) => item.id.startsWith('zustand-receipt')).length,
    1,
  );
  const persisted = JSON.parse(saved.get('hamyar-service-demo-v1')!);
  assert.ok(persisted.transactions.some((item: { id: string }) => item.id === receipt.id));
  assert.equal('saveJob' in persisted, false);

  const tech = { ...useDemo.getState().technicians[0], specialty: 'new specialty' };
  assert.equal(useDemo.getState().saveTechnician(tech), null);
  assert.equal(useDemo.getState().technicians[0].specialty, 'new specialty');
  assert.ok(useDemo.getState().transactions.some((item) => item.id === receipt.id));
});

test('parts operations use current shared inventory and persist validated records', () => {
  useParts.setState({ data: structuredClone(initialPartsData), storageError: false });
  assert.equal(
    useParts.getState().change((data) => ({
      ...data,
      parts: data.parts.map((part, index) =>
        index === 0 ? { ...part, stock: part.stock + 1 } : part,
      ),
    })),
    null,
  );
  assert.equal(useParts.getState().data.parts[0].stock, initialPartsData.parts[0].stock + 1);
  assert.ok(saved.has('hamyar-parts-v1'));
  assert.ok(
    useParts
      .getState()
      .change((data) => ({ ...data, parts: data.parts.map((part) => ({ ...part, stock: -1 })) })),
  );
  assert.equal(useParts.getState().data.parts[0].stock, initialPartsData.parts[0].stock + 1);
});

test('blocked storage keeps service records in memory but rejects saving company settings', () => {
  const previous = useCompanySettings.getState().settings;
  blocked = true;
  try {
    assert.equal(
      useDemo.getState().addTransaction({
        id: 'memory-expense',
        kind: 'expense',
        jobId: '',
        amount: 100,
        date: '2026-11-17',
        description: 'expense',
      }),
      null,
    );
    assert.equal(useDemo.getState().storageError, true);
    assert.ok(useDemo.getState().transactions.some((item) => item.id === 'memory-expense'));
    assert.ok(
      useCompanySettings
        .getState()
        .saveSettings({ ...defaultCompanySettings, companyName: 'changed' }),
    );
    assert.equal(useCompanySettings.getState().settings, previous);
  } finally {
    blocked = false;
  }
  assert.equal(
    useCompanySettings
      .getState()
      .saveSettings({ ...defaultCompanySettings, companyName: 'saved company' }),
    null,
  );
  assert.equal(useCompanySettings.getState().settings.companyName, 'saved company');
  assert.ok(saved.has('hamyar-company-settings-v1'));
});
