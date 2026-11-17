import { useMemo } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import {
  getCustomerAccount,
  getOrderAccount,
  paymentStatusLabels,
} from '@/entities/service/model/customer-account';
import { Modal, EmptyState } from '@/shared/ui/primitives';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { money, dateLabel } from '@/shared/lib/format';
import { downloadCsv } from '@/shared/utils/csv';
import { useTranslation } from 'react-i18next'

export function CustomerStatement({
  customerId,
  onClose,
  onReceipt,
}: {
  customerId: string;
  onClose: () => void;
  onReceipt: (jobId: string) => void;
}) {
  const { t } = useTranslation()
  const customers = useDemo((state) => state.customers);
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const customer = customers.find((item) => item.id === customerId);
  const orders = useMemo(
    () => jobs.filter((job) => job.customerId === customerId),
    [jobs, customerId],
  );
  const receipts = useMemo(
    () =>
      transactions.filter(
        (item) => item.kind === 'receipt' && orders.some((job) => job.id === item.jobId),
      ),
    [transactions, orders],
  );
  const account = getCustomerAccount(customerId, jobs, transactions);

  const orderRows = useMemo(
    () =>
      orders.map((job) => {
        const row = getOrderAccount(job, transactions);
        return { job, row };
      }),
    [orders, transactions],
  );
  const orderColumns = useMemo<DataTableColumn<(typeof orderRows)[number]>[]>(
    () => [
      {
        id: 'سفارش',
        header: 'سفارش',
        accessorFn: ({ job }) => job.id,
        cell: ({
          row: {
            original: { job },
          },
        }) => (
          <>
            <bdi>{job.id}</bdi>
            <p>{job.appliance}</p>
          </>
        ),
      },
      {
        id: 'خدمات قطعی',
        header: 'خدمات قطعی',
        accessorFn: ({ row }) => row.charge,
        cell: ({
          row: {
            original: { row },
          },
        }) => money(row.charge),
      },
      {
        id: 'دریافت',
        header: 'دریافت',
        accessorFn: ({ row }) => row.receipts,
        cell: ({
          row: {
            original: { row },
          },
        }) => money(row.receipts),
      },
      {
        id: 'بدهی',
        header: 'بدهی',
        accessorFn: ({ row }) => row.outstanding,
        cell: ({
          row: {
            original: { row },
          },
        }) => money(row.outstanding),
      },
      {
        id: 'وضعیت',
        header: 'وضعیت',
        accessorFn: ({ row }) => paymentStatusLabels[row.status],
        cell: ({
          row: {
            original: { row },
          },
        }) => <Badge variant="secondary">{paymentStatusLabels[row.status]}</Badge>,
      },
      {
        id: 'عملیات',
        header: 'عملیات',
        enableSorting: false,
        cell: ({
          row: {
            original: { job, row },
          },
        }) =>
          job.status !== 'cancelled' && job.total > row.receipts ? (
            <Button size="sm" variant="outline" onClick={() => onReceipt(job.id)}>
              {t('key203', 'ثبت دریافت')}
            </Button>
          ) : (
            '—'
          ),
      },
    ],
    [onReceipt, t],
  );
  const receiptColumns = useMemo<DataTableColumn<(typeof receipts)[number]>[]>(
    () => [
      {
        id: 'تاریخ',
        header: 'تاریخ',
        accessorFn: (item) => item.date,
        cell: ({ row: { original: item } }) => dateLabel(item.date),
      },
      {
        id: 'سفارش',
        header: 'سفارش',
        accessorFn: (item) => item.jobId,
        cell: ({ row: { original: item } }) => <bdi>{item.jobId}</bdi>,
      },
      {
        id: 'شرح',
        header: 'شرح',
        accessorFn: (item) => item.description,
      },
      {
        id: 'مبلغ',
        header: 'مبلغ',
        accessorFn: (item) => item.amount,
        cell: ({ row: { original: item } }) => money(item.amount),
      },
    ],
    [],
  );
  return (
    <Modal title={`صورت‌حساب ${customer?.name ?? ''}`} onClose={onClose}>
      <div className="flex flex-col gap-5 p-6">
        <p className="text-sm">
          {t('key334', 'خدمات قطعی:')} {money(account.charge)} {t('key335', '· دریافت:')} {money(account.receipts)} {t('key336', '· مطالبات:')}{' '}
          {money(account.outstanding)} {t('key337', '· پیش‌دریافت / بستانکاری:')} {money(account.credit)}
        </p>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              [
                ['سفارش', 'تاریخ', 'خدمات قطعی', 'دریافت', t('key338', 'مانده بدهی'), t('key248', 'پیش‌دریافت / بستانکاری')],
                ...orders.map((job) => {
                  const row = getOrderAccount(job, transactions);
                  return [
                    job.id,
                    job.date,
                    String(row.charge),
                    String(row.receipts),
                    String(row.outstanding),
                    String(row.credit),
                  ];
                }),
              ],
              `customer-${customerId}-statement.csv`,
            )
          }
        >
          {t('csv2', 'خروجی صورت‌حساب CSV')}
        </Button>
        <h3 className="font-semibold">{t('key339', 'ریز حساب سفارش‌ها')}</h3>
        <DataTable
          data={orderRows}
          getRowId={({ job }) => String(job.id)}
          columns={orderColumns}
          emptyMessage={null}
        />
        {!orders.length ? <EmptyState text="سفارشی برای این مشتری ثبت نشده است." /> : null}
        <h3 className="font-semibold">{t('key340', 'رسیدهای دریافت وجه')}</h3>
        <DataTable
          data={receipts}
          getRowId={(item) => String(item.id)}
          columns={receiptColumns}
          emptyMessage={null}
        />
        {!receipts.length ? <EmptyState text="دریافتی ثبت نشده است." /> : null}
      </div>
    </Modal>
  );
}
