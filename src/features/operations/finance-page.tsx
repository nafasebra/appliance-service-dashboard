import { useState, type FormEvent } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Wallet, HandCoins, Download } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import type { Transaction } from './model/types';
import { PageHeading, Panel, StatCard, Modal, EmptyState } from '@/shared/ui/primitives';
import { money, dateLabel } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const kindLabels = {
  receipt: 'دریافت از مشتری',
  payout: 'پرداخت به تعمیرکار',
  expense: 'هزینه شرکت',
};

export function FinancePage() {
  const { jobs, transactions, addTransaction } = useDemo();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [kind, setKind] = useState<Transaction['kind']>('receipt');
  const [error, setError] = useState('');
  const finance = summarizeFinance(jobs, transactions);
  const filtered = transactions
    .filter((item) => filter === 'all' || item.kind === filter)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    const jobId = kind === 'expense' ? '' : String(form.get('jobId'));
    if (!Number.isSafeInteger(amount) || amount <= 0)
      return setError('مبلغ باید عدد صحیح و بزرگ‌تر از صفر باشد.');
    const job = jobs.find((item) => item.id === jobId);
    if (kind !== 'expense' && !job) return setError('درخواست مرتبط را انتخاب کنید.');
    if (kind === 'payout' && job) {
      const paid = transactions
        .filter((item) => item.kind === 'payout' && item.jobId === jobId)
        .reduce((sum, item) => sum + item.amount, 0);
      if (job.status !== 'completed' || amount > job.total - job.commission - paid)
        return setError('پرداخت باید در محدوده مانده تعمیرکار برای یک خدمت تکمیل‌شده باشد.');
    }
    addTransaction({
      id: crypto.randomUUID(),
      kind,
      jobId,
      amount,
      date: String(form.get('date')),
      description: String(form.get('description')).trim(),
    });
    setOpen(false);
    setError('');
  }
  function exportCsv() {
    // Prefix spreadsheet control characters to prevent CSV formulas in free text.
    const cell = (value: string) =>
      `"${(/^[=+@\-\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
    const rows = [
      ['تاریخ', 'نوع', 'شرح', 'درخواست', 'مبلغ تومان'],
      ...filtered.map((item) => [
        item.date,
        kindLabels[item.kind],
        item.description,
        item.jobId,
        String(item.amount),
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\n')], {
        type: 'text/csv;charset=utf-8;',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <PageHeading
        title="امور مالی"
        description="شفافیت در دریافت‌ها، پرداخت‌ها و سهم شرکت از هر خدمت."
        action={
          <Button
            className="button button-primary"
            onClick={() => {
              setOpen(true);
              setError('');
            }}
          >
            <Plus size={18} />
            ثبت تراکنش
          </Button>
        }
      />
      <div className="stats-grid">
        <StatCard
          title="کل دریافت ثبت‌شده"
          value={money(finance.receipts)}
          detail="وجه دریافت‌شده از مشتریان"
          icon={<ArrowDownLeft size={20} />}
        />
        <StatCard
          title="کل پرداخت و هزینه"
          value={money(finance.payouts + finance.expenses)}
          detail="تسویه تعمیرکار + هزینه شرکت"
          icon={<ArrowUpRight size={20} />}
        />
        <StatCard
          title="خالص گردش نقدی"
          value={money(finance.cashFlow)}
          detail="بدون احتساب مانده ابتدای دوره"
          icon={<Wallet size={20} />}
          accent
        />
        <StatCard
          title="مانده تعمیرکاران"
          value={money(finance.payable)}
          detail="تعهد پرداخت خدمات تکمیل‌شده"
          icon={<HandCoins size={20} />}
        />
      </div>
      <div className="finance-summary">
        <div>
          <span>ارزش خدمات تکمیل‌شده</span>
          <strong>{money(finance.serviceValue)}</strong>
        </div>
        <div>
          <span>کمیسیون این خدمات</span>
          <strong>{money(finance.commission)}</strong>
        </div>
        <p>تومان و مبالغ صرفاً نمونه‌اند. کمیسیون معادل سود خالص یا موجودی حساب بانکی نیست.</p>
      </div>
      <Panel
        title="دفتر گردش مالی"
        subtitle="همه تراکنش‌های نمونه · بدون مانده افتتاحیه"
        action={
          <Button variant="outline" size="sm" className="button button-small" onClick={exportCsv}>
            <Download size={16} />
            خروجی CSV
          </Button>
        }
      >
        <div className="table-toolbar">
          <div className="segmented">
            {[
              ['all', 'همه'],
              ['receipt', 'دریافت‌ها'],
              ['payout', 'تسویه‌ها'],
              ['expense', 'هزینه‌ها'],
            ].map(([value, label]) => (
              <Button
                variant="ghost"
                size="sm"
                className={filter === value ? 'selected' : ''}
                key={value}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <Table className="table-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>شرح تراکنش</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>درخواست مرتبط</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>مبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <strong>{item.description}</strong>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`badge ${item.kind === 'receipt' ? 'status-completed' : 'status-scheduled'}`}
                    >
                      {kindLabels[item.kind]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <bdi>{item.jobId || '—'}</bdi>
                  </TableCell>
                  <TableCell>{dateLabel(item.date)}</TableCell>
                  <TableCell className={item.kind === 'receipt' ? 'text-green' : 'text-red'}>
                    {item.kind === 'receipt' ? '+' : '−'} {money(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState />
        )}
      </Panel>
      {open && (
        <Modal title="ثبت تراکنش نمونه" onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="form-grid">
            <Label className="form-field">
              نوع تراکنش
              <NativeSelect
                value={kind}
                onChange={(event) => setKind(event.target.value as Transaction['kind'])}
              >
                {Object.entries(kindLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            </Label>
            <Label className="form-field">
              مبلغ (تومان نمونه)
              <Input name="amount" type="number" min="1" step="1" required />
            </Label>
            {kind !== 'expense' && (
              <Label className="form-field full-width">
                درخواست مرتبط
                <NativeSelect name="jobId" required>
                  <option value="">انتخاب درخواست</option>
                  {jobs
                    .filter((job) => kind !== 'payout' || job.status === 'completed')
                    .map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.id} · {job.appliance} {job.brand}
                      </option>
                    ))}
                </NativeSelect>
              </Label>
            )}
            <Label className="form-field">
              تاریخ (میلادی)
              <Input type="date" name="date" defaultValue="2026-11-16" required />
            </Label>
            <Label className="form-field">
              شرح
              <Input name="description" required maxLength={150} />
            </Label>
            <p className="form-note full-width">
              این عملیات فقط دفتر نمونه مرورگر را تغییر می‌دهد و پرداخت بانکی انجام نمی‌دهد.
            </p>
            {error && (
              <p className="form-error full-width" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions full-width">
              <Button className="button button-primary" type="submit">
                ثبت تراکنش
              </Button>
              <Button
                variant="outline"
                className="button"
                type="button"
                onClick={() => setOpen(false)}
              >
                انصراف
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
