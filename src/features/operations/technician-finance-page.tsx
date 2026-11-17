import { useState, type FormEvent } from 'react';
import { Wallet } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import { PageHeading, Panel, StatCard, Modal, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { NativeSelect } from '@/shared/ui/native-select';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/shared/ui/table';
import { money, dateLabel } from '@/shared/lib/format';
import { toIsoDate } from '@/shared/lib/date';

export function TechnicianFinancePage() {
  const { technicians, jobs, transactions, addTransaction } = useDemo();
  const [technicianId, setTechnicianId] = useState('all');
  const [jobId, setJobId] = useState('');
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [error, setError] = useState('');
  const members = technicians.filter((tech) => technicianId === 'all' || tech.id === technicianId);
  const assigned = jobs.filter((job) => members.some((tech) => tech.id === job.technicianId));
  const related = transactions.filter((transaction) =>
    assigned.some((job) => job.id === transaction.jobId),
  );
  const finance = summarizeFinance(assigned, related);
  const payable = (id: string) => {
    const job = jobs.find((item) => item.id === id);
    return job?.status === 'completed'
      ? job.total -
          job.commission -
          transactions.reduce(
            (sum, item) => sum + (item.jobId === id && item.kind === 'payout' ? item.amount : 0),
            0,
          )
      : 0;
  };
  const payouts = related
    .filter((item) => item.kind === 'payout')
    .sort((a, b) => b.date.localeCompare(a.date));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > payable(jobId)) {
      setError('مبلغ باید عدد صحیح مثبت و حداکثر برابر مانده سفارش باشد.');
      return;
    }
    addTransaction({
      id: crypto.randomUUID(),
      kind: 'payout',
      jobId,
      amount,
      date,
      description: String(form.get('description')).trim(),
    });
    setJobId('');
  }
  return (
    <>
      <PageHeading
        title="امور مالی تعمیرکاران"
        description="سهم خدمات تکمیل‌شده، پرداخت‌های ثبت‌شده و مانده قابل تسویه هر تعمیرکار."
      />
      <NativeSelect
        aria-label="انتخاب تعمیرکار"
        className="mb-4"
        value={technicianId}
        onChange={(event) => setTechnicianId(event.target.value)}
      >
        <option value="all">همه تعمیرکاران</option>
        {technicians.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </NativeSelect>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard
          title="سهم تعمیرکاران"
          value={money(finance.serviceValue - finance.commission)}
          detail="ارزش خدمات تکمیل‌شده منهای کمیسیون"
          icon={<Wallet />}
        />
        <StatCard
          title="پرداخت‌شده"
          value={money(finance.payouts)}
          detail="مجموع پرداخت‌های ثبت‌شده"
          icon={<Wallet />}
        />
        <StatCard
          title="مانده قابل پرداخت"
          value={money(finance.payable)}
          detail="براساس مانده هر سفارش تکمیل‌شده"
          icon={<Wallet />}
        />
      </div>
      <Panel title="حساب اعضای تیم">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                'تعمیرکار',
                'ارزش خدمات',
                'کمیسیون شرکت',
                'سهم تعمیرکار',
                'پرداخت‌شده',
                'مانده',
              ].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((tech) => {
              const techJobs = assigned.filter((job) => job.technicianId === tech.id);
              const summary = summarizeFinance(
                techJobs,
                related.filter((item) => techJobs.some((job) => job.id === item.jobId)),
              );
              return (
                <TableRow key={tech.id}>
                  <TableCell>{tech.name}</TableCell>
                  <TableCell>{money(summary.serviceValue)}</TableCell>
                  <TableCell>{money(summary.commission)}</TableCell>
                  <TableCell>{money(summary.serviceValue - summary.commission)}</TableCell>
                  <TableCell>{money(summary.payouts)}</TableCell>
                  <TableCell>{money(summary.payable)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!members.length ? <EmptyState /> : null}
      </Panel>
      <div className="mt-6">
        <Panel title="سفارش‌های قابل تسویه">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>سفارش</TableHead>
                <TableHead>تعمیرکار</TableHead>
                <TableHead>مانده</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assigned
                .filter((job) => payable(job.id) > 0)
                .map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <bdi>{job.id}</bdi> · {job.appliance}
                    </TableCell>
                    <TableCell>
                      {technicians.find((tech) => tech.id === job.technicianId)?.name}
                    </TableCell>
                    <TableCell>{money(payable(job.id))}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setError('');
                          setDate(toIsoDate(new Date()));
                          setJobId(job.id);
                        }}
                      >
                        ثبت پرداخت
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!assigned.some((job) => payable(job.id) > 0) ? (
            <EmptyState text="سفارش تکمیل‌شده‌ای با مانده قابل پرداخت وجود ندارد." />
          ) : null}
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="تاریخچه پرداخت به تعمیرکاران">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تاریخ</TableHead>
                <TableHead>سفارش</TableHead>
                <TableHead>تعمیرکار</TableHead>
                <TableHead>شرح</TableHead>
                <TableHead>مبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{dateLabel(item.date)}</TableCell>
                  <TableCell>
                    <bdi>{item.jobId}</bdi>
                  </TableCell>
                  <TableCell>
                    {
                      technicians.find(
                        (tech) =>
                          tech.id === jobs.find((job) => job.id === item.jobId)?.technicianId,
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{money(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!payouts.length ? <EmptyState text="پرداختی ثبت نشده است." /> : null}
        </Panel>
      </div>
      {jobId ? (
        <Modal title="ثبت پرداخت به تعمیرکار" onClose={() => setJobId('')}>
          <form onSubmit={submit} className="flex flex-col gap-4 p-6">
            <p>مانده سفارش: {money(payable(jobId))}</p>
            <Label className="flex flex-col gap-2">
              مبلغ (تومان)
              <Input name="amount" type="number" min="1" max={payable(jobId)} step="1" required />
            </Label>
            <Label className="flex flex-col gap-2">
              تاریخ پرداخت
              <JalaliDatePicker name="date" value={date} onValueChange={setDate} required />
            </Label>
            <Label className="flex flex-col gap-2">
              شرح
              <Input name="description" required maxLength={150} />
            </Label>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <p className="text-xs text-muted-foreground">
              ثبت در دفتر مالی نمونه است و انتقال بانکی انجام نمی‌دهد.
            </p>
            <div className="flex gap-2">
              <Button type="submit">ثبت پرداخت</Button>
              <Button type="button" variant="outline" onClick={() => setJobId('')}>
                انصراف
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
