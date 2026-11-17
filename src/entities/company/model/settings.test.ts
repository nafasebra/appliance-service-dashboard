import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCompanySettings, isCompanySettings } from './settings.ts';

test('accepts defaults and custom company settings', () => {
  assert.equal(isCompanySettings(defaultCompanySettings), true);
  assert.equal(
    isCompanySettings({
      ...defaultCompanySettings,
      companyName: 'شرکت تعمیرات',
      defaultVisitTime: '14:30',
      defaultPriority: 'urgent',
    }),
    true,
  );
});

test('rejects malformed persisted settings and invalid visit defaults', () => {
  for (const value of [
    null,
    {},
    { ...defaultCompanySettings, companyName: ' ' },
    { ...defaultCompanySettings, defaultVisitTime: '25:00' },
    { ...defaultCompanySettings, defaultPriority: 'other' },
    { ...defaultCompanySettings, phone: 123 },
    { ...defaultCompanySettings, address: 'a'.repeat(301) },
  ]) {
    assert.equal(isCompanySettings(value), false);
  }
});
