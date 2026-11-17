import {
  appliances,
  type Customer,
  type DemoData,
  type Job,
  type Technician,
  type Transaction,
} from './types.ts';

const jobStatuses = new Set(['new', 'scheduled', 'working', 'completed', 'cancelled']);
const priorities = new Set(['normal', 'urgent']);
const transactionKinds = new Set(['receipt', 'payout', 'expense']);
const applianceNames = new Set<string>(appliances);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isMoney(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function isDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === Number(match[1]) &&
    date.getUTCMonth() + 1 === Number(match[2]) &&
    date.getUTCDate() === Number(match[3])
  );
}

function isTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function hasUniqueIds(records: Array<{ id: string }>) {
  return new Set(records.map((record) => record.id)).size === records.length;
}

function isCustomer(value: unknown): value is Customer {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.phone) &&
    isNonEmptyString(value.address)
  );
}

function isTechnician(value: unknown): value is Technician {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.specialty) &&
    isNonEmptyString(value.area) &&
    isNonEmptyString(value.phone)
  );
}

function isJob(value: unknown): value is Job {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.customerId) &&
    typeof value.appliance === 'string' &&
    applianceNames.has(value.appliance) &&
    isNonEmptyString(value.brand) &&
    isNonEmptyString(value.issue) &&
    typeof value.status === 'string' &&
    jobStatuses.has(value.status) &&
    typeof value.priority === 'string' &&
    priorities.has(value.priority) &&
    typeof value.technicianId === 'string' &&
    isDate(value.date) &&
    isTime(value.time) &&
    isMoney(value.total) &&
    isMoney(value.commission) &&
    value.commission <= value.total
  );
}

function isTransaction(value: unknown): value is Transaction {
  return (
    isRecord(value) &&
    (value.method === undefined || ['cash', 'card', 'bank'].includes(String(value.method))) &&
    (value.reference === undefined ||
      (typeof value.reference === 'string' && value.reference.length <= 100)) &&
    isNonEmptyString(value.id) &&
    typeof value.jobId === 'string' &&
    typeof value.kind === 'string' &&
    transactionKinds.has(value.kind) &&
    isMoney(value.amount) &&
    value.amount > 0 &&
    isDate(value.date) &&
    isNonEmptyString(value.description)
  );
}

export function isDemoData(value: unknown): value is DemoData {
  if (
    !isRecord(value) ||
    !Array.isArray(value.customers) ||
    !Array.isArray(value.technicians) ||
    !Array.isArray(value.jobs) ||
    !Array.isArray(value.transactions) ||
    !value.customers.every(isCustomer) ||
    !value.technicians.every(isTechnician) ||
    !value.jobs.every(isJob) ||
    !value.transactions.every(isTransaction)
  ) {
    return false;
  }

  const data: DemoData = {
    customers: value.customers,
    technicians: value.technicians,
    jobs: value.jobs,
    transactions: value.transactions,
  };
  if (
    !hasUniqueIds(data.customers) ||
    !hasUniqueIds(data.technicians) ||
    !hasUniqueIds(data.jobs) ||
    !hasUniqueIds(data.transactions)
  ) {
    return false;
  }

  const customerIds = new Set(data.customers.map((customer) => customer.id));
  const technicianIds = new Set(data.technicians.map((technician) => technician.id));
  const jobsById = new Map(data.jobs.map((job) => [job.id, job]));

  if (
    data.jobs.some(
      (job) =>
        !customerIds.has(job.customerId) ||
        (job.technicianId !== '' && !technicianIds.has(job.technicianId)) ||
        (['scheduled', 'working', 'completed'].includes(job.status) && job.technicianId === '') ||
        (job.status === 'completed' && job.total === 0),
    )
  ) {
    return false;
  }

  const payoutsByJob = new Map<string, number>();
  for (const transaction of data.transactions) {
    if (transaction.kind === 'expense') {
      if (transaction.jobId !== '') return false;
      continue;
    }

    const job = jobsById.get(transaction.jobId);
    if (!job) return false;
    if (transaction.kind === 'payout') {
      if (job.status !== 'completed') return false;
      payoutsByJob.set(job.id, (payoutsByJob.get(job.id) ?? 0) + transaction.amount);
    }
  }

  return data.jobs.every((job) => (payoutsByJob.get(job.id) ?? 0) <= job.total - job.commission);
}

export function validateJobUpdate(
  previous: Job | undefined,
  next: Job,
  transactions: Transaction[],
): string | null {
  if (!previous) return null;

  const linkedTransactions = transactions.filter((item) => item.jobId === previous.id);
  const payouts = linkedTransactions
    .filter((item) => item.kind === 'payout')
    .reduce((sum, item) => sum + item.amount, 0);

  if (
    linkedTransactions.length > 0 &&
    previous.status === 'completed' &&
    next.status !== 'completed'
  ) {
    return 'درخواستی که تراکنش مالی دارد باید تکمیل‌شده باقی بماند. ابتدا برای اصلاح مالی، فرایند برگشت یا ابطال تراکنش تعریف کنید.';
  }
  if (payouts > 0 && next.technicianId !== previous.technicianId) {
    return 'پس از ثبت پرداخت به تعمیرکار، امکان تغییر تعمیرکار این درخواست وجود ندارد.';
  }
  if (payouts > next.total - next.commission) {
    return 'سهم تعمیرکار نمی‌تواند از مجموع پرداخت‌های ثبت‌شده برای این درخواست کمتر باشد.';
  }

  const receipts = linkedTransactions.reduce(
    (sum, item) => sum + (item.kind === 'receipt' ? item.amount : 0),
    0,
  );
  if (linkedTransactions.length > 0 && next.customerId !== previous.customerId)
    return 'سفارش دارای تراکنش مالی را نمی‌توان به مشتری دیگری منتقل کرد.';
  if (receipts > 0 && (next.status === 'cancelled' || next.total < receipts))
    return 'سفارش دارای دریافت وجه را بدون اصلاح مالی نمی‌توان لغو کرد یا مبلغ آن را کمتر از دریافت ثبت‌شده قرار داد.';

  return null;
}
