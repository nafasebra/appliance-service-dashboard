import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Plus,
  ClipboardList,
  Wrench,
  Wallet,
  ArrowDownLeft,
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Clock3,
} from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import { statusLabels, type Job } from './model/types';
import { JobTable } from './components/job-table';
import { JobEditor } from './components/job-editor';
import { CashChart } from './components/cash-chart';
import { PageHeading, Panel, StatCard } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function OverviewPage() {
  const { jobs, transactions, technicians, customers } = useDemo();
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const finance = summarizeFinance(jobs, transactions);
  const active = jobs.filter((job) => !['completed', 'cancelled'].includes(job.status));
  return (
    <>
      <PageHeading
        title="نمای کلی کسب‌وکار"
        description="همه‌چیز برای یک روز کاری منظم، در یک نگاه."
        action={
          <Button className="button button-primary" onClick={() => setEditor('new')}>
            <Plus size={18} />
            درخواست جدید
          </Button>
        }
      />
      <div className="welcome-banner">
        <div>
          <span className="banner-label">
            <span className="live-dot" />
            مرکز عملیات خدمات
          </span>
          <h2>خدمات بهتر، با مدیریت دقیق‌تر.</h2>
          <p>{number(active.length)} درخواست باز دارید؛ تیم شما برای رسیدگی آماده است.</p>
          <Link to="/dispatch" className="banner-link">
            مشاهده برنامه اعزام <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-orbit" />
          <div className="art-tile art-tile-back">
            <CalendarDays size={31} />
          </div>
          <div className="art-tile art-tile-front">
            <Wrench size={43} strokeWidth={1.4} />
          </div>
          <span className="art-check">
            <CircleCheck size={24} />
          </span>
          <span className="art-dot" />
        </div>
      </div>
      <div className="stats-grid">
        <StatCard
          title="درخواست‌های باز"
          value={number(active.length)}
          detail={`${number(jobs.filter((job) => job.status === 'new').length)} مورد در انتظار تخصیص`}
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title="تعمیرکاران تیم"
          value={number(technicians.length)}
          detail="مشاهده ظرفیت در صفحه اعزام"
          icon={<Wrench size={20} />}
        />
        <StatCard
          title="کمیسیون خدمات تکمیل‌شده"
          value={money(finance.commission)}
          detail="مستقل از دریافت وجه"
          icon={<Wallet size={20} />}
          accent
        />
        <StatCard
          title="خالص گردش نقدی"
          value={money(finance.cashFlow)}
          detail="دریافت منهای تمام پرداخت‌ها"
          icon={<ArrowDownLeft size={20} />}
        />
      </div>
      <div className="overview-middle">
        <Panel
          title="گردش مالی"
          subtitle="آخرین روزهای دارای تراکنش"
          action={
            <Link className="text-link" to="/finance">
              جزئیات مالی <ArrowLeft size={15} />
            </Link>
          }
        >
          <CashChart />
        </Panel>
        <Panel title="وضعیت درخواست‌ها" subtitle="از ثبت تا پایان خدمت">
          <div className="status-ring-row">
            <div
              className="status-ring"
              style={{
                background: `conic-gradient(var(--primary) ${jobs.length ? (jobs.filter((job) => job.status === 'completed').length / jobs.length) * 100 : 0}%, #edf0f4 0)`,
              }}
            >
              <div>
                <strong>{number(jobs.length)}</strong>
                <span>کل درخواست‌ها</span>
              </div>
            </div>
            <div className="status-summary">
              {(['completed', 'working', 'scheduled', 'new'] as const).map((status) => (
                <div key={status}>
                  <span>
                    <i className={`status-marker marker-${status}`} />
                    {statusLabels[status]}
                  </span>
                  <strong>{number(jobs.filter((job) => job.status === status).length)}</strong>
                </div>
              ))}
            </div>
          </div>
          <Link className="status-footer" to="/requests">
            مدیریت همه درخواست‌ها <ArrowLeft size={16} />
          </Link>
        </Panel>
      </div>
      <Panel
        title="آخرین درخواست‌ها"
        subtitle="پیگیری سریع خدمات و وضعیت رسیدگی"
        action={
          <Link to="/requests" className="text-link">
            همه درخواست‌ها <ArrowLeft size={15} />
          </Link>
        }
      >
        <JobTable jobs={jobs.slice(0, 5)} onSelect={setEditor} />
      </Panel>
      <div className="bottom-grid">
        <Panel title="در صف رسیدگی" subtitle="درخواست‌هایی که به توجه شما نیاز دارند">
          <div className="attention-list">
            {active.length ? (
              active.slice(0, 3).map((job) => (
                <Button variant="ghost" key={job.id} onClick={() => setEditor(job)}>
                  <span className="attention-icon">
                    <Clock3 size={19} />
                  </span>
                  <div>
                    <strong>
                      {job.appliance} {job.brand} ·{' '}
                      {customers.find((item) => item.id === job.customerId)?.name}
                    </strong>
                    <small>{job.issue}</small>
                  </div>
                  <Badge className={`badge status-${job.status}`}>{statusLabels[job.status]}</Badge>
                </Button>
              ))
            ) : (
              <p className="panel-padding muted">همه درخواست‌ها رسیدگی شده‌اند.</p>
            )}
          </div>
        </Panel>
        <div className="help-card">
          <span className="eyebrow">شفافیت مالی</span>
          <h2>هر خدمت، یک حساب روشن.</h2>
          <p>سهم شرکت، مانده تعمیرکار و پول جابه‌جا شده را جداگانه دنبال کنید.</p>
          <Link to="/finance">
            رفتن به امور مالی <ArrowLeft size={17} />
          </Link>
        </div>
      </div>
      {editor && (
        <JobEditor job={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />
      )}
    </>
  );
}
