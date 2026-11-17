import type { Appliance } from '@/entities/service/model/types';

export interface Part {
  id: string;
  code: string;
  name: string;
  appliance: Appliance;
  compatibility: string;
  location: string;
  stock: number;
  minimum: number;
  active: boolean;
}
export type NeedStatus =
  | 'pending'
  | 'available'
  | 'unavailable'
  | 'reserved'
  | 'delivered'
  | 'used'
  | 'returned'
  | 'cancelled';
export interface PartNeed {
  id: string;
  partId: string;
  jobId: string;
  quantity: number;
  status: NeedStatus;
  technicianId: string;
}
export type PurchaseStatus = 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
export interface PartPurchase {
  id: string;
  partId: string;
  needId: string;
  quantity: number;
  received: number;
  supplier: string;
  status: PurchaseStatus;
}
export interface PartsData {
  parts: Part[];
  needs: PartNeed[];
  purchases: PartPurchase[];
}
export const needLabels: Record<NeedStatus, string> = {
  pending: 'در انتظار استعلام',
  available: 'موجود — قابل رزرو',
  unavailable: 'نیازمند تأمین',
  reserved: 'رزروشده',
  delivered: 'تحویل تعمیرکار',
  used: 'مصرف‌شده',
  returned: 'برگشت به انبار',
  cancelled: 'لغوشده',
};
export const purchaseLabels: Record<PurchaseStatus, string> = {
  pending: 'در انتظار تأیید',
  approved: 'تأیید خرید',
  ordered: 'سفارش‌داده‌شده',
  received: 'دریافت کامل',
  cancelled: 'لغوشده',
};
export function reservedQuantity(data: PartsData, partId: string): number {
  return data.needs.reduce(
    (sum, need) => sum + (need.partId === partId && need.status === 'reserved' ? need.quantity : 0),
    0,
  );
}
export function availableQuantity(data: PartsData, partId: string): number {
  return (
    (data.parts.find((part) => part.id === partId)?.stock ?? 0) - reservedQuantity(data, partId)
  );
}
export function transitionNeed(
  data: PartsData,
  id: string,
  status: NeedStatus,
  technicianId = '',
): PartsData {
  const need = data.needs.find((item) => item.id === id);
  if (!need) throw new Error('درخواست قطعه پیدا نشد.');
  const part = data.parts.find((item) => item.id === need.partId);
  if (!part) throw new Error('قطعه پیدا نشد.');
  const allowed: Record<NeedStatus, NeedStatus[]> = {
    pending: ['available', 'unavailable', 'cancelled'],
    available: ['reserved', 'unavailable', 'cancelled'],
    unavailable: ['available', 'unavailable', 'cancelled'],
    reserved: ['delivered', 'cancelled'],
    delivered: ['used', 'returned'],
    used: [],
    returned: [],
    cancelled: [],
  };
  if (!allowed[need.status].includes(status)) throw new Error('این تغییر وضعیت مجاز نیست.');
  if (
    (status === 'available' || status === 'reserved') &&
    (!part.active || availableQuantity(data, part.id) < need.quantity)
  )
    throw new Error('موجودی قابل تخصیص کافی نیست یا قطعه غیرفعال است.');
  if (status === 'delivered' && !technicianId)
    throw new Error('تعمیرکار دریافت‌کننده را انتخاب کنید.');
  const delta = status === 'delivered' ? -need.quantity : status === 'returned' ? need.quantity : 0;
  if (part.stock + delta < 0) throw new Error('موجودی انبار کافی نیست.');
  return {
    ...data,
    parts: data.parts.map((item) =>
      item.id === part.id ? { ...item, stock: item.stock + delta } : item,
    ),
    needs: data.needs.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            technicianId: status === 'delivered' ? technicianId : item.technicianId,
          }
        : item,
    ),
  };
}
export function receivePurchase(data: PartsData, id: string, quantity: number): PartsData {
  const purchase = data.purchases.find((item) => item.id === id);
  if (!purchase || purchase.status !== 'ordered')
    throw new Error('فقط خرید سفارش‌داده‌شده قابل دریافت است.');
  if (
    !Number.isSafeInteger(quantity) ||
    quantity <= 0 ||
    quantity > purchase.quantity - purchase.received
  )
    throw new Error('تعداد دریافت باید مثبت و حداکثر برابر مانده خرید باشد.');
  return {
    ...data,
    parts: data.parts.map((part) =>
      part.id === purchase.partId ? { ...part, stock: part.stock + quantity } : part,
    ),
    purchases: data.purchases.map((item) =>
      item.id === id
        ? {
            ...item,
            received: item.received + quantity,
            status: item.received + quantity === item.quantity ? 'received' : 'ordered',
          }
        : item,
    ),
  };
}

