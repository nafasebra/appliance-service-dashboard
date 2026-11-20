import { JobStatus, type Job, type Transaction, type DemoData } from './types';

import { isDemoData } from './validation';

export enum PaymentStatus {
  Unfinalized = 'unfinalized',
  Unpaid = 'unpaid',
  Partial = 'partial',
  Paid = 'paid',
  Overpaid = 'overpaid',
}

export function getOrderAccount(job: Job, transactions: Transaction[]) {
  const receipts = transactions.reduce(
    (sum, item) => sum + (item.jobId === job.id && item.kind === 'receipt' ? item.amount : 0),
    0,
  );
  const charge = job.status === JobStatus.Completed ? job.total : 0;
  return {
    charge,
    receipts,
    outstanding: Math.max(0, charge - receipts),
    credit: Math.max(0, receipts - charge),
    status:
      job.status !== JobStatus.Completed
        ? PaymentStatus.Unfinalized
        : receipts === 0
          ? PaymentStatus.Unpaid
          : receipts < charge
            ? PaymentStatus.Partial
            : receipts === charge
              ? PaymentStatus.Paid
              : PaymentStatus.Overpaid,
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
  if (transaction.kind === 'receipt') {
    const job = data.jobs.find((item) => item.id === transaction.jobId);
    if (!job) throw new Error('سفارش مرتبط با دریافت وجه پیدا نشد.');
    const received = getOrderAccount(job, data.transactions).receipts;
    if (job.status === JobStatus.Cancelled || job.total <= 0)
      throw new Error('برای دریافت وجه، سفارش باید لغونشده و دارای مبلغ مشخص باشد.');
    if (received + transaction.amount > job.total)
      throw new Error('مبلغ دریافت از مانده قابل دریافت سفارش بیشتر است.');
  }
  if (transaction.kind === 'payout') {
    const job = data.jobs.find((item) => item.id === transaction.jobId);
    if (
      job?.status === JobStatus.Completed &&
      getOrderAccount(job, data.transactions).outstanding > 0
    )
      throw new Error('پیش از تسویه تعمیرکار، مانده مشتری باید کامل دریافت شود.');
  }
  if (!isDemoData(next)) throw new Error('مبلغ، تاریخ، شرح یا ارتباط تراکنش با سفارش معتبر نیست.');
  return next;
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Unfinalized]: 'مبلغ نهایی نشده',
  [PaymentStatus.Unpaid]: 'پرداخت‌نشده',
  [PaymentStatus.Partial]: 'پرداخت جزئی',
  [PaymentStatus.Paid]: 'پرداخت کامل',
  [PaymentStatus.Overpaid]: 'اضافه‌پرداخت',
};
export const paymentMethodLabels = { cash: 'نقدی', card: 'کارت‌خوان', bank: 'واریز بانکی' };
