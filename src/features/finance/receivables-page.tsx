import { useState } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import { getOrderAccount, paymentStatusLabels } from '@/entities/service/model/customer-account';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { money, dateLabel } from '@/shared/lib/format';
import { downloadCsv } from '@/shared/utils/csv';
import { TransactionDialog } from './components/transaction-dialog';

export function ReceivablesPage() {
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const transactions = useDemo((state) => state.transactions);
  const [query, setQuery] = useState('');
  const [receiptJob, setReceiptJob] = useState('');
  const rows = jobs
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
    );
  return (
    <>
      <PageHeading
        title="مطالبات مشتریان"
        description="سفارش‌های تکمیل‌شده‌ای که هنوز تمام مبلغ آن‌ها دریافت نشده است."
        action={
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv(
                [
                  ['سفارش', 'مشتری', 'مبلغ خدمت', 'دریافت', 'مانده'],
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
            خروجی CSV
          </Button>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        aria-label="جستجوی مطالبات"
        placeholder="نام مشتری یا شماره سفارش…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel
        title="سفارش‌های دارای مانده"
        subtitle={`مانده نمایش‌داده‌شده: ${money(rows.reduce((sum, row) => sum + row.account.outstanding, 0))}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {[
                'سفارش',
                'مشتری',
                'تاریخ خدمت',
                'مبلغ قطعی',
                'دریافت',
                'مانده',
                'وضعیت',
                'عملیات',
              ].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ job, customer, account }) => (
              <TableRow key={job.id}>
                <TableCell>
                  <bdi>{job.id}</bdi>
                </TableCell>
                <TableCell>{customer?.name}</TableCell>
                <TableCell>{dateLabel(job.date)}</TableCell>
                <TableCell>{money(account.charge)}</TableCell>
                <TableCell>{money(account.receipts)}</TableCell>
                <TableCell>{money(account.outstanding)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{paymentStatusLabels[account.status]}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => setReceiptJob(job.id)}>
                    ثبت دریافت
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!rows.length ? <EmptyState text="مطالبه‌ای با این شرایط وجود ندارد." /> : null}
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
