import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import { paymentMethodLabels } from '@/entities/service/model/customer-account';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { money, dateLabel } from '@/shared/lib/format';
import { downloadCsv } from '@/shared/utils/csv';
import { TransactionDialog } from './components/transaction-dialog';

export function TransactionRegisterPage({ kind }: { kind: 'receipt' | 'expense' }) {
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const transactions = useDemo((state) => state.transactions);
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(false);
  const invalidRange = Boolean(from && to && from > to);
  const rows = useMemo(
    () =>
      transactions
        .filter((item) => item.kind === kind)
        .map((item) => {
          const job = jobs.find((job) => job.id === item.jobId);
          return { item, customer: customers.find((customer) => customer.id === job?.customerId) };
        })
        .filter(
          ({ item, customer }) =>
            !invalidRange &&
            (!from || item.date >= from) &&
            (!to || item.date <= to) &&
            `${item.description} ${item.reference ?? ''} ${item.jobId} ${customer?.name ?? ''}`.includes(
              query.trim(),
            ),
        )
        .sort((a, b) => b.item.date.localeCompare(a.item.date)),
    [transactions, kind, jobs, customers, invalidRange, from, to, query],
  );
  const transactionColumns = useMemo<DataTableColumn<(typeof rows)[number]>[]>(
    () => [
      {
        id: 'تاریخ',
        header: 'تاریخ',
        accessorFn: ({ item }) => item.date,
        cell: ({
          row: {
            original: { item },
          },
        }) => dateLabel(item.date),
      },
      ...(kind === 'receipt'
        ? [
            {
              id: 'مشتری / سفارش',
              header: 'مشتری / سفارش',
              accessorFn: ({ customer }: (typeof rows)[number]) => customer?.name,
              cell: ({
                row: {
                  original: { item, customer },
                },
              }: {
                row: { original: (typeof rows)[number] };
              }) => (
                <>
                  {customer?.name}
                  <div>
                    <bdi>{item.jobId}</bdi>
                  </div>
                </>
              ),
            },
          ]
        : []),
      {
        id: 'شرح',
        header: 'شرح',
        accessorFn: ({ item }) => item.description,
      },
      {
        id: 'روش',
        header: 'روش',
        accessorFn: ({ item }) => (item.method ? paymentMethodLabels[item.method] : 'ثبت قدیمی'),
      },
      {
        id: 'شماره سند',
        header: 'شماره سند',
        accessorFn: ({ item }) => item.reference || '—',
        cell: ({
          row: {
            original: { item },
          },
        }) => <bdi>{item.reference || '—'}</bdi>,
      },
      {
        id: 'مبلغ',
        header: 'مبلغ',
        accessorFn: ({ item }) => item.amount,
        cell: ({
          row: {
            original: { item },
          },
        }) => money(item.amount),
      },
    ],
    [kind],
  );
  const title = kind === 'receipt' ? 'دریافت‌های مشتریان' : 'هزینه‌های شرکت';
  return (
    <>
      <PageHeading
        title={title}
        description={
          kind === 'receipt'
            ? 'ثبت دریافت کامل یا جزئی و پیگیری شماره سند و روش پرداخت.'
            : 'ثبت مخارج عملیاتی شرکت و پیگیری اسناد پرداخت.'
        }
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus />
            {kind === 'receipt' ? 'ثبت دریافت' : 'ثبت هزینه'}
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-query">جستجو</Label>
          <Input
            id="register-query"
            placeholder="شرح، شماره سند یا مشتری…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>از تاریخ</Label>
          <JalaliDatePicker value={from} onValueChange={setFrom} aria-label="از تاریخ" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>تا تاریخ</Label>
          <JalaliDatePicker value={to} onValueChange={setTo} aria-label="تا تاریخ" />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setQuery('');
            setFrom('');
            setTo('');
          }}
        >
          پاک‌کردن فیلترها
        </Button>
      </div>
      {invalidRange ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>تاریخ پایان نباید قبل از تاریخ شروع باشد.</AlertDescription>
        </Alert>
      ) : null}
      <Panel
        title={title}
        subtitle={`مجموع نمایش‌داده‌شده: ${money(rows.reduce((sum, row) => sum + row.item.amount, 0))}`}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadCsv(
                [
                  ['تاریخ', 'مشتری', 'سفارش', 'شرح', 'روش', 'شماره سند', 'مبلغ تومان'],
                  ...rows.map(({ item, customer }) => [
                    item.date,
                    customer?.name ?? '',
                    item.jobId,
                    item.description,
                    item.method ? paymentMethodLabels[item.method] : '',
                    item.reference ?? '',
                    String(item.amount),
                  ]),
                ],
                `${kind}-register.csv`,
              )
            }
          >
            خروجی CSV
          </Button>
        }
      >
        <DataTable
          data={rows}
          getRowId={({ item }) => String(item.id)}
          columns={transactionColumns}
          emptyMessage={null}
        />
        {!rows.length ? <EmptyState text="تراکنشی با این شرایط ثبت نشده است." /> : null}
      </Panel>
      {open ? <TransactionDialog kind={kind} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
