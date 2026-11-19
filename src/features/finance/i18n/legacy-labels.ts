import type { ParseKeys } from 'i18next';
// Compatibility labels retain stored Persian values at their owning UI boundary.
export const financeLabelKeys = {
  'خالص گردش نقدی': 'common.netCashFlow',
  'ارزش خدمات تکمیل‌شده': 'common.completedServiceValue',
  دریافت: 'common.received2',
  'کمیسیون شرکت': 'common.companyCommission',
  'پیش از تسویه تعمیرکار، مانده مشتری باید کامل دریافت شود.': 'validation.collectBeforePayout',
  'این تراکنش قبلاً ثبت شده است.': 'validation.thisTransactionHasAlreadyBeenRecorded',
  'سفارش مرتبط با دریافت وجه پیدا نشد.': 'validation.theOrderAssociatedWithThisReceiptWasNot',
  'برای دریافت وجه، سفارش باید لغونشده و دارای مبلغ مشخص باشد.':
    'validation.receiptsRequireANonCancelledOrderWithA',
  'مبلغ دریافت از مانده قابل دریافت سفارش بیشتر است.':
    'validation.theReceiptExceedsTheOrderSCollectibleBalance',
  'مبلغ، تاریخ، شرح یا ارتباط تراکنش با سفارش معتبر نیست.':
    'validation.theAmountDateDescriptionOrOrderReferenceIs',
  'مبلغ نهایی نشده': 'paymentStatuses.amountNotFinalized',
  پرداخت‌نشده: 'paymentStatuses.unpaid',
  'پرداخت جزئی': 'paymentStatuses.partiallyPaid',
  'پرداخت کامل': 'paymentStatuses.fullyPaid',
  اضافه‌پرداخت: 'paymentStatuses.overpaid',
  نقدی: 'paymentMethods.cash',
  کارت‌خوان: 'paymentMethods.cardTerminal',
  'واریز بانکی': 'paymentMethods.bankTransfer',
  'ثبت تراکنش انجام نشد.': 'validation.theTransactionCouldNotBeRecorded',
} as const satisfies Readonly<Record<string, ParseKeys<'finance'>>>;
