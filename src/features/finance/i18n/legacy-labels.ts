import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const financeLabelKeys = {
  'خدمات قطعی': 'statement.finalizedServices',
  'دریافت از مشتری': 'ledger.customerReceipt',
  'پرداخت به تعمیرکار': 'ledger.technicianPayout',
  'هزینه شرکت': 'ledger.companyExpense',
  روش: 'register.method',
  'شماره سند': 'register.documentReference',
  'پیش از تسویه تعمیرکار، مانده مشتری باید کامل دریافت شود.': 'validation.collectBeforePayout',
  'خالص گردش نقدی': 'common.netCashFlow',
  'دریافت‌های مشتریان': 'navigation.customerReceipts',
  'هزینه‌های شرکت': 'navigation.companyExpenses',
  'مطالبات مشتریان': 'navigation.customerReceivables',
  'دفتر گردش مالی': 'navigation.transactionRegister',
  'ارزش خدمات تکمیل‌شده': 'common.completedServiceValue',
  'حساب مشتریان': 'navigation.customerAccounts',
  دریافت: 'common.received2',
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
  'کمیسیون شرکت': 'common.companyCommission',
  'ثبت تراکنش انجام نشد.': 'validation.theTransactionCouldNotBeRecorded',
} as const satisfies Readonly<Record<string, ParseKeys<'finance'>>>;
