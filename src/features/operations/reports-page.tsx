import { useDemo } from './model/demo-store';
import { appliances } from './model/types';
import { summarizeFinance } from './model/finance';
import { CashChart } from './components/cash-chart';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ReportsPage() {
  const { jobs, technicians, transactions } = useDemo();
  return (
    <>
      <PageHeading
        title="گزارش‌های عملکرد"
        description="تصویری از خدمات، عملکرد تیم و گردش مالی تمام داده‌های نمونه."
      />
      <div className="reports-grid">
        <Panel title="گردش دریافت و پرداخت" subtitle="روزهای دارای تراکنش · میلیون تومان">
          <CashChart />
        </Panel>
        <Panel title="درخواست‌ها به تفکیک دستگاه" subtitle="همه وضعیت‌ها">
          <div className="appliance-report">
            {appliances.map((appliance) => {
              const count = jobs.filter((job) => job.appliance === appliance).length;
              return (
                <div key={appliance}>
                  <div>
                    <span>{appliance}</span>
                    <strong>{number(count)} درخواست</strong>
                  </div>
                  <Progress
                    className="progress-track"
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
        <Table className="table-scroll">
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
