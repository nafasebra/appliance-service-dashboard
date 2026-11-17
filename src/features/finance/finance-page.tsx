import { cn } from '@/shared/lib/utils';
import { downloadTransactionsCsv } from './utils/transaction-csv';
import { useState, type FormEvent } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Wallet, HandCoins, Download } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
import { summarizeFinance } from '@/entities/service/model/finance';
import type { Transaction } from '@/entities/service/model/types';
import { PageHeading, Panel, StatCard, Modal, EmptyState } from '@/shared/ui/primitives';
import { money, dateLabel } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { toIsoDate } from '@/shared/lib/date';

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
  const [transactionDate, setTransactionDate] = useState(() => toIsoDate(new Date()));
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
    const failure = addTransaction({
      id: crypto.randomUUID(),
      kind,
      jobId,
      amount,
      date: String(form.get('date')),
      description: String(form.get('description')).trim(),
    });
    if (failure) return setError(failure);
    setOpen(false);
    setError('');
  }
  function exportCsv() {
    downloadTransactionsCsv(filtered, kindLabels);
  }
  return (
    <>
      <PageHeading
        title="دفتر گردش مالی"
        description="شفافیت در دریافت‌ها، پرداخت‌ها و سهم شرکت از هر خدمت."
        action={
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:border-border dark:text-primary-foreground dark:[&:hover]:bg-primary"
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
      <div className="grid grid-cols-4 gap-4.25 mb-5.75 max-tablet:grid-cols-2 max-mobile:gap-2.75 max-compact:gap-2">
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
      <div className="flex items-center gap-7.5 p-5.5 bg-accent border border-border rounded-lg mb-5.5 [&_>_div]:shrink-0 [&_span]:block [&_span]:text-muted-foreground [&_span]:text-2xs [&_strong]:block [&_strong]:mt-2.75 [&_strong]:text-primary [&_strong]:text-base [&_p]:text-2xs [&_p]:text-muted-foreground [&_p]:leading-loose [&_p]:border-s [&_p]:border-s-border [&_p]:ps-6.25 max-tablet:flex-wrap max-tablet:gap-5 max-tablet:[&_p]:border-0 max-tablet:[&_p]:p-0 max-mobile:[&_strong]:text-sm dark:[&_strong]:text-primary dark:[&_p]:text-muted-foreground dark:[&_span]:text-muted-foreground dark:bg-accent dark:border-border">
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
          <Button
            variant="outline"
            size="sm"
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground text-2xs py-1.5 px-2.5"
            onClick={exportCsv}
          >
            <Download size={16} />
            خروجی CSV
          </Button>
        }
      >
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <div className="flex bg-muted p-1 rounded-md gap-0.75 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-2xs [&_button]:py-2 [&_button]:px-3.5 [&_button]:rounded-md [&_button]:text-muted-foreground [&_.selected]:bg-white [&_.selected]:shadow-xs [&_.selected]:text-primary max-compact:[&_button]:px-2.5 dark:[&_.selected]:bg-muted dark:[&_.selected]:border-border dark:[&_.selected]:text-primary-foreground dark:bg-muted dark:border-border dark:text-muted-foreground">
            {[
              ['all', 'همه'],
              ['receipt', 'دریافت‌ها'],
              ['payout', 'تسویه‌ها'],
              ['expense', 'هزینه‌ها'],
            ].map(([value, label]) => (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-md text-2xs text-muted-foreground',
                  filter === value && 'bg-card text-primary shadow-xs',
                )}
                key={value}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <Table className="overflow-auto">
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
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
                        item.kind === 'receipt'
                          ? 'bg-status-completed text-status-completed-foreground'
                          : 'bg-status-scheduled text-status-scheduled-foreground',
                      )}
                    >
                      {kindLabels[item.kind]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <bdi>{item.jobId || '—'}</bdi>
                  </TableCell>
                  <TableCell>{dateLabel(item.date)}</TableCell>
                  <TableCell
                    className={cn(
                      'whitespace-nowrap',
                      item.kind === 'receipt' ? 'text-primary' : 'text-destructive',
                    )}
                  >
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
          <form
            onSubmit={submit}
            className="grid grid-cols-2 gap-4.5 p-5.75 [&_label]:flex [&_label]:flex-col [&_label]:gap-2.25 [&_label]:text-ui [&_input]:border [&_input]:border-border [&_input]:rounded-md [&_input]:p-2.5 [&_input]:text-xs [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-border [&_select]:rounded-md [&_select]:p-2.5 [&_select]:text-xs [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-md [&_textarea]:p-2.5 [&_textarea]:text-xs [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-19.5 [&_textarea]:resize-y max-mobile:gap-3.5 max-mobile:p-4.5 max-compact:grid-cols-1 dark:[&_input]:bg-muted dark:[&_input]:border-border dark:[&_input]:text-primary-foreground dark:[&_select]:bg-muted dark:[&_select]:border-border dark:[&_select]:text-primary-foreground dark:[&_textarea]:bg-muted dark:[&_textarea]:border-border dark:[&_textarea]:text-primary-foreground"
          >
            <Label className="flex flex-col gap-2 text-ui">
              نوع تراکنش
              <Select
                dir="rtl"
                value={kind}
                onValueChange={(value) => setKind(value as Transaction['kind'])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(kindLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
            <Label className="flex flex-col gap-2 text-ui">
              مبلغ (تومان نمونه)
              <Input name="amount" type="number" min="1" step="1" required />
            </Label>
            {kind !== 'expense' && (
              <Label className="col-span-full flex flex-col gap-2 text-ui">
                درخواست مرتبط
                <Select dir="rtl" name="jobId" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب درخواست" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobs
                        .filter((job) => kind !== 'payout' || job.status === 'completed')
                        .map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.id} · {job.appliance} {job.brand}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
            )}
            <Label className="flex flex-col gap-2 text-ui">
              تاریخ (جلالی)
              <JalaliDatePicker
                name="date"
                value={transactionDate}
                onValueChange={setTransactionDate}
                aria-label="تاریخ تراکنش"
                required
              />
            </Label>
            <Label className="flex flex-col gap-2 text-ui">
              شرح
              <Input name="description" required maxLength={150} />
            </Label>
            <p className="text-2xs text-muted-foreground leading-loose col-span-full">
              این عملیات فقط دفتر نمونه مرورگر را تغییر می‌دهد و پرداخت بانکی انجام نمی‌دهد.
            </p>
            {error && (
              <p
                className="bg-status-cancelled text-destructive p-2.5 rounded-md text-ui leading-loose dark:bg-status-cancelled dark:text-destructive col-span-full"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="flex gap-2.25 mt-1.25 col-span-full">
              <Button
                className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:border-border dark:text-primary-foreground dark:[&:hover]:bg-primary"
                type="submit"
              >
                ثبت تراکنش
              </Button>
              <Button
                variant="outline"
                className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground"
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
