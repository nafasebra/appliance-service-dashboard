import type { Job, Transaction, DemoData } from './types.ts';
import { isDemoData } from './validation.ts';

export function getOrderAccount(job: Job, transactions: Transaction[]) {
  const receipts = transactions.reduce(
    (sum, item) => sum + (item.jobId === job.id && item.kind === 'receipt' ? item.amount : 0),
    0,
  );
  const charge = job.status === 'completed' ? job.total : 0;
  return {
    charge,
    receipts,
    outstanding: Math.max(0, charge - receipts),
    credit: Math.max(0, receipts - charge),
    status:
      job.status !== 'completed'
        ? 'unfinalized'
        : receipts === 0
          ? 'unpaid'
          : receipts < charge
            ? 'partial'
            : receipts === charge
              ? 'paid'
              : 'overpaid',
  };
}

export function getCustomerAccount(customerId: string, jobs: Job[], transactions: Transaction[]) {
  const orders = jobs.filter((job) => job.customerId === customerId);
  return orders.reduce(
    (summary, job) => {
      const account = getOrderAccount(job, transactions);
      return {
        charge: summary.charge + account.charge,
        receipts: summary.receipts + account.receipts,
        outstanding: summary.outstanding + account.outstanding,
        credit: summary.credit + account.credit,
      };
    },
    { charge: 0, receipts: 0, outstanding: 0, credit: 0 },
  );
}

export function appendTransaction(data: DemoData, transaction: Transaction): DemoData {
  if (data.transactions.some((item) => item.id === transaction.id))
    throw new Error('این تراکنش قبلاً ثبت شده است.');
  const next = { ...data, transactions: [...data.transactions, transaction] };
  if (!isDemoData(next)) throw new Error('مبلغ، تاریخ، شرح یا ارتباط تراکنش با سفارش معتبر نیست.');
  if (transaction.kind === 'receipt') {
    const job = data.jobs.find((item) => item.id === transaction.jobId)!;
    const received = getOrderAccount(job, data.transactions).receipts;
    if (job.status === 'cancelled' || job.total <= 0)
      throw new Error('برای دریافت وجه، سفارش باید لغونشده و دارای مبلغ مشخص باشد.');
    if (received + transaction.amount > job.total)
      throw new Error('مبلغ دریافت از مانده قابل دریافت سفارش بیشتر است.');
  }
  return next;
}

export const paymentStatusLabels: Record<string, string> = {
  unfinalized: 'مبلغ نهایی نشده',
  unpaid: 'پرداخت‌نشده',
  partial: 'پرداخت جزئی',
  paid: 'پرداخت کامل',
  overpaid: 'اضافه‌پرداخت',
};
export const paymentMethodLabels = { cash: 'نقدی', card: 'کارت‌خوان', bank: 'واریز بانکی' };
