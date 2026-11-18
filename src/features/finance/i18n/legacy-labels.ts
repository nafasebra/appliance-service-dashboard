import type { ParseKeys } from 'i18next';

// Existing model labels and errors are translated without changing saved records.
export const financeLabelKeys = {
  'خدمات قطعی': 'statement.finalizedServices',
  'دریافت از مشتری': 'ledger.customerReceipt',
  'پرداخت به تعمیرکار': 'ledger.technicianPayout',
  'هزینه شرکت': 'ledger.companyExpense',
  روش: 'register.method',
  'شماره سند': 'register.documentReference',
} as const satisfies Readonly<Record<string, ParseKeys<'finance'>>>;
