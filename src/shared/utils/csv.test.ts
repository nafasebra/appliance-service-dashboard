import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeCsvCell } from './csv.ts';

test('escapes CSV quotes and neutralizes spreadsheet formulas', () => {
  assert.equal(escapeCsvCell('a"b'), '"a""b"');
  assert.equal(escapeCsvCell('=SUM(A1)'), '"\'=SUM(A1)"');
  assert.equal(escapeCsvCell('normal,value'), '"normal,value"');
});
