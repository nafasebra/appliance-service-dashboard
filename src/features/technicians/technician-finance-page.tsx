import { useTechniciansTranslation } from './i18n/use-technicians-translation';
import { getOrderAccount } from '@/entities/service/model/customer-account';
import { translateLabel } from '@/shared/i18n';
import { useMemo, useState, type FormEvent } from 'react';
import { getJobPayable } from './utils/technician-finance';
import { Wallet } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import { summarizeFinance } from '@/entities/service/model/finance';
import { PageHeading, Panel, StatCard, Modal, EmptyState } from '@/shared/ui/primitives';
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
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { money, dateLabel } from '@/shared/lib/format';
import { toIsoDate } from '@/shared/lib/date';
import { useTranslation } from 'react-i18next';

export function TechnicianFinancePage() {
  const t = useTechniciansTranslation();
  const { t: tShared } = useTranslation();
  const technicians = useDemo((state) => state.technicians);
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const addTransaction = useDemo((state) => state.addTransaction);
  const [technicianId, setTechnicianId] = useState('all');
  const [jobId, setJobId] = useState('');
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [error, setError] = useState('');
  const members = useMemo(
    () => technicians.filter((tech) => technicianId === 'all' || tech.id === technicianId),
    [technicians, technicianId, t, tShared],
  );
  const assigned = useMemo(
    () => jobs.filter((job) => members.some((tech) => tech.id === job.technicianId)),
    [jobs, members, t, tShared],
  );
  const related = useMemo(
    () =>
      transactions.filter((transaction) => assigned.some((job) => job.id === transaction.jobId)),
    [transactions, assigned, t, tShared],
  );
  const finance = summarizeFinance(assigned, related);
  const payouts = useMemo(
    () =>
      related.filter((item) => item.kind === 'payout').sort((a, b) => b.date.localeCompare(a.date)),
    [related, t, tShared],
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      amount > getJobPayable(jobId, jobs, transactions)
    ) {
      setError('technicians:finance.enterAPositiveWholeAmountWithinTheOrder');
      return;
    }
    const failure = addTransaction({
      id: crypto.randomUUID(),
      kind: 'payout',
      jobId,
      amount,
      date,
      description: String(form.get('description')).trim(),
    });
    if (failure) return setError(failure);
    setJobId('');
  }
  const memberRows = useMemo(
    () =>
      members.map((tech) => {
        const techJobs = assigned.filter((job) => job.technicianId === tech.id);
        const summary = summarizeFinance(
          techJobs,
          related.filter((item) => techJobs.some((job) => job.id === item.jobId)),
        );
        return { tech, techJobs, summary };
      }),
    [members, assigned, related, t, tShared],
  );
  const memberColumns = useMemo<DataTableColumn<(typeof memberRows)[number]>[]>(
    () => [
      {
        id: 'تعمیرکار',
        header: 'تعمیرکار',
        accessorFn: ({ tech }) => tech.name,
      },
      {
        id: 'ارزش خدمات',
        header: t('finance.serviceValue'),
        accessorFn: ({ summary }) => summary.serviceValue,
        cell: ({
          row: {
            original: { summary },
          },
        }) => money(summary.serviceValue),
      },
      {
        id: 'کمیسیون شرکت',
        header: 'کمیسیون شرکت',
        accessorFn: ({ summary }) => summary.commission,
        cell: ({
          row: {
            original: { summary },
          },
        }) => money(summary.commission),
      },
      {
        id: 'سهم تعمیرکار',
        header: t('finance.technicianShare'),
        accessorFn: ({ summary }) => summary.serviceValue - summary.commission,
        cell: ({
          row: {
            original: { summary },
          },
        }) => money(summary.serviceValue - summary.commission),
      },
      {
        id: 'پرداخت‌شده',
        header: t('finance.paid3'),
        accessorFn: ({ summary }) => summary.payouts,
        cell: ({
          row: {
            original: { summary },
          },
        }) => money(summary.payouts),
      },
      {
        id: 'مانده',
        header: 'مانده',
        accessorFn: ({ summary }) => summary.payable,
        cell: ({
          row: {
            original: { summary },
          },
        }) => money(summary.payable),
      },
    ],
    [t, tShared],
  );
  const payableJobs = useMemo(
    () =>
      assigned.filter(
        (job) =>
          getJobPayable(job.id, jobs, transactions) > 0 &&
          getOrderAccount(job, transactions).outstanding === 0,
      ),
    [assigned, jobs, transactions, t, tShared],
  );
  const payableJobColumns = useMemo<DataTableColumn<(typeof payableJobs)[number]>[]>(
    () => [
      {
        id: 'سفارش',
        header: 'سفارش',
        accessorFn: (job) => job.id,
        cell: ({ row: { original: job } }) => (
          <>
            <bdi>{job.id}</bdi> · {translateLabel(job.appliance)}
          </>
        ),
      },
      {
        id: 'تعمیرکار',
        header: 'تعمیرکار',
        accessorFn: (job) => technicians.find((tech) => tech.id === job.technicianId)?.name,
      },
      {
        id: 'مانده',
        header: 'مانده',
        accessorFn: (job) => getJobPayable(job.id, jobs, transactions),
        cell: ({ row: { original: job } }) => money(getJobPayable(job.id, jobs, transactions)),
      },
      {
        id: 'عملیات',
        header: 'عملیات',
        enableSorting: false,
        cell: ({ row: { original: job } }) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setError('');
              setDate(toIsoDate(new Date()));
              setJobId(job.id);
            }}
          >
            {t('finance.recordPayout')}
          </Button>
        ),
      },
    ],
    [technicians, jobs, transactions, setError, setDate, setJobId, t, tShared],
  );
  const payoutColumns = useMemo<DataTableColumn<(typeof payouts)[number]>[]>(
    () => [
      {
        id: 'تاریخ',
        header: 'تاریخ',
        accessorFn: (item) => item.date,
        cell: ({ row: { original: item } }) => dateLabel(item.date),
      },
      {
        id: 'سفارش',
        header: 'سفارش',
        accessorFn: (item) => item.jobId,
        cell: ({ row: { original: item } }) => <bdi>{item.jobId}</bdi>,
      },
      {
        id: 'تعمیرکار',
        header: 'تعمیرکار',
        accessorFn: (item) =>
          technicians.find(
            (tech) => tech.id === jobs.find((job) => job.id === item.jobId)?.technicianId,
          )?.name,
      },
      {
        id: 'شرح',
        header: 'شرح',
        accessorFn: (item) => item.description,
      },
      {
        id: 'مبلغ',
        header: 'مبلغ',
        accessorFn: (item) => item.amount,
        cell: ({ row: { original: item } }) => money(item.amount),
      },
    ],
    [technicians, jobs, t, tShared],
  );
  return (
    <>
      <PageHeading
        title={tShared('ui.technicianFinances')}
        description={t('finance.completedServiceSharesRecordedPayoutsAndEachTechnician')}
      />
      <Select value={technicianId} onValueChange={(value) => setTechnicianId(value)}>
        <SelectTrigger aria-label={tShared('ui.selectTechnician')} className="mb-4">
          <SelectValue placeholder={tShared('ui.selectAnOption')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('finance.allTechnicians')}</SelectItem>
            {technicians.map((tech) => (
              <SelectItem key={tech.id} value={tech.id}>
                {tech.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard
          title={t('finance.technicianShares')}
          value={money(finance.serviceValue - finance.commission)}
          detail={t('finance.completedServiceValueMinusCommission')}
          icon={<Wallet />}
        />
        <StatCard
          title={t('finance.paid3')}
          value={money(finance.payouts)}
          detail={t('finance.totalRecordedPayouts')}
          icon={<Wallet />}
        />
        <StatCard
          title={t('finance.amountPayable')}
          value={money(finance.payable)}
          detail={t('finance.basedOnEachCompletedOrderSBalance')}
          icon={<Wallet />}
        />
      </div>
      <Panel title={t('finance.teamAccounts')}>
        <DataTable
          data={memberRows}
          getRowId={({ tech }) => String(tech.id)}
          columns={memberColumns}
          emptyMessage={null}
        />
        {!members.length ? <EmptyState /> : null}
      </Panel>
      <div className="mt-6">
        <Panel title={t('finance.ordersEligibleForPayout')}>
          <DataTable
            data={payableJobs}
            getRowId={(job) => String(job.id)}
            columns={payableJobColumns}
            emptyMessage={null}
          />
          {!payableJobs.length ? (
            <EmptyState text={t('finance.noCompletedOrdersHaveARemainingPayableBalance')} />
          ) : null}
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title={t('finance.technicianPayoutHistory')}>
          <DataTable
            data={payouts}
            getRowId={(item) => String(item.id)}
            columns={payoutColumns}
            emptyMessage={null}
          />
          {!payouts.length ? <EmptyState text={t('finance.noPayoutsRecorded')} /> : null}
        </Panel>
      </div>
      {jobId ? (
        <Modal title={t('finance.recordTechnicianPayout')} onClose={() => setJobId('')}>
          <form onSubmit={submit} className="flex flex-col gap-4 p-6">
            <p>
              {t('finance.orderBalance')} {money(getJobPayable(jobId, jobs, transactions))}
            </p>
            <Label className="flex flex-col gap-2">
              {tShared('ui.amountToman2')}
              <Input
                name="amount"
                type="number"
                min="1"
                max={getJobPayable(jobId, jobs, transactions)}
                step="1"
                required
              />
            </Label>
            <Label className="flex flex-col gap-2">
              {t('finance.payoutDate')}
              <JalaliDatePicker name="date" value={date} onValueChange={setDate} required />
            </Label>
            <Label className="flex flex-col gap-2">
              {tShared('ui.description')}
              <Input name="description" required maxLength={150} />
            </Label>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{translateLabel(error)}</AlertDescription>
              </Alert>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {t('finance.thisRecordsAnEntryInTheDemoLedger')}
            </p>
            <div className="flex gap-2">
              <Button type="submit">{t('finance.recordPayout')}</Button>
              <Button type="button" variant="outline" onClick={() => setJobId('')}>
                {tShared('ui.cancel2')}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
