import {
  PurchaseStatus,
  NeedStatus,
  initialPartsData,
  availableQuantity,
  transitionNeed,
  receivePurchase,
  isPartsData,
} from './parts';

import test from 'node:test';
import assert from 'node:assert/strict';

test('persisted need and purchase statuses must be strings', () => {
  const need = {
    id: 'typed-need',
    jobId: 'j1',
    partId: 'part-1',
    quantity: 1,
    status: NeedStatus.Pending,
    technicianId: '',
  };
  const purchase = {
    id: 'typed-purchase',
    partId: 'part-1',
    needId: need.id,
    quantity: 1,
    received: 0,
    supplier: '',
    status: PurchaseStatus.Pending,
  };
  const valid = { ...structuredClone(initialPartsData), needs: [need], purchases: [purchase] };
  assert.equal(isPartsData(valid), true);
  assert.equal(isPartsData(JSON.parse(JSON.stringify(valid))), true);
  assert.equal(isPartsData({ ...valid, needs: [{ ...need, status: ['pending'] }] }), false);
  assert.equal(isPartsData({ ...valid, purchases: [{ ...purchase, status: ['pending'] }] }), false);
});

test('reservation, delivery and return preserve stock accounting', () => {
  let data = structuredClone(initialPartsData);
  data.needs.push({
    id: 'n1',
    jobId: 'j1',
    partId: 'part-1',
    quantity: 2,
    status: NeedStatus.Pending,
    technicianId: '',
  });
  data = transitionNeed(data, 'n1', NeedStatus.Available);
  data = transitionNeed(data, 'n1', NeedStatus.Reserved);
  assert.equal(data.parts[0].stock, 8);
  assert.equal(availableQuantity(data, 'part-1'), 6);
  assert.throws(() => transitionNeed(data, 'n1', NeedStatus.Delivered));
  data = transitionNeed(data, 'n1', NeedStatus.Delivered, 't1');
  assert.equal(data.parts[0].stock, 6);
  assert.equal(availableQuantity(data, 'part-1'), 6);
  data = transitionNeed(data, 'n1', NeedStatus.Returned);
  assert.equal(data.parts[0].stock, 8);
  assert.throws(() => transitionNeed(data, 'n1', NeedStatus.Returned));
});

test('prevents overbooking and releases cancelled reservations', () => {
  let data = structuredClone(initialPartsData);
  data.needs.push({
    id: 'n1',
    jobId: 'j1',
    partId: 'part-1',
    quantity: 8,
    status: NeedStatus.Available,
    technicianId: '',
  });
  data = transitionNeed(data, 'n1', NeedStatus.Reserved);
  data.needs.push({
    id: 'n2',
    jobId: 'j2',
    partId: 'part-1',
    quantity: 1,
    status: NeedStatus.Available,
    technicianId: '',
  });
  assert.throws(() => transitionNeed(data, 'n2', NeedStatus.Reserved));
  data = transitionNeed(data, 'n1', NeedStatus.Cancelled);
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
    status: PurchaseStatus.Ordered,
  });
  data = receivePurchase(data, 'p1', 1);
  assert.equal(data.parts[2].stock, 1);
  assert.equal(data.purchases[0].status, PurchaseStatus.Ordered);
  assert.throws(() => receivePurchase(data, 'p1', 3));
  data = receivePurchase(data, 'p1', 2);
  assert.equal(data.parts[2].stock, 3);
  assert.equal(data.purchases[0].status, PurchaseStatus.Received);
  assert.throws(() => receivePurchase(data, 'p1', 1));
  assert.equal(isPartsData(data), true);
  data.parts[2].stock = -1;
  assert.equal(isPartsData(data), false);
});
