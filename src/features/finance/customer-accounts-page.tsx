import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { money } from '@/shared/lib/format';
import { CustomerStatement } from './components/customer-statement';
import { TransactionDialog } from './components/transaction-dialog';

export function CustomerAccountsPage() {
  const { customers, jobs, transactions } = useDemo();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState('');
  const [receiptJob, setReceiptJob] = useState('');
  const accounts = customers.map((customer) => ({
    customer,
    ...getCustomerAccount(customer.id, jobs, transactions),
  }));
  const filtered = accounts.filter(
    (row) =>
      `${row.customer.name} ${row.customer.phone}`.includes(query.trim()) &&
      (status === 'all' ||
        (status === 'debtor'
          ? row.outstanding > 0
          : status === 'credit'
            ? row.credit > 0
            : row.outstanding === 0 && row.credit === 0)),
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
        <Table>
          <TableHeader>
            <TableRow>
              {['مشتری', 'تلفن', 'خدمات قطعی', 'کل دریافت', 'بدهی', 'بستانکاری', 'صورت‌حساب'].map(
                (label) => (
                  <TableHead key={label}>{label}</TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.customer.id}>
                <TableCell>{row.customer.name}</TableCell>
                <TableCell>
                  <bdi>{row.customer.phone}</bdi>
                </TableCell>
                <TableCell>{money(row.charge)}</TableCell>
                <TableCell>{money(row.receipts)}</TableCell>
                <TableCell>{money(row.outstanding)}</TableCell>
                <TableCell>{money(row.credit)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelected(row.customer.id)}>
                    مشاهده ریز حساب
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
