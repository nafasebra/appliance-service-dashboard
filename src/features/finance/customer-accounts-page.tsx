import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/shared/ui/data-table-features';
import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import { getCustomerAccount } from '@/entities/service/model/customer-account';
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
import { DataTable } from '@/shared/ui/data-table';
import { money } from '@/shared/lib/format';
import { CustomerStatement } from './components/customer-statement';
import { TransactionDialog } from './components/transaction-dialog';

export function CustomerAccountsPage() {
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
    [customers, jobs, transactions],
  );
  const filtered = useMemo(
    () =>
      accounts.filter(
        (row) =>
          `${row.customer.name} ${row.customer.phone}`.includes(query.trim()) &&
          (status === 'all' ||
            (status === 'debtor'
              ? row.outstanding > 0
              : status === 'credit'
                ? row.credit > 0
                : row.outstanding === 0 && row.credit === 0)),
      ),
    [accounts, query, status],
  );
  const accountColumns = useMemo<ColumnDef<DataTableFeatures, (typeof filtered)[number]>[]>(
    () => [
      {
        id: 'مشتری',
        header: 'مشتری',
        accessorFn: (row) => row.customer.name,
        cell: ({ row: { original: row } }) => row.customer.name,
      },
      {
        id: 'تلفن',
        header: 'تلفن',
        accessorFn: (row) => row.customer.phone,
        cell: ({ row: { original: row } }) => <bdi>{row.customer.phone}</bdi>,
      },
      {
        id: 'خدمات قطعی',
        header: 'خدمات قطعی',
        accessorFn: (row) => row.charge,
        cell: ({ row: { original: row } }) => money(row.charge),
      },
      {
        id: 'کل دریافت',
        header: 'کل دریافت',
        accessorFn: (row) => row.receipts,
        cell: ({ row: { original: row } }) => money(row.receipts),
      },
      {
        id: 'بدهی',
        header: 'بدهی',
        accessorFn: (row) => row.outstanding,
        cell: ({ row: { original: row } }) => money(row.outstanding),
      },
      {
        id: 'بستانکاری',
        header: 'بستانکاری',
        accessorFn: (row) => row.credit,
        cell: ({ row: { original: row } }) => money(row.credit),
      },
      {
        id: 'صورت‌حساب',
        header: 'صورت‌حساب',
        enableSorting: false,
        cell: ({ row: { original: row } }) => (
          <Button variant="outline" size="sm" onClick={() => setSelected(row.customer.id)}>
            مشاهده ریز حساب
          </Button>
        ),
      },
    ],
    [setSelected],
  );
  return (
    <>
      <PageHeading
        title="حساب مشتریان"
        description="صورت‌حساب تفصیلی مشتری، دریافت‌ها و مانده هر سفارش؛ مطالبات فقط از خدمات تکمیل‌شده محاسبه می‌شوند."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard
          title="خدمات قطعی"
          value={money(accounts.reduce((sum, row) => sum + row.charge, 0))}
          detail="مجموع سفارش‌های تکمیل‌شده"
          icon={<Wallet />}
        />
        <StatCard
          title="مطالبات مشتریان"
          value={money(accounts.reduce((sum, row) => sum + row.outstanding, 0))}
          detail="مانده بدهی به تفکیک سفارش"
          icon={<Wallet />}
        />
        <StatCard
          title="پیش‌دریافت / بستانکاری"
          value={money(accounts.reduce((sum, row) => sum + row.credit, 0))}
          detail="دریافت مازاد بر خدمات قطعی هر سفارش"
          icon={<Wallet />}
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          aria-label="جستجوی حساب مشتری"
          className="max-w-sm"
          placeholder="نام یا تلفن مشتری…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select dir="rtl" value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="وضعیت حساب">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه حساب‌ها</SelectItem>
              <SelectItem value="debtor">دارای بدهی</SelectItem>
              <SelectItem value="credit">دارای پیش‌دریافت / بستانکاری</SelectItem>
              <SelectItem value="clear">بدون مانده</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel title="دفتر حساب مشتریان">
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
