import type { ParseKeys } from 'i18next';
// Compatibility labels retain stored Persian values at their owning UI boundary.
export const requestsLabelKeys = {
  عادی: 'priorities.normal',
  فوری: 'priorities.urgent',
  'نوع دستگاه': 'common.applianceType',
  'سفارش مشتری': 'common.customerOrder',
  'کل درخواست‌ها': 'common.totalRequests',
  مشتری: 'common.customer',
  سفارش: 'common.order',
  'مبلغ خدمت': 'common.serviceAmount',
  'بدون تخصیص': 'common.unassigned',
  'در انتظار بررسی': 'statuses.awaitingReview',
  'تأییدشده، در انتظار تخصیص': 'statuses.accepted',
  'در انتظار اعزام': 'statuses.awaitingDispatch',
  'در حال انجام': 'statuses.inProgress',
  یخچال: 'appliances.refrigerator',
  لباسشویی: 'appliances.washingMachine',
  ظرفشویی: 'appliances.dishwasher',
  'کولر گازی': 'appliances.airConditioner',
  'اجاق گاز': 'appliances.stove',
  'برنامه‌ریزی شده': 'statuses.scheduled',
  'تکمیل شده': 'statuses.completed',
  'لغو شده': 'statuses.cancelled',
  'درخواستی که تراکنش مالی دارد باید تکمیل‌شده باقی بماند. ابتدا برای اصلاح مالی، فرایند برگشت یا ابطال تراکنش تعریف کنید.':
    'validation.aCompletedRequestWithFinancialTransactionsMustRemain',
  'پس از ثبت پرداخت به تعمیرکار، امکان تغییر تعمیرکار این درخواست وجود ندارد.':
    'validation.theTechnicianCannotBeChangedAfterAPayout',
  'سهم تعمیرکار نمی‌تواند از مجموع پرداخت‌های ثبت‌شده برای این درخواست کمتر باشد.':
    'validation.theTechnicianSShareCannotBeLessThan',
  'سفارش دارای تراکنش مالی را نمی‌توان به مشتری دیگری منتقل کرد.':
    'validation.anOrderWithFinancialTransactionsCannotBeTransferred',
  'سفارش دارای دریافت وجه را بدون اصلاح مالی نمی‌توان لغو کرد یا مبلغ آن را کمتر از دریافت ثبت‌شده قرار داد.':
    'validation.anOrderWithReceiptsCannotBeCancelledOr',
  'اطلاعات سفارش معتبر نیست.': 'validation.orderDetailsAreInvalid',
} as const satisfies Readonly<Record<string, ParseKeys<'requests'>>>;