export const initialPartsData: PartsData = {
  parts: [
    {
      id: 'part-1',
      code: 'WM-PUMP-01',
      name: 'پمپ تخلیه لباسشویی',
      appliance: 'لباسشویی',
      compatibility: 'سامسونگ — بررسی مدل پیش از نصب',
      location: 'قفسه A-1',
      stock: 8,
      minimum: 3,
      active: true,
    },
    {
      id: 'part-2',
      code: 'RF-THERM-01',
      name: 'ترموستات یخچال',
      appliance: 'یخچال',
      compatibility: 'مدل‌های مکانیکی سازگار',
      location: 'قفسه B-2',
      stock: 2,
      minimum: 3,
      active: true,
    },
    {
      id: 'part-3',
      code: 'DW-HEAT-01',
      name: 'المنت ظرفشویی',
      appliance: 'ظرفشویی',
      compatibility: 'بوش — بررسی کد فنی',
      location: 'قفسه C-1',
      stock: 0,
      minimum: 2,
      active: true,
    },
    {
      id: 'part-4',
      code: 'AC-CAP-01',
      name: 'خازن کولر گازی',
      appliance: 'کولر گازی',
      compatibility: '۴۵ میکروفاراد',
      location: 'قفسه D-1',
      stock: 12,
      minimum: 4,
      active: true,
    },
    {
      id: 'part-5',
      code: 'GS-IGN-01',
      name: 'جرقه‌زن اجاق گاز',
      appliance: 'اجاق گاز',
      compatibility: 'یونیورسال — بررسی اتصال',
      location: 'قفسه E-1',
      stock: 5,
      minimum: 2,
      active: true,
    },
  ],
  needs: [],
  purchases: [],
};

export function isPartsData(value: unknown): value is PartsData {
  if (!value || typeof value !== 'object') return false;
  const data = value as PartsData;
  const integer = (n: unknown) => Number.isSafeInteger(n) && Number(n) >= 0;
  const text = (s: unknown) => typeof s === 'string' && s.trim().length > 0;
  if (!Array.isArray(data.parts) || !Array.isArray(data.needs) || !Array.isArray(data.purchases))
    return false;
  if (
    !data.parts.every(
      (p) =>
        p &&
        text(p.id) &&
        text(p.code) &&
        text(p.name) &&
        ['لباسشویی', 'یخچال', 'ظرفشویی', 'کولر گازی', 'اجاق گاز'].includes(p.appliance) &&
        text(p.compatibility) &&
        text(p.location) &&
        integer(p.stock) &&
        integer(p.minimum) &&
        typeof p.active === 'boolean',
    )
  )
    return false;
  const ids = new Set(data.parts.map((p) => p.id));
  if (
    !data.needs.every(
      (n) =>
        n &&
        text(n.id) &&
        ids.has(n.partId) &&
        text(n.jobId) &&
        integer(n.quantity) &&
        n.quantity > 0 &&
        Object.hasOwn(needLabels, n.status) &&
        typeof n.technicianId === 'string' &&
        (!['delivered', 'used', 'returned'].includes(n.status) || text(n.technicianId)),
    )
  )
    return false;
  if (
    !data.purchases.every(
      (p) =>
        p &&
        text(p.id) &&
        ids.has(p.partId) &&
        typeof p.needId === 'string' &&
        (!p.needId || data.needs.some((n) => n.id === p.needId && n.partId === p.partId)) &&
        integer(p.quantity) &&
        p.quantity > 0 &&
        integer(p.received) &&
        p.received <= p.quantity &&
        typeof p.supplier === 'string' &&
        Object.hasOwn(purchaseLabels, p.status) &&
        (p.status !== 'received' || p.received === p.quantity),
    )
  )
    return false;
  return (
    [data.parts, data.needs, data.purchases].every(
      (records) => new Set(records.map((r) => r.id)).size === records.length,
    ) &&
    new Set(data.parts.map((p) => p.code)).size === data.parts.length &&
    data.parts.every((p) => availableQuantity(data, p.id) >= 0)
  );
}
