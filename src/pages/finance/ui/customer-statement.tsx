import {
  JobStatus,
  useDemo,
  getCustomerAccount,
  getOrderAccount,
  paymentStatusLabels,
} from '@/entities/service';
import { useFinancePageTranslation } from '../hooks/use-finance-page-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { useMemo } from 'react';

import { Modal, EmptyState } from '@/shared/ui/primitives';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { money, dateLabel, downloadCsv } from '@/shared/lib';

export function CustomerStatement({
  customerId,
  onClose,
  onReceipt,
}: {
  customerId: string;
  onClose: () => void;
  onReceipt: (jobId: string) => void;
}) {
  const t = useFinancePageTranslation();
  const customers = useDemo((state) => state.customers);
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const customer = customers.find((item) => item.id === customerId);
  const orders = useMemo(
    () => jobs.filter((job) => job.customerId === customerId),
    [jobs, customerId, t],
  );
  const receipts = useMemo(
    () =>
      transactions.filter(
        (item) => item.kind === 'receipt' && orders.some((job) => job.id === item.jobId),
      ),
    [transactions, orders, t],
  );
  const account = getCustomerAccount(customerId, jobs, transactions);

  const orderRows = useMemo(
    () =>
      orders.map((job) => {
        const row = getOrderAccount(job, transactions);
        return { job, row };
      }),
    [orders, transactions, t],
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
            <p>{translateLabel(job.appliance)}</p>
          </>
        ),
      },
      {
        id: 'خدمات قطعی',
        header: t('statement.finalizedServices'),
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
        header: t('statement.outstandingBalance'),
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
        accessorFn: ({ row }) => translateLabel(paymentStatusLabels[row.status]),
        cell: ({
          row: {
            original: { row },
          },
        }) => <Badge variant="secondary">{translateLabel(paymentStatusLabels[row.status])}</Badge>,
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
          job.status !== JobStatus.Cancelled && job.total > row.receipts ? (
            <Button size="sm" variant="outline" onClick={() => onReceipt(job.id)}>
              {t('statement.recordReceipt')}
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
    [t],
  );
  return (
    <Modal title={t('statement.statement', { name: customer?.name ?? '' })} onClose={onClose}>
      <div className="flex flex-col gap-5 p-6">
        <p className="text-body">
          {t('statement.summary', {
            charge: money(account.charge),
            receipts: money(account.receipts),
            outstanding: money(account.outstanding),
            credit: money(account.credit),
          })}
        </p>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              [
                [
                  'سفارش',
                  'تاریخ',
                  'خدمات قطعی',
                  'دریافت',
                  t('statement.outstandingDebt'),
                  t('statement.advanceCredit'),
                ],
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
          {t('statement.exportStatementCsv')}
        </Button>
        <h3 className="font-semibold">{t('statement.orderAccountDetails')}</h3>
        <DataTable
          data={orderRows}
          getRowId={({ job }) => String(job.id)}
          columns={orderColumns}
          emptyMessage={null}
        />
        {!orders.length ? (
          <EmptyState text={t('statement.noOrdersRecordedForThisCustomer')} />
        ) : null}
        <h3 className="font-semibold">{t('statement.customerReceiptHistory')}</h3>
        <DataTable
          data={receipts}
          getRowId={(item) => String(item.id)}
          columns={receiptColumns}
          emptyMessage={null}
        />
        {!receipts.length ? <EmptyState text={t('statement.noReceiptsRecorded')} /> : null}
      </div>
    </Modal>
  );
}
