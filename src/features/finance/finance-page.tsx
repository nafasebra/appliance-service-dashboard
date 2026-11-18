import { useFinanceTranslation } from './i18n/use-finance-translation';
import { translateLabel } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';
import { downloadTransactionsCsv } from './utils/transaction-csv';
import { useMemo, useState, type FormEvent } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Wallet, HandCoins, Download } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
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
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { toIsoDate } from '@/shared/lib/date';
import { useTranslation } from 'react-i18next';

const kindLabels = {
  receipt: 'دریافت از مشتری',
  payout: 'پرداخت به تعمیرکار',
  expense: 'هزینه شرکت',
};

export function FinancePage() {
  const t = useFinanceTranslation();
  const { t: tShared } = useTranslation();
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const addTransaction = useDemo((state) => state.addTransaction);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [kind, setKind] = useState<Transaction['kind']>('receipt');
  const [transactionDate, setTransactionDate] = useState(() => toIsoDate(new Date()));
  const [error, setError] = useState('');
  const finance = summarizeFinance(jobs, transactions);
  const filtered = useMemo(
    () =>
      transactions
        .filter((item) => filter === 'all' || item.kind === filter)
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, filter, t, tShared],
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    const jobId = kind === 'expense' ? '' : String(form.get('jobId'));
    if (!Number.isSafeInteger(amount) || amount <= 0)
      return setError('finance:ledger.amountMustBeAWholeNumberGreaterThan');
    const job = jobs.find((item) => item.id === jobId);
    if (kind !== 'expense' && !job) return setError('finance:ledger.selectTheRelatedRequest');
    if (kind === 'payout' && job) {
      const paid = transactions
        .filter((item) => item.kind === 'payout' && item.jobId === jobId)
        .reduce((sum, item) => sum + item.amount, 0);
      if (job.status !== 'completed' || amount > job.total - job.commission - paid)
        return setError('finance:ledger.payoutsMustBeWithinTheTechnicianSRemaining');
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
  const transactionColumns = useMemo<DataTableColumn<(typeof filtered)[number]>[]>(
    () => [
      {
        id: 'شرح تراکنش',
        header: t('transaction.transactionDescription'),
        accessorFn: (item) => item.description,
        cell: ({ row: { original: item } }) => <strong>{item.description}</strong>,
      },
      {
        id: 'نوع',
        header: t('ledger.type'),
        accessorFn: (item) => translateLabel(kindLabels[item.kind]),
        cell: ({ row: { original: item } }) => (
          <Badge
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
              item.kind === 'receipt'
                ? 'bg-status-completed text-status-completed-foreground'
                : 'bg-status-scheduled text-status-scheduled-foreground',
            )}
          >
            {translateLabel(kindLabels[item.kind])}
          </Badge>
        ),
      },
      {
        id: 'درخواست مرتبط',
        header: t('ledger.relatedRequest'),
        accessorFn: (item) => item.jobId || '—',
        cell: ({ row: { original: item } }) => <bdi>{item.jobId || '—'}</bdi>,
      },
      {
        id: 'تاریخ',
        header: 'تاریخ',
        accessorFn: (item) => item.date,
        cell: ({ row: { original: item } }) => dateLabel(item.date),
      },
      {
        id: 'مبلغ',
        header: 'مبلغ',
        accessorFn: (item) => item.amount,
        cell: ({ row: { original: item } }) => (
          <span
            className={cn(
              'whitespace-nowrap',
              item.kind === 'receipt' ? 'text-primary' : 'text-destructive',
            )}
          >
            {item.kind === 'receipt' ? '+' : '−'} {money(item.amount)}
          </span>
        ),
      },
    ],
    [t, tShared],
  );
  return (
    <>
      <PageHeading
        title={tShared('ui.transactionRegister')}
        description={t('ledger.clarityOnReceiptsPayoutsAndTheCompanyS')}
        action={
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
            onClick={() => {
              setOpen(true);
              setError('');
            }}
          >
            <Plus size={18} />
            {t('transaction.recordTransaction')}
          </Button>
        }
      />
      <div className="grid grid-cols-4 gap-4.25 mb-5.75 max-tablet:grid-cols-2 max-mobile:gap-2.75 max-compact:gap-2">
        <StatCard
          title={t('ledger.totalRecordedReceipts')}
          value={money(finance.receipts)}
          detail={t('ledger.moneyReceivedFromCustomers')}
          icon={<ArrowDownLeft size={20} />}
        />
        <StatCard
          title={t('ledger.totalPaymentsAndExpenses')}
          value={money(finance.payouts + finance.expenses)}
          detail={t('ledger.technicianPayoutsCompanyExpenses')}
          icon={<ArrowUpRight size={20} />}
        />
        <StatCard
          title={tShared('ui.netCashFlow')}
          value={money(finance.cashFlow)}
          detail={t('ledger.excludingOpeningBalance')}
          icon={<Wallet size={20} />}
          accent
        />
        <StatCard
          title={t('ledger.technicianBalances')}
          value={money(finance.payable)}
          detail={t('ledger.paymentObligationsForCompletedServices')}
          icon={<HandCoins size={20} />}
        />
      </div>
      <div className="flex items-center gap-7.5 p-5.5 bg-accent border border-border rounded-lg mb-5.5 [&_>_div]:shrink-0 [&_span]:block [&_span]:text-muted-foreground [&_span]:text-2xs [&_strong]:block [&_strong]:mt-2.75 [&_strong]:text-primary [&_strong]:text-base [&_p]:text-2xs [&_p]:text-muted-foreground [&_p]:leading-loose [&_p]:border-s [&_p]:border-s-border [&_p]:ps-6.25 max-tablet:flex-wrap max-tablet:gap-5 max-tablet:[&_p]:border-0 max-tablet:[&_p]:p-0 max-mobile:[&_strong]:text-sm dark:[&_strong]:text-primary dark:[&_p]:text-muted-foreground dark:[&_span]:text-muted-foreground dark:bg-accent dark:border-border">
        <div>
          <span>{tShared('ui.completedServiceValue')}</span>
          <strong>{money(finance.serviceValue)}</strong>
        </div>
        <div>
          <span>{t('ledger.commissionOnTheseServices')}</span>
          <strong>{money(finance.commission)}</strong>
        </div>
        <p>{t('ledger.tomanAndAllAmountsAreSampleValuesCommission')}</p>
      </div>
      <Panel
        title={tShared('ui.transactionRegister')}
        subtitle={t('ledger.allDemoTransactionsNoOpeningBalance')}
        action={
          <Button
            variant="outline"
            size="sm"
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground text-2xs py-1.5 px-2.5"
            onClick={exportCsv}
          >
            <Download size={16} />
            {t('ledger.exportCsv')}
          </Button>
        }
      >
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <div className="flex bg-muted p-1 rounded-md gap-0.75 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-2xs [&_button]:py-2 [&_button]:px-3.5 [&_button]:rounded-md [&_button]:text-muted-foreground [&_.selected]:bg-white [&_.selected]:shadow-xs [&_.selected]:text-primary max-compact:[&_button]:px-2.5 dark:[&_.selected]:bg-muted dark:[&_.selected]:border-border dark:[&_.selected]:text-primary-foreground dark:bg-muted dark:border-border dark:text-muted-foreground">
            {[
              ['all', t('ledger.all')],
              ['receipt', t('ledger.receipts')],
              ['payout', t('ledger.payouts')],
              ['expense', t('ledger.expenses')],
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
                {translateLabel(label)}
              </Button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <DataTable
            data={filtered}
            getRowId={(item) => String(item.id)}
            columns={transactionColumns}
            emptyMessage={null}
          />
        ) : (
          <EmptyState />
        )}
      </Panel>
      {open && (
        <Modal title={t('ledger.recordDemoTransaction')} onClose={() => setOpen(false)}>
          <form
            onSubmit={submit}
            className="grid grid-cols-2 gap-4.5 p-5.75 [&_label]:flex [&_label]:flex-col [&_label]:gap-2.25 [&_label]:text-ui [&_input]:border [&_input]:border-border [&_input]:rounded-md [&_input]:p-2.5 [&_input]:text-xs [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-border [&_select]:rounded-md [&_select]:p-2.5 [&_select]:text-xs [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-md [&_textarea]:p-2.5 [&_textarea]:text-xs [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-19.5 [&_textarea]:resize-y max-mobile:gap-3.5 max-mobile:p-4.5 max-compact:grid-cols-1 dark:[&_input]:bg-muted dark:[&_input]:border-border dark:[&_input]:text-primary-foreground dark:[&_select]:bg-muted dark:[&_select]:border-border dark:[&_select]:text-primary-foreground dark:[&_textarea]:bg-muted dark:[&_textarea]:border-border dark:[&_textarea]:text-primary-foreground"
          >
            <Label className="flex flex-col gap-2 text-ui">
              {t('ledger.transactionType')}
              <Select value={kind} onValueChange={(value) => setKind(value as Transaction['kind'])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={tShared('ui.selectAnOption')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(kindLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {translateLabel(label)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
            <Label className="flex flex-col gap-2 text-ui">
              {t('ledger.amountSampleToman')}
              <Input name="amount" type="number" min="1" step="1" required />
            </Label>
            {kind !== 'expense' && (
              <Label className="col-span-full flex flex-col gap-2 text-ui">
                {t('ledger.relatedRequest')}
                <Select name="jobId" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('ledger.selectRequest')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobs
                        .filter((job) => kind !== 'payout' || job.status === 'completed')
                        .map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.id} · {translateLabel(job.appliance)} {job.brand}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
            )}
            <Label className="flex flex-col gap-2 text-ui">
              {t('ledger.dateJalali')}
              <JalaliDatePicker
                name="date"
                value={transactionDate}
                onValueChange={setTransactionDate}
                aria-label={t('transaction.transactionDate')}
                required
              />
            </Label>
            <Label className="flex flex-col gap-2 text-ui">
              {tShared('ui.description')}
              <Input name="description" required maxLength={150} />
            </Label>
            <p className="text-2xs text-muted-foreground leading-loose col-span-full">
              {t('ledger.thisOnlyUpdatesTheBrowserSDemoLedger')}
            </p>
            {error && (
              <p
                className="bg-status-cancelled text-destructive p-2.5 rounded-md text-ui leading-loose dark:bg-status-cancelled dark:text-destructive col-span-full"
                role="alert"
              >
                {translateLabel(error)}
              </p>
            )}
            <div className="flex gap-2.25 mt-1.25 col-span-full">
              <Button
                className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
                type="submit"
              >
                {t('transaction.recordTransaction')}
              </Button>
              <Button
                variant="outline"
                className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground"
                type="button"
                onClick={() => setOpen(false)}
              >
                {tShared('ui.cancel2')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
