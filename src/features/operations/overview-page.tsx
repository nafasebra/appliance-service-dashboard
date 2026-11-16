import { cn } from '@/shared/lib/utils';
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
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

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
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-primary text-white border-primary shadow-[0_3px_5px_#246b5510] [&:hover]:bg-(--primary-dark) dark:bg-[#3d8c6d] dark:border-[#3d8c6d] dark:text-[#ffffff] dark:[&:hover]:bg-[#4c9d7d]"
            onClick={() => setEditor('new')}
          >
            <Plus size={18} />
            درخواست جدید
          </Button>
        }
      />
      <div className="flex items-center justify-between overflow-hidden relative min-h-[188px] bg-[#eaf0e9] border border-[#e1e8de] rounded-[12px] p-[25px_31px] mb-5.5 [&:before]:content-[''] [&:before]:absolute [&:before]:w-[380px] [&:before]:h-[380px] [&:before]:border [&:before]:border-[#d9e4d5] [&:before]:rounded-full [&:before]:end-[-62px] [&:before]:top-[-90px] [&_h2]:text-[#35573e] [&_h2]:text-[24px] [&_h2]:mt-[15px] [&_h2]:tracking-[-0.7px] [&_p]:text-[11px] [&_p]:text-[#798a78] [&_p]:mt-3 max-[981px]:p-6 max-[981px]:[&_h2]:text-[21px] max-[761px]:min-h-[165px] max-[761px]:[&_h2]:text-[18px] max-[761px]:[&_p]:max-w-[230px] max-[761px]:[&_p]:text-[10px] max-[761px]:[&_p]:leading-[2] dark:bg-[#1b2b23] dark:border-[#2a4035] dark:[&::before]:border-[#355044] dark:[&_h2]:text-[#b8d8c7] dark:[&_p]:text-[#98aaa0]">
        <div>
          <span className="flex items-center gap-[7px] text-[#6e866f] text-[9px] dark:text-[#98aaa0]">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#5ea88a]" />
            مرکز عملیات خدمات
          </span>
          <h2>خدمات بهتر، با مدیریت دقیق‌تر.</h2>
          <p>{number(active.length)} درخواست باز دارید؛ تیم شما برای رسیدگی آماده است.</p>
          <Link
            to="/dispatch"
            className="flex gap-[9px] items-center text-[10px] text-[#3f6c4b] mt-5 font-bold dark:text-[#b8d8c7]"
          >
            مشاهده برنامه اعزام <ArrowLeft size={16} />
          </Link>
        </div>
        <div
          className="relative w-[230px] h-[140px] me-[50px] shrink-0 max-[1201px]:me-[5px] max-[981px]:w-[170px] max-[981px]:scale-[0.85] max-[981px]:origin-[center] max-[761px]:hidden"
          aria-hidden="true"
        >
          <div className="absolute w-[200px] h-[200px] border border-dashed border-[#c4d3c0] rounded-full top-[-31px] left-[7px] rotate-[20deg] dark:border-[#355044]" />
          <div className="absolute w-[94px] h-[94px] rounded-[23px] grid place-items-center top-[4px] left-[16px] bg-[#d0deca] text-[#8da387] rotate-[-13deg] dark:bg-[#2b4437] dark:text-[#90aa9a]">
            <CalendarDays size={31} />
          </div>
          <div className="absolute w-[94px] h-[94px] rounded-[23px] grid place-items-center top-[30px] left-[87px] bg-[linear-gradient(120deg,_#52815b,_#3b6544)] text-[#e9f1e7] shadow-[10px_15px_22px_#5d7a5526] rotate-[12deg] border-[5px] border-[#e8eee2] dark:border-[#263b32]">
            <Wrench size={43} strokeWidth={1.4} />
          </div>
          <span className="absolute top-0 left-[162px] bg-[#fff] p-[9px] rounded-[12px] text-[#52865c] rotate-[8deg] dark:bg-[#17211d]">
            <CircleCheck size={24} />
          </span>
          <span className="absolute top-[125px] left-[37px] w-[11px] h-[11px] border-[3px] border-[#8ba77b] rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[17px] mb-[23px] max-[981px]:grid-cols-2 max-[761px]:gap-[11px] max-[401px]:gap-2">
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
      <div className="grid grid-cols-[1.45fr_1fr] gap-[21px] mb-[23px] max-[981px]:grid-cols-1">
        <Panel
          title="گردش مالی"
          subtitle="آخرین روزهای دارای تراکنش"
          action={
            <Link
              className="inline-flex gap-[7px] items-center text-[#5d8167] text-[10px] border-0 bg-none whitespace-nowrap"
              to="/finance"
            >
              جزئیات مالی <ArrowLeft size={15} />
            </Link>
          }
        >
          <CashChart />
        </Panel>
        <Panel title="وضعیت درخواست‌ها" subtitle="از ثبت تا پایان خدمت">
          <div className="flex items-center justify-evenly gap-6 p-[24px_24px_20px] min-h-[193px] max-[1201px]:gap-4 max-[1201px]:px-4.5 max-[981px]:justify-center max-[981px]:gap-[45px] max-[761px]:gap-6 max-[401px]:gap-4.5">
            <div
              className="w-[130px] h-[130px] rounded-full grid place-items-center shrink-0 [&_>_div]:w-[107px] [&_>_div]:h-[107px] [&_>_div]:rounded-full [&_>_div]:bg-white [&_>_div]:flex [&_>_div]:items-center [&_>_div]:justify-center [&_>_div]:flex-col [&_strong]:text-[27px] [&_strong]:text-[#405e49] [&_span]:text-[8px] [&_span]:text-[#98a399] [&_span]:mt-[7px] max-[1201px]:w-[105px] max-[1201px]:h-[105px] max-[1201px]:[&_>_div]:w-[85px] max-[1201px]:[&_>_div]:h-[85px] max-[981px]:w-[130px] max-[981px]:h-[130px] max-[981px]:[&_>_div]:w-[107px] max-[981px]:[&_>_div]:h-[107px] max-[401px]:w-[103px] max-[401px]:h-[103px] max-[401px]:[&_>_div]:w-[83px] max-[401px]:[&_>_div]:h-[83px] dark:[&_strong]:text-[#b8d8c7] dark:[&_>_div]:bg-[#17211d]"
              style={{
                background: `conic-gradient(var(--primary) ${jobs.length ? (jobs.filter((job) => job.status === 'completed').length / jobs.length) * 100 : 0}%, #edf0f4 0)`,
              }}
            >
              <div>
                <strong>{number(jobs.length)}</strong>
                <span>کل درخواست‌ها</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[17px] min-w-[135px] max-w-[210px] [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:items-center [&_>_div]:gap-4 [&_>_div]:text-[10px] [&_>_div_>_span]:flex [&_>_div_>_span]:items-center [&_>_div_>_span]:gap-[7px] [&_>_div_>_span]:text-[#819087] [&_strong]:text-[#53645a] [&_strong]:text-[12px] max-[1201px]:min-w-[110px] max-[1201px]:[&_>_div_>_span]:text-[9px] max-[981px]:min-w-[160px] max-[761px]:min-w-[135px]">
              {(['completed', 'working', 'scheduled', 'new'] as const).map((status) => (
                <div key={status}>
                  <span>
                    <i
                      className={cn(
                        'size-[7px] rounded-sm bg-muted',
                        status === 'completed' && 'bg-status-completed-foreground',
                        status === 'working' && 'bg-status-new-foreground',
                        status === 'scheduled' && 'bg-status-scheduled-foreground',
                      )}
                    />
                    {statusLabels[status]}
                  </span>
                  <strong>{number(jobs.filter((job) => job.status === status).length)}</strong>
                </div>
              ))}
            </div>
          </div>
          <Link
            className="flex items-center justify-center gap-2 border-t border-t-[#f0f3f0] mt-5.5 p-[13px] text-[10px] text-[#819186] dark:border-[#27362f]"
            to="/requests"
          >
            مدیریت همه درخواست‌ها <ArrowLeft size={16} />
          </Link>
        </Panel>
      </div>
      <Panel
        title="آخرین درخواست‌ها"
        subtitle="پیگیری سریع خدمات و وضعیت رسیدگی"
        action={
          <Link
            to="/requests"
            className="inline-flex gap-[7px] items-center text-[#5d8167] text-[10px] border-0 bg-none whitespace-nowrap"
          >
            همه درخواست‌ها <ArrowLeft size={15} />
          </Link>
        }
      >
        <JobTable jobs={jobs.slice(0, 5)} onSelect={setEditor} />
      </Panel>
      <div className="grid grid-cols-[1.65fr_1fr] gap-5.5 mt-[23px] max-[981px]:grid-cols-1 max-[761px]:gap-4">
        <Panel title="در صف رسیدگی" subtitle="درخواست‌هایی که به توجه شما نیاز دارند">
          <div className="[&_>_button]:flex [&_>_button]:items-center [&_>_button]:gap-3 [&_>_button]:w-full [&_>_button]:bg-white [&_>_button]:border-0 [&_>_button]:border-t [&_>_button]:border-t-[#f2f4f0] [&_>_button]:p-[16px_22px] [&_>_button]:text-start [&_>_button]:h-auto [&_>_button:hover]:bg-[#fafcf8] [&_strong]:text-[10px] [&_strong]:text-[#68736a] [&_strong]:font-medium [&_small]:block [&_small]:text-[9px] [&_small]:text-[#9aa399] [&_small]:mt-1.5 [&_.badge]:ms-auto max-[761px]:[&_>_button]:px-[17px] max-[761px]:[&_>_button]:gap-[9px] max-[761px]:[&_strong]:text-[9px] dark:[&_>_button]:bg-[#17211d] dark:[&_>_button]:border-border dark:[&_>_button]:text-foreground dark:[&_>_button:hover]:bg-[#1c2a24] dark:[&_>_button:hover]:border-[#35483f] dark:[&_>_button]:border-[#27362f]">
            {active.length ? (
              active.slice(0, 3).map((job) => (
                <Button variant="ghost" key={job.id} onClick={() => setEditor(job)}>
                  <span className="grid place-items-center text-[#ae966f] bg-[#f8f4ea] h-[35px] w-[35px] rounded-[9px] shrink-0 dark:bg-[#202e28] dark:border-[#31433a] dark:text-[#8eb19d]">
                    <Clock3 size={19} />
                  </span>
                  <div>
                    <strong>
                      {job.appliance} {job.brand} ·{' '}
                      {customers.find((item) => item.id === job.customerId)?.name}
                    </strong>
                    <small>{job.issue}</small>
                  </div>
                  <Badge
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] whitespace-nowrap',
                      job.status === 'new' && 'bg-status-new text-status-new-foreground',
                      job.status === 'scheduled' &&
                        'bg-status-scheduled text-status-scheduled-foreground',
                      job.status === 'working' &&
                        'bg-status-working text-status-working-foreground',
                      job.status === 'completed' &&
                        'bg-status-completed text-status-completed-foreground',
                      job.status === 'cancelled' &&
                        'bg-status-cancelled text-status-cancelled-foreground',
                    )}
                  >
                    {statusLabels[job.status]}
                  </Badge>
                </Button>
              ))
            ) : (
              <p className="p-6 text-[#9ba49e]">همه درخواست‌ها رسیدگی شده‌اند.</p>
            )}
          </div>
        </Panel>
        <div className="bg-[#e8ede2] border border-[#e0e7d8] rounded-[11px] p-[27px] flex flex-col justify-center [&_h2]:text-[#536749] [&_h2]:text-[19px] [&_h2]:m-[6px_0_14px] [&_p]:text-[#8b967f] [&_p]:text-[11px] [&_p]:leading-[2.1] [&_a]:text-[#5e7751] [&_a]:text-[10px] [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:mt-6 max-[761px]:p-[23px] dark:[&_h2]:text-[#b8d8c7] dark:[&_a]:text-[#b8d8c7] dark:[&_p]:text-[#98aaa0] dark:bg-[#1d2d25] dark:border-[#2c4136]">
          <span className="text-[#8d9890] text-[9px] mb-2.5">شفافیت مالی</span>
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
