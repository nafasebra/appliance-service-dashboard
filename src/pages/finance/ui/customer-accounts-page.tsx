import { useFinancePageTranslation } from '../hooks/use-finance-page-translation';
import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { useDemo, getCustomerAccount } from '@/entities/service';

import { PageHeading, Panel, EmptyState, StatCard } from '@/shared/ui/primitives';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { localizeDigits, money } from '@/shared/lib';
import { translateLabel } from '../../../shared/i18n/index';
import { CustomerStatement } from './customer-statement';
import { TransactionDialog } from '@/features/finance';

export function CustomerAccountsPage() {
  const t = useFinancePageTranslation();

  const customers = useDemo((state) => state.customers);
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState('');
  const [receiptJob, setReceiptJob] = useState('');
  const accounts = useMemo(
    () =>
      customers.map((customer) => ({
        customer,
        ...getCustomerAccount(customer.id, jobs, transactions),
      })),
    [customers, jobs, transactions, t],
  );
  const filtered = useMemo(
    () =>
      accounts.filter(
        (row) =>
          `${translateLabel(row.customer.name)} ${localizeDigits(row.customer.phone)}`.includes(
            query.trim(),
          ) &&
          (status === 'all' ||
            (status === 'debtor'
              ? row.outstanding > 0
              : status === 'credit'
                ? row.credit > 0
                : row.outstanding === 0 && row.credit === 0)),
      ),
    [accounts, query, status, t],
  );
  const accountColumns = useMemo<DataTableColumn<(typeof filtered)[number]>[]>(
    () => [
      {
        id: 'مشتری',
        header: 'مشتری',
        accessorFn: (row) => translateLabel(row.customer.name),
        cell: ({ row: { original: row } }) => translateLabel(row.customer.name),
      },
      {
        id: 'تلفن',
        header: 'تلفن',
        accessorFn: (row) => row.customer.phone,
        cell: ({ row: { original: row } }) => <bdi>{localizeDigits(row.customer.phone)}</bdi>,
      },
      {
        id: 'خدمات قطعی',
        header: t('statement.finalizedServices'),
        accessorFn: (row) => row.charge,
        cell: ({ row: { original: row } }) => money(row.charge),
      },
      {
        id: 'کل دریافت',
        header: t('accounts.totalReceived'),
        accessorFn: (row) => row.receipts,
        cell: ({ row: { original: row } }) => money(row.receipts),
      },
      {
        id: 'بدهی',
        header: t('statement.outstandingBalance'),
        accessorFn: (row) => row.outstanding,
        cell: ({ row: { original: row } }) => money(row.outstanding),
      },
      {
        id: 'بستانکاری',
        header: t('accounts.credit'),
        accessorFn: (row) => row.credit,
        cell: ({ row: { original: row } }) => money(row.credit),
      },
      {
        id: 'صورت‌حساب',
        header: t('accounts.statement'),
        enableSorting: false,
        cell: ({ row: { original: row } }) => (
          <Button variant="outline" size="sm" onClick={() => setSelected(row.customer.id)}>
            {t('accounts.viewStatement')}
          </Button>
        ),
      },
    ],
    [setSelected, t],
  );
  return (
    <>
      <PageHeading
        title={t('navigation.customerAccounts')}
        description={t('accounts.detailedStatementsReceiptsAndBalancesForEachCustomer')}
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard
          title={t('statement.finalizedServices')}
          value={money(accounts.reduce((sum, row) => sum + row.charge, 0))}
          detail={t('accounts.totalCompletedOrders')}
          icon={<Wallet />}
        />
        <StatCard
          title={t('navigation.customerReceivables')}
          value={money(accounts.reduce((sum, row) => sum + row.outstanding, 0))}
          detail={t('accounts.outstandingBalanceByOrder')}
          icon={<Wallet />}
        />
        <StatCard
          title={t('statement.advanceCredit')}
          value={money(accounts.reduce((sum, row) => sum + row.credit, 0))}
          detail={t('accounts.receiptsExceedingEachOrderSFinalizedServiceAmount')}
          icon={<Wallet />}
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          aria-label={t('accounts.searchCustomerAccounts')}
          className="max-w-sm"
          placeholder={t('accounts.customerNameOrPhone')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label={t('accounts.accountStatus')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('accounts.allAccounts')}</SelectItem>
              <SelectItem value="debtor">{t('accounts.outstandingBalance')}</SelectItem>
              <SelectItem value="credit">{t('accounts.advanceCreditBalance')}</SelectItem>
              <SelectItem value="clear">{t('accounts.noOutstandingBalance')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel title={t('accounts.customerAccountLedger')}>
        <DataTable
          data={filtered}
          getRowId={(row) => String(row.customer.id)}
          columns={accountColumns}
          emptyMessage={null}
        />
        {!filtered.length ? <EmptyState /> : null}
      </Panel>
      {selected ? (
        <CustomerStatement
          customerId={selected}
          onClose={() => setSelected('')}
          onReceipt={(jobId) => {
            setSelected('');
            setReceiptJob(jobId);
          }}
        />
      ) : null}
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
