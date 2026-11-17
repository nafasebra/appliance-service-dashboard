import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialPartsData,
  availableQuantity,
  transitionNeed,
  receivePurchase,
  isPartsData,
} from './parts.ts';

test('reservation, delivery and return preserve stock accounting', () => {
  let data = structuredClone(initialPartsData);
  data.needs.push({
    id: 'n1',
    jobId: 'j1',
    partId: 'part-1',
    quantity: 2,
    status: 'pending',
    technicianId: '',
  });
  data = transitionNeed(data, 'n1', 'available');
  data = transitionNeed(data, 'n1', 'reserved');
  assert.equal(data.parts[0].stock, 8);
  assert.equal(availableQuantity(data, 'part-1'), 6);
  assert.throws(() => transitionNeed(data, 'n1', 'delivered'));
  data = transitionNeed(data, 'n1', 'delivered', 't1');
  assert.equal(data.parts[0].stock, 6);
  assert.equal(availableQuantity(data, 'part-1'), 6);
  data = transitionNeed(data, 'n1', 'returned');
  assert.equal(data.parts[0].stock, 8);
  assert.throws(() => transitionNeed(data, 'n1', 'returned'));
});

test('prevents overbooking and releases cancelled reservations', () => {
  let data = structuredClone(initialPartsData);
  data.needs.push({
    id: 'n1',
    jobId: 'j1',
    partId: 'part-1',
    quantity: 8,
    status: 'available',
    technicianId: '',
  });
  data = transitionNeed(data, 'n1', 'reserved');
  data.needs.push({
    id: 'n2',
    jobId: 'j2',
    partId: 'part-1',
    quantity: 1,
    status: 'available',
    technicianId: '',
  });
  assert.throws(() => transitionNeed(data, 'n2', 'reserved'));
  data = transitionNeed(data, 'n1', 'cancelled');
  assert.equal(availableQuantity(data, 'part-1'), 8);
});

test('partial receipts increase stock exactly once and reject excess receipts', () => {
  let data = structuredClone(initialPartsData);
  data.purchases.push({
    id: 'p1',
    partId: 'part-3',
    needId: '',
    quantity: 3,
    received: 0,
    supplier: 'supplier',
    status: 'ordered',
  });
  data = receivePurchase(data, 'p1', 1);
  assert.equal(data.parts[2].stock, 1);
  assert.equal(data.purchases[0].status, 'ordered');
  assert.throws(() => receivePurchase(data, 'p1', 3));
  data = receivePurchase(data, 'p1', 2);
  assert.equal(data.parts[2].stock, 3);
  assert.equal(data.purchases[0].status, 'received');
  assert.throws(() => receivePurchase(data, 'p1', 1));
  assert.equal(isPartsData(data), true);
  data.parts[2].stock = -1;
  assert.equal(isPartsData(data), false);
});
