import { useFinanceTranslation } from './i18n/use-finance-translation';
import { translateLabel } from '@/shared/i18n';
import { useMemo, useState } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import { getOrderAccount, paymentStatusLabels } from '@/entities/service/model/customer-account';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { money, dateLabel } from '@/shared/lib/format';
import { downloadCsv } from '@/shared/utils/csv';
import { TransactionDialog } from './components/transaction-dialog';
import { useTranslation } from 'react-i18next';

export function ReceivablesPage() {
  const t = useFinanceTranslation();
  const { t: tShared } = useTranslation();
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const transactions = useDemo((state) => state.transactions);
  const [query, setQuery] = useState('');
  const [receiptJob, setReceiptJob] = useState('');
  const rows = useMemo(
    () =>
      jobs
        .filter((job) => job.status === 'completed')
        .map((job) => ({
          job,
          customer: customers.find((customer) => customer.id === job.customerId),
          account: getOrderAccount(job, transactions),
        }))
        .filter(
          (row) =>
            row.account.outstanding > 0 &&
            `${row.job.id} ${row.customer?.name ?? ''}`.includes(query.trim()),
        ),
    [jobs, customers, transactions, query, t, tShared],
  );
  const receivableColumns = useMemo<DataTableColumn<(typeof rows)[number]>[]>(
    () => [
      {
        id: 'سفارش',
        header: 'سفارش',
        accessorFn: ({ job }) => job.id,
        cell: ({
          row: {
            original: { job },
          },
        }) => <bdi>{job.id}</bdi>,
      },
      {
        id: 'مشتری',
        header: 'مشتری',
        accessorFn: ({ customer }) => customer?.name,
      },
      {
        id: 'تاریخ خدمت',
        header: t('receivables.serviceDate'),
        accessorFn: ({ job }) => job.date,
        cell: ({
          row: {
            original: { job },
          },
        }) => dateLabel(job.date),
      },
      {
        id: 'مبلغ قطعی',
        header: t('receivables.finalAmount'),
        accessorFn: ({ account }) => account.charge,
        cell: ({
          row: {
            original: { account },
          },
        }) => money(account.charge),
      },
      {
        id: 'دریافت',
        header: 'دریافت',
        accessorFn: ({ account }) => account.receipts,
        cell: ({
          row: {
            original: { account },
          },
        }) => money(account.receipts),
      },
      {
        id: 'مانده',
        header: 'مانده',
        accessorFn: ({ account }) => account.outstanding,
        cell: ({
          row: {
            original: { account },
          },
        }) => money(account.outstanding),
      },
      {
        id: 'وضعیت',
        header: 'وضعیت',
        accessorFn: ({ account }) => translateLabel(paymentStatusLabels[account.status]),
        cell: ({
          row: {
            original: { account },
          },
        }) => (
          <Badge variant="secondary">{translateLabel(paymentStatusLabels[account.status])}</Badge>
        ),
      },
      {
        id: 'عملیات',
        header: 'عملیات',
        enableSorting: false,
        cell: ({
          row: {
            original: { job },
          },
        }) => (
          <Button size="sm" onClick={() => setReceiptJob(job.id)}>
            {t('statement.recordReceipt')}
          </Button>
        ),
      },
    ],
    [setReceiptJob, t, tShared],
  );
  return (
    <>
      <PageHeading
        title={tShared('ui.customerReceivables')}
        description={t('receivables.completedOrdersWhoseFullAmountHasNotYet')}
        action={
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv(
                [
                  ['سفارش', 'مشتری', tShared('ui.serviceAmount'), 'دریافت', 'مانده'],
                  ...rows.map((row) => [
                    row.job.id,
                    row.customer?.name ?? '',
                    String(row.account.charge),
                    String(row.account.receipts),
                    String(row.account.outstanding),
                  ]),
                ],
                'receivables.csv',
              )
            }
          >
            {t('ledger.exportCsv')}
          </Button>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        aria-label={t('receivables.searchReceivables')}
        placeholder={t('receivables.customerNameOrOrderId')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel
        title={t('receivables.ordersWithOutstandingBalances')}
        subtitle={t('receivables.displayedBalanceReduce', {
          reduce: money(rows.reduce((sum, row) => sum + row.account.outstanding, 0)),
        })}
      >
        <DataTable
          data={rows}
          getRowId={({ job }) => String(job.id)}
          columns={receivableColumns}
          emptyMessage={null}
        />
        {!rows.length ? (
          <EmptyState text={t('receivables.noReceivablesMatchTheseFilters')} />
        ) : null}
      </Panel>
      {receiptJob ? (
        <TransactionDialog
          kind="receipt"
          initialJobId={receiptJob}
          onClose={() => setReceiptJob('')}
        />
      ) : null}
    </>
  );
}
