import { usePartsTranslation } from '../i18n/use-parts-translation';
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
  const t = usePartsTranslation();
  const { t: tShared } = useTranslation();
  const inventoryColumns = useMemo(
    () =>
      inventoryColumn.columns([
        inventoryColumn.accessor((part) => part.name, {
          id: 'قطعه / کد',
          header: t('tables.partCode'),
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
          header: t('tables.applianceAndCompatibility'),
          cell: ({ row: { original: part } }) => (
            <>
              {translateLabel(part.appliance)}
              <p className="text-xs text-muted-foreground">{part.compatibility}</p>
            </>
          ),
        }),
        inventoryColumn.accessor((part) => part.location, {
          id: 'محل',
          header: t('tables.location'),
        }),
        inventoryColumn.accessor((part) => part.stock, {
          id: 'فیزیکی',
          header: t('tables.physicalStock'),
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor((part) => reservedQuantity(data, part.id), {
          id: 'رزرو',
          header: t('tables.reserved'),
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor((part) => availableQuantity(data, part.id), {
          id: 'قابل تخصیص',
          header: t('tables.available'),
          cell: ({ cell }) => cell.getValue(),
        }),
        inventoryColumn.accessor(
          (part) =>
            !part.active
              ? t('tables.inactive')
              : availableQuantity(data, part.id) === 0
                ? t('tables.outOfStock')
                : availableQuantity(data, part.id) <= part.minimum
                  ? t('tables.lowStock')
                  : t('tables.inStock'),
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
                {tShared('ui.edit')}
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
                {part.active ? t('tables.inactive') : t('tables.active')}
              </Button>
            </div>
          ),
        }),
      ]),
    [data, setEditing, setForm, act, t, tShared],
  );
  const purchaseColumns = useMemo(
    () =>
      purchaseColumn.columns([
        purchaseColumn.accessor(
          (purchase) => data.parts.find((p) => p.id === purchase.partId)?.name,
          { id: 'قطعه', header: t('tables.part') },
        ),
        purchaseColumn.accessor(
          (purchase) =>
            purchase.needId
              ? getPartJobLabel(
                  data.needs.find((n) => n.id === purchase.needId)?.jobId ?? '',
                  jobs,
                  customers,
                )
              : t('tables.replenishInventory'),
          { id: 'مرتبط با درخواست', header: t('tables.relatedRequest') },
        ),
        purchaseColumn.accessor((purchase) => purchase.supplier || tShared('ui.notSpecified'), {
          id: 'تأمین‌کننده',
          header: t('tables.supplier'),
        }),
        purchaseColumn.accessor((purchase) => purchase.quantity, {
          id: 'تعداد خرید',
          header: t('tables.purchaseQuantity'),
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
              ? t('statuses.purchases.partiallyReceived')
              : translateLabel(purchaseLabels[purchase.status]),
          {
            id: 'وضعیت',
            header: 'وضعیت',
            cell: ({ row: { original: purchase } }) => (
              <Badge variant="secondary">
                {purchase.received > 0 && purchase.status === 'ordered'
                  ? t('statuses.purchases.partiallyReceived')
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
                  {t('tables.approvePurchase')}
                </Button>
              ) : null}
              {purchase.status === 'approved' ? (
                <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                  {t('tables.placePurchaseOrder')}
                </Button>
              ) : null}
              {purchase.status === 'ordered' ? (
                <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                  {t('tables.receiveGoods')}
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
                  {t('tables.cancel')}
                </Button>
              ) : null}
            </div>
          ),
        }),
      ]),
    [data, jobs, customers, act, setReceiving, t, tShared],
  );
  const needColumns = useMemo(
    () =>
      needColumn.columns([
        needColumn.accessor((need) => data.parts.find((p) => p.id === need.partId)?.name, {
          id: 'قطعه',
          header: t('tables.part'),
        }),
        needColumn.accessor((need) => getPartJobLabel(need.jobId, jobs, customers), {
          id: 'سفارش مشتری',
          header: 'سفارش مشتری',
        }),
        needColumn.accessor((need) => need.quantity, {
          id: 'تعداد',
          header: t('tables.quantity'),
          cell: ({ cell }) => cell.getValue(),
        }),
        needColumn.accessor((need) => availableQuantity(data, need.partId), {
          id: 'قابل تخصیص',
          header: t('tables.available'),
          cell: ({ cell }) => cell.getValue(),
        }),
        needColumn.accessor((need) => translateLabel(needLabels[need.status]), {
          id: 'وضعیت',
          header: 'وضعیت',
          cell: ({ cell }) => <Badge variant="secondary">{cell.getValue()}</Badge>,
        }),
        needColumn.accessor(
          (need) => technicians.find((t) => t.id === need.technicianId)?.name ?? '—',
          { id: 'تحویل‌گیرنده', header: t('tables.recipient') },
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
                  {t('tables.checkAvailability')}
                </Button>
              ) : null}
              {need.status === 'available' ? (
                <Button size="sm" onClick={() => needAction(need.id, 'reserved')}>
                  {t('tables.reserveForOrder')}
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
                  {t('tables.sendToProcurement')}
                </Button>
              ) : null}
              {need.status === 'reserved' ? (
                <Button size="sm" onClick={() => setDelivery(need.id)}>
                  {t('tables.deliverToTechnician')}
                </Button>
              ) : null}
              {need.status === 'delivered' ? (
                <>
                  <Button size="sm" onClick={() => needAction(need.id, 'used')}>
                    {t('tables.recordConsumption')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => needAction(need.id, 'returned')}
                  >
                    {t('tables.returnToInventory')}
                  </Button>
                </>
              ) : null}
              {['pending', 'available', 'unavailable', 'reserved'].includes(need.status) ? (
                <Button size="sm" variant="ghost" onClick={() => needAction(need.id, 'cancelled')}>
                  {t('tables.cancel')}
                </Button>
              ) : null}
            </div>
          ),
        }),
      ]),
    [data, jobs, customers, technicians, needAction, act, setDelivery, t, tShared],
  );
  return { inventoryColumns, purchaseColumns, needColumns };
}
