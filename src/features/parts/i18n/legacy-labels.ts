import type { ParseKeys } from 'i18next';

// Existing model labels and errors are translated without changing saved records.
export const partsLabelKeys = {
  'درخواست قطعه پیدا نشد.': 'validation.partRequestNotFound',
  'تأیید خرید': 'tables.approvePurchase',
  'در انتظار استعلام': 'statuses.needs.awaitingAvailabilityCheck',
  'موجود — قابل رزرو': 'statuses.needs.availableReadyToReserve',
  'نیازمند تأمین': 'statuses.needs.procurementNeeded',
  رزروشده: 'statuses.needs.reserved2',
  'تحویل تعمیرکار': 'statuses.needs.deliveredToTechnician',
  مصرف‌شده: 'statuses.needs.used',
  'برگشت به انبار': 'statuses.needs.returnedToInventory',
  لغوشده: 'statuses.cancelled',
  'در انتظار تأیید': 'statuses.purchases.awaitingApproval',
  سفارش‌داده‌شده: 'statuses.purchases.ordered',
  'دریافت کامل': 'statuses.purchases.fullyReceived',
  'قطعه پیدا نشد.': 'validation.partNotFound',
  'این تغییر وضعیت مجاز نیست.': 'validation.thisStatusChangeIsNotAllowed',
  'موجودی قابل تخصیص کافی نیست یا قطعه غیرفعال است.':
    'validation.availableStockIsInsufficientOrThePartIs',
  'تعمیرکار دریافت‌کننده را انتخاب کنید.': 'validation.selectTheReceivingTechnician',
  'موجودی انبار کافی نیست.': 'validation.insufficientStock',
  'فقط خرید سفارش‌داده‌شده قابل دریافت است.': 'validation.onlyAnOrderedPurchaseCanBeReceived',
  'تعداد دریافت باید مثبت و حداکثر برابر مانده خرید باشد.':
    'validation.receivedQuantityMustBePositiveAndCannotExceed',
  'اطلاعات قطعات معتبر نیست؛ موجودی و مقادیر را بررسی کنید.':
    'validation.partDetailsAreInvalidCheckStockAndQuantities',
  'ثبت اطلاعات انجام نشد.': 'validation.theChangesCouldNotBeSaved',
} as const satisfies Readonly<Record<string, ParseKeys<'parts'>>>;
