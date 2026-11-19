import type { ParseKeys } from 'i18next';
export const financePageLabelKeys = {
  'خدمات قطعی': 'statement.finalizedServices',
  'دریافت از مشتری': 'ledger.customerReceipt',
  'پرداخت به تعمیرکار': 'ledger.technicianPayout',
  'هزینه شرکت': 'ledger.companyExpense',
  روش: 'register.method',
  'شماره سند': 'register.documentReference',
  'دریافت‌های مشتریان': 'navigation.customerReceipts',
  'هزینه‌های شرکت': 'navigation.companyExpenses',
  'مطالبات مشتریان': 'navigation.customerReceivables',
  'دفتر گردش مالی': 'navigation.transactionRegister',
  'حساب مشتریان': 'navigation.customerAccounts',
} as const satisfies Readonly<Record<string, ParseKeys<'finance-page'>>>;
