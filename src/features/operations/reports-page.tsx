import { useDemo } from './model/demo-store';
import { appliances } from './model/types';
import { summarizeFinance } from './model/finance';
import { CashChart } from './components/cash-chart';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';

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
                  <div className="progress-track">
                    <span style={{ width: `${jobs.length ? (count / jobs.length) * 100 : 0}%` }} />
                  </div>
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
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>تعمیرکار</th>
                <th>کل درخواست‌ها</th>
                <th>تکمیل‌شده</th>
                <th>ارزش خدمات تکمیل‌شده</th>
                <th>کمیسیون شرکت</th>
                <th>مانده تعمیرکار</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => {
                const assigned = jobs.filter((job) => job.technicianId === tech.id);
                const summary = summarizeFinance(
                  assigned,
                  transactions.filter((item) => assigned.some((job) => job.id === item.jobId)),
                );
                return (
                  <tr key={tech.id}>
                    <td>
                      <strong>{tech.name}</strong>
                    </td>
                    <td>{number(assigned.length)}</td>
                    <td>{number(assigned.filter((job) => job.status === 'completed').length)}</td>
                    <td>{money(summary.serviceValue)}</td>
                    <td>{money(summary.commission)}</td>
                    <td>{money(summary.payable)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
