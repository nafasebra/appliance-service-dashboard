import { useDemo } from './model/demo-store';
import { appliances } from './model/types';
import { summarizeFinance } from './model/finance';
import { CashChart } from './components/cash-chart';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';
import { Progress } from '@/shared/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function ReportsPage() {
  const { jobs, technicians, transactions } = useDemo();
  return (
    <>
      <PageHeading
        title="گزارش‌های عملکرد"
        description="تصویری از خدمات، عملکرد تیم و گردش مالی تمام داده‌های نمونه."
      />
      <div className="grid grid-cols-[1.2fr_1fr] gap-5 mb-[23px] max-[981px]:grid-cols-1">
        <Panel title="گردش دریافت و پرداخت" subtitle="روزهای دارای تراکنش · میلیون تومان">
          <CashChart />
        </Panel>
        <Panel title="درخواست‌ها به تفکیک دستگاه" subtitle="همه وضعیت‌ها">
          <div className="p-[8px_24px_25px] flex flex-col gap-[21px] [&_>_div_>_div:first-child]:flex [&_>_div_>_div:first-child]:justify-between [&_>_div_>_div:first-child]:text-[10px] [&_>_div_>_div:first-child]:text-[#8c9b80] [&_>_div_>_div:first-child]:mb-2.5 [&_strong]:font-normal">
            {appliances.map((appliance) => {
              const count = jobs.filter((job) => job.appliance === appliance).length;
              return (
                <div key={appliance}>
                  <div>
                    <span>{appliance}</span>
                    <strong>{number(count)} درخواست</strong>
                  </div>
                  <Progress
                    className="h-[7px] bg-[#f1f5ec] rounded-[5px] overflow-hidden [&_span]:h-full [&_span]:block [&_span]:bg-[#8aa976] [&_span]:rounded-[5px] dark:bg-[#202e28] dark:border-[#31433a] dark:text-[#8eb19d]"
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
