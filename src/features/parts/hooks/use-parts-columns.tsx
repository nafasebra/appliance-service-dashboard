import { translateLabel } from '@/shared/i18n';
import { useMemo } from 'react';
import type { Customer, Job, Technician } from '@/entities/service/model/types';
import {
  availableQuantity,
  reservedQuantity,
  needLabels,
  purchaseLabels,
  type Part,
  type PartNeed,
  type PartPurchase,
  type PartsData,
  type NeedStatus,
} from '../model/parts';
import { getPartJobLabel } from '../utils/part-filters';
import { createColumnHelper } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/shared/ui/data-table-features';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import { useTranslation } from 'react-i18next';

const inventoryColumn = createColumnHelper<DataTableFeatures, Part>();
const purchaseColumn = createColumnHelper<DataTableFeatures, PartPurchase>();
const needColumn = createColumnHelper<DataTableFeatures, PartNeed>();

interface PartsColumnOptions {
  data: PartsData;
  jobs: Job[];
  customers: Customer[];
  technicians: Technician[];
  act: (operation: (data: PartsData) => PartsData) => boolean;
  setEditing: (part: Part) => void;
  setForm: (form: 'part') => void;
  setReceiving: (id: string) => void;
  needAction: (id: string, next: NeedStatus) => void;
  setDelivery: (id: string) => void;
}

