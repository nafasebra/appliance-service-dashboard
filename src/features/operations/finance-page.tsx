import { cn } from '@/shared/lib/utils';
import { useState, type FormEvent } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Wallet, HandCoins, Download } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import type { Transaction } from './model/types';
import { PageHeading, Panel, StatCard, Modal, EmptyState } from '@/shared/ui/primitives';
import { money, dateLabel } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { NativeSelect } from '@/shared/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

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
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-primary text-white border-primary shadow-[0_3px_5px_#246b5510] [&:hover]:bg-(--primary-dark) dark:bg-[#3d8c6d] dark:border-[#3d8c6d] dark:text-[#ffffff] dark:[&:hover]:bg-[#4c9d7d]"
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
      <div
        className="grid grid-cols-4 gap-[17px] mb-[23px] max-[981px]:grid-cols-2 max-[761px]:gap-[11px] max-[401px]:gap-2"
      >
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
      <div
        className="flex items-center gap-[30px] p-5.5 bg-[#eef3e7] border border-[#e0e8d6] rounded-[10px] mb-5.5 [&_>_div]:shrink-0 [&_span]:block [&_span]:text-[#8a977e] [&_span]:text-[10px] [&_strong]:block [&_strong]:mt-[11px] [&_strong]:text-[#5b734a] [&_strong]:text-[16px] [&_p]:text-[10px] [&_p]:text-[#8e9c80] [&_p]:leading-[2] [&_p]:border-s [&_p]:border-s-[#d7e2cb] [&_p]:ps-[25px] max-[981px]:flex-wrap max-[981px]:gap-5 max-[981px]:[&_p]:border-0 max-[981px]:[&_p]:p-0 max-[761px]:[&_strong]:text-[14px] dark:[&_strong]:text-[#b8d8c7] dark:[&_p]:text-[#98aaa0] dark:[&_span]:text-[#98aaa0] dark:bg-[#1d2d25] dark:border-[#2c4136]"
      >
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
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] text-[10px] p-[6px_10px]"
            onClick={exportCsv}
          >
            <Download size={16} />
            خروجی CSV
          </Button>
        }
      >
        <div className="flex items-center gap-3 p-[0_22px_20px] flex-wrap max-[761px]:px-4.5">
          <div
            className="flex bg-[#f4f7ef] p-1 rounded-[7px] gap-[3px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[10px] [&_button]:p-[8px_14px] [&_button]:rounded-[5px] [&_button]:text-[#9aa68e] [&_.selected]:bg-white [&_.selected]:shadow-[0_1px_3px_#3545270f] [&_.selected]:text-[#627b50] max-[401px]:[&_button]:px-2.5 dark:[&_.selected]:bg-[#1c2823] dark:[&_.selected]:border-[#33453d] dark:[&_.selected]:text-[#dce7e1] dark:bg-[#202e28] dark:border-[#31433a] dark:text-[#8eb19d]"
          >
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
                  'rounded-md text-[10px] text-muted-foreground',
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
                        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] whitespace-nowrap',
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
            className="grid grid-cols-2 gap-4.5 p-[23px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[9px] [&_label]:text-[11px] [&_input]:border [&_input]:border-[#dce5d6] [&_input]:rounded-[7px] [&_input]:p-2.5 [&_input]:text-[12px] [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-[#dce5d6] [&_select]:rounded-[7px] [&_select]:p-2.5 [&_select]:text-[12px] [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-[#dce5d6] [&_textarea]:rounded-[7px] [&_textarea]:p-2.5 [&_textarea]:text-[12px] [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-[78px] [&_textarea]:resize-y max-[761px]:gap-3.5 max-[761px]:p-4.5 max-[401px]:grid-cols-1 dark:[&_input]:bg-[#1c2823] dark:[&_input]:border-[#33453d] dark:[&_input]:text-[#dce7e1] dark:[&_select]:bg-[#1c2823] dark:[&_select]:border-[#33453d] dark:[&_select]:text-[#dce7e1] dark:[&_textarea]:bg-[#1c2823] dark:[&_textarea]:border-[#33453d] dark:[&_textarea]:text-[#dce7e1]"
          >
            <Label className="flex flex-col gap-2 text-[11px]">
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
            <Label className="flex flex-col gap-2 text-[11px]">
              مبلغ (تومان نمونه)
              <Input name="amount" type="number" min="1" step="1" required />
            </Label>
            {kind !== 'expense' && (
              <Label className="col-span-full flex flex-col gap-2 text-[11px]">
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
            <Label className="flex flex-col gap-2 text-[11px]">
              تاریخ (میلادی)
              <Input type="date" name="date" defaultValue="2026-11-16" required />
            </Label>
            <Label className="flex flex-col gap-2 text-[11px]">
              شرح
              <Input name="description" required maxLength={150} />
            </Label>
            <p className="text-[10px] text-[#919d89] leading-[2] col-span-full">
              این عملیات فقط دفتر نمونه مرورگر را تغییر می‌دهد و پرداخت بانکی انجام نمی‌دهد.
            </p>
            {error && (
              <p
                className="bg-[#fff0ee] text-[#aa5445] p-2.5 rounded-[7px] text-[11px] leading-[1.9] dark:bg-[#412929] dark:text-[#e2a5a5] col-span-full"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="flex gap-[9px] mt-[5px] col-span-full">
              <Button
                className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-primary text-white border-primary shadow-[0_3px_5px_#246b5510] [&:hover]:bg-(--primary-dark) dark:bg-[#3d8c6d] dark:border-[#3d8c6d] dark:text-[#ffffff] dark:[&:hover]:bg-[#4c9d7d]"
                type="submit"
              >
                ثبت تراکنش
              </Button>
              <Button
                variant="outline"
                className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1]"
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
