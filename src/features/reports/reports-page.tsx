import { useDemo } from '@/shared/store/demo-store';
import { appliances } from '@/entities/service/model/types';
import { summarizeFinance } from '@/entities/service/model/finance';
import { CashChart } from '@/features/finance/cash-chart';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';
import { Progress } from '@/shared/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function ReportsPage() {
  const jobs = useDemo((state) => state.jobs);
  const technicians = useDemo((state) => state.technicians);
  const transactions = useDemo((state) => state.transactions);
  return (
    <>
      <PageHeading
        title="گزارش‌های عملکرد"
        description="تصویری از خدمات، عملکرد تیم و گردش مالی تمام داده‌های نمونه."
      />
      <div className="grid grid-cols-[1.2fr_1fr] gap-5 mb-5.75 max-tablet:grid-cols-1">
        <Panel title="گردش دریافت و پرداخت" subtitle="روزهای دارای تراکنش · میلیون تومان">
          <CashChart />
        </Panel>
        <Panel title="درخواست‌ها به تفکیک دستگاه" subtitle="همه وضعیت‌ها">
          <div className="pt-2 px-6 pb-6.25 flex flex-col gap-5.25 [&_>_div_>_div:first-child]:flex [&_>_div_>_div:first-child]:justify-between [&_>_div_>_div:first-child]:text-2xs [&_>_div_>_div:first-child]:text-muted-foreground [&_>_div_>_div:first-child]:mb-2.5 [&_strong]:font-normal">
            {appliances.map((appliance) => {
              const count = jobs.filter((job) => job.appliance === appliance).length;
              return (
                <div key={appliance}>
                  <div>
                    <span>{appliance}</span>
                    <strong>{number(count)} درخواست</strong>
                  </div>
                  <Progress
                    className="h-1.75 bg-muted rounded-md overflow-hidden [&_span]:h-full [&_span]:block [&_span]:bg-primary [&_span]:rounded-md dark:bg-muted dark:border-border dark:text-muted-foreground"
                    value={jobs.length ? (count / jobs.length) * 100 : 0}
                  />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
      <Panel
        title="عملکرد و حساب تعمیرکاران"
        subtitle="کمیسیون و سهم تعمیرکار بر اساس خدمات تکمیل‌شده"
      >
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead>تعمیرکار</TableHead>
              <TableHead>کل درخواست‌ها</TableHead>
              <TableHead>تکمیل‌شده</TableHead>
              <TableHead>ارزش خدمات تکمیل‌شده</TableHead>
              <TableHead>کمیسیون شرکت</TableHead>
              <TableHead>مانده تعمیرکار</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicians.map((tech) => {
              const assigned = jobs.filter((job) => job.technicianId === tech.id);
              const summary = summarizeFinance(
                assigned,
                transactions.filter((item) => assigned.some((job) => job.id === item.jobId)),
              );
              return (
                <TableRow key={tech.id}>
                  <TableCell>
                    <strong>{tech.name}</strong>
                  </TableCell>
                  <TableCell>{number(assigned.length)}</TableCell>
                  <TableCell>
                    {number(assigned.filter((job) => job.status === 'completed').length)}
                  </TableCell>
                  <TableCell>{money(summary.serviceValue)}</TableCell>
                  <TableCell>{money(summary.commission)}</TableCell>
                  <TableCell>{money(summary.payable)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