export function usePartsColumns({
  data,
  jobs,
  customers,
  technicians,
  act,
  setEditing,
  setForm,
  setReceiving,
  needAction,
  setDelivery,
}: PartsColumnOptions) {
  const { t } = useTranslation();
  const inventoryColumns = useMemo(
    () =>
      inventoryColumn.columns([
        inventoryColumn.accessor((part) => part.name, {
          id: 'قطعه / کد',
          header: 'قطعه / کد',
          cell: ({ row: { original: part } }) => (
            <>
              <strong>{part.name}</strong>
              <div>
                <bdi>{part.code}</bdi>
              </div>
            </>
          ),
        }),
        inventoryColumn.accessor((part) => part.appliance, {
          id: 'دستگاه و سازگاری',
          header: 'دستگاه و سازگاری',
          cell: ({ row: { original: part } }) => (
            <>
              {translateLabel(part.appliance)}
              <p className="text-xs text-muted-foreground">{part.compatibility}</p>
            </>
          ),
        }),
        inventoryColumn.accessor((part) => part.location, { id: 'محل', header: 'محل' }),
        inventoryColumn.accessor((part) => part.stock, {
          id: 'فیزیکی',
          header: 'فیزیکی',
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor((part) => reservedQuantity(data, part.id), {
          id: 'رزرو',
          header: 'رزرو',
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor((part) => availableQuantity(data, part.id), {
          id: 'قابل تخصیص',
          header: 'قابل تخصیص',
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor(
          (part) =>
            !part.active
              ? t('ui.inactive')
              : availableQuantity(data, part.id) === 0
                ? t('ui.outOfStock')
                : availableQuantity(data, part.id) <= part.minimum
                  ? t('ui.lowStock')
                  : t('ui.inStock'),
          {
            id: 'وضعیت',
            header: 'وضعیت',
            cell: ({ cell }) => <Badge variant="secondary">{cell.getValue()}</Badge>,
          },
        ),
        inventoryColumn.display({
          id: 'عملیات',
          header: 'عملیات',
          enableSorting: false,
          cell: ({ row: { original: part } }) => (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(part);
                  setForm('part');
                }}
              >
                {t('ui.edit')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  act((current) => ({
                    ...current,
                    parts: current.parts.map((p) =>
                      p.id === part.id ? { ...p, active: !p.active } : p,
                    ),
                  }))
                }
              >
                {part.active ? t('ui.inactive') : t('ui.active')}
              </Button>
            </div>
          ),
        }),
      ]),
    [data, setEditing, setForm, act, t],
  );
  const purchaseColumns = useMemo(
    () =>
      purchaseColumn.columns([
        purchaseColumn.accessor(
          (purchase) => data.parts.find((p) => p.id === purchase.partId)?.name,
          { id: 'قطعه', header: 'قطعه' },
        ),
        purchaseColumn.accessor(
          (purchase) =>
            purchase.needId
              ? getPartJobLabel(
                  data.needs.find((n) => n.id === purchase.needId)?.jobId ?? '',
                  jobs,
                  customers,
                )
              : t('ui.replenishInventory'),
          { id: 'مرتبط با درخواست', header: 'مرتبط با درخواست' },
        ),
        purchaseColumn.accessor((purchase) => purchase.supplier || t('ui.notSpecified'), {
          id: 'تأمین‌کننده',
          header: 'تأمین‌کننده',
        }),
        purchaseColumn.accessor((purchase) => purchase.quantity, {
          id: 'تعداد خرید',
          header: 'تعداد خرید',
          cell: ({ cell }) => cell.getValue(),
        }),
        purchaseColumn.accessor((purchase) => purchase.received, {
          id: 'دریافت',
          header: 'دریافت',
          cell: ({ cell }) => cell.getValue(),
        }),
        purchaseColumn.accessor(
          (purchase) =>
            purchase.received > 0 && purchase.status === 'ordered'
              ? t('ui.partiallyReceived')
              : translateLabel(purchaseLabels[purchase.status]),
          {
            id: 'وضعیت',
            header: 'وضعیت',
            cell: ({ row: { original: purchase } }) => (
              <Badge variant="secondary">
                {purchase.received > 0 && purchase.status === 'ordered'
                  ? t('ui.partiallyReceived')
                  : translateLabel(purchaseLabels[purchase.status])}
              </Badge>
            ),
          },
        ),
        purchaseColumn.display({
          id: 'عملیات',
          header: 'عملیات',
          enableSorting: false,
          cell: ({ row: { original: purchase } }) => (
            <div className="flex gap-2">
              {purchase.status === 'pending' ? (
                <Button
                  size="sm"
                  onClick={() =>
                    act((current) => ({
                      ...current,
                      purchases: current.purchases.map((p) =>
                        p.id === purchase.id ? { ...p, status: 'approved' } : p,
                      ),
                    }))
                  }
                >
                  {t('ui.approvePurchase')}
                </Button>
              ) : null}
              {purchase.status === 'approved' ? (
                <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                  {t('ui.placePurchaseOrder')}
                </Button>
              ) : null}
              {purchase.status === 'ordered' ? (
                <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                  {t('ui.receiveGoods')}
                </Button>
              ) : null}
              {['pending', 'approved'].includes(purchase.status) ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    act((current) => ({
                      ...current,
                      purchases: current.purchases.map((p) =>
                        p.id === purchase.id ? { ...p, status: 'cancelled' } : p,
                      ),
                    }))
                  }
                >
                  {t('ui.cancel')}
                </Button>
              ) : null}
            </div>
          ),
        }),
      ]),
    [data, jobs, customers, act, setReceiving, t],
  );
  const needColumns = useMemo(
    () =>
      needColumn.columns([
        needColumn.accessor((need) => data.parts.find((p) => p.id === need.partId)?.name, {
          id: 'قطعه',
          header: 'قطعه',
        }),
        needColumn.accessor((need) => getPartJobLabel(need.jobId, jobs, customers), {
          id: 'سفارش مشتری',
          header: 'سفارش مشتری',
        }),
        needColumn.accessor((need) => need.quantity, {
          id: 'تعداد',
          header: 'تعداد',
          cell: ({ cell }) => cell.getValue(),
        }),
        needColumn.accessor((need) => availableQuantity(data, need.partId), {
          id: 'قابل تخصیص',
          header: 'قابل تخصیص',
          cell: ({ cell }) => cell.getValue(),
        }),
        needColumn.accessor((need) => translateLabel(needLabels[need.status]), {
          id: 'وضعیت',
          header: 'وضعیت',
          cell: ({ cell }) => <Badge variant="secondary">{cell.getValue()}</Badge>,
        }),
        needColumn.accessor(
          (need) => technicians.find((t) => t.id === need.technicianId)?.name ?? '—',
          { id: 'تحویل‌گیرنده', header: 'تحویل‌گیرنده' },
        ),
        needColumn.display({
          id: 'عملیات',
          header: 'عملیات',
          enableSorting: false,
          cell: ({ row: { original: need } }) => (
            <div className="flex flex-wrap gap-2">
              {['pending', 'unavailable', 'available'].includes(need.status) ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    needAction(
                      need.id,
                      availableQuantity(data, need.partId) >= need.quantity &&
                        data.parts.find((p) => p.id === need.partId)?.active
                        ? 'available'
                        : 'unavailable',
                    )
                  }
                  disabled={need.status === 'available'}
                >
                  {t('ui.checkAvailability')}
                </Button>
              ) : null}
              {need.status === 'available' ? (
                <Button size="sm" onClick={() => needAction(need.id, 'reserved')}>
                  {t('ui.reserveForOrder')}
                </Button>
              ) : null}
              {need.status === 'unavailable' ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={data.purchases.some(
                    (p) =>
                      p.needId === need.id && p.status !== 'cancelled' && p.status !== 'received',
                  )}
                  onClick={() =>
                    act((current) => ({
                      ...current,
                      purchases: [
                        ...current.purchases,
                        {
                          id: crypto.randomUUID(),
                          partId: need.partId,
                          needId: need.id,
                          quantity: Math.max(
                            1,
                            need.quantity - availableQuantity(current, need.partId),
                          ),
                          received: 0,
                          supplier: '',
                          status: 'pending',
                        },
                      ],
                    }))
                  }
                >
                  {t('ui.sendToProcurement')}
                </Button>
              ) : null}
              {need.status === 'reserved' ? (
                <Button size="sm" onClick={() => setDelivery(need.id)}>
                  {t('ui.deliverToTechnician')}
                </Button>
              ) : null}
              {need.status === 'delivered' ? (
                <>
                  <Button size="sm" onClick={() => needAction(need.id, 'used')}>
                    {t('ui.recordConsumption')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => needAction(need.id, 'returned')}
                  >
                    {t('ui.returnToInventory')}
                  </Button>
                </>
              ) : null}
              {['pending', 'available', 'unavailable', 'reserved'].includes(need.status) ? (
                <Button size="sm" variant="ghost" onClick={() => needAction(need.id, 'cancelled')}>
                  {t('ui.cancel')}
                </Button>
              ) : null}
            </div>
          ),
        }),
      ]),
    [data, jobs, customers, technicians, needAction, act, setDelivery, t],
  );
  return { inventoryColumns, purchaseColumns, needColumns };
}
