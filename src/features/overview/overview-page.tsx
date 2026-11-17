import { translateLabel } from '@/shared/i18n';
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
import { useDemo } from '@/shared/store/demo-store';
import { summarizeFinance } from '@/entities/service/model/finance';
import { statusLabels, type Job } from '@/entities/service/model/types';
import { JobTable, JobEditor } from '@/features/requests/job-components';
import { CashChart } from '@/features/finance/cash-chart';
import { PageHeading, Panel, StatCard } from '@/shared/ui/primitives';
import { money } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useTranslation } from 'react-i18next';

export function OverviewPage() {
  const { t } = useTranslation();
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const technicians = useDemo((state) => state.technicians);
  const customers = useDemo((state) => state.customers);
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const finance = summarizeFinance(jobs, transactions);
  const active = jobs.filter((job) => !['completed', 'cancelled'].includes(job.status));
  return (
    <>
      <PageHeading
        title={t('ui.businessOverview')}
        description={t('ui.everythingYouNeedForAnOrganizedWorkingDay')}
        action={
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
            onClick={() => setEditor('new')}
          >
            <Plus size={18} />
            {t('ui.newRequest')}
          </Button>
        }
      />
      <div className="flex items-center justify-between overflow-hidden relative min-h-47 bg-accent border border-border rounded-lg py-6.25 px-7.75 mb-5.5 [&:before]:content-[''] [&:before]:absolute [&:before]:w-95 [&:before]:h-95 [&:before]:border [&:before]:border-border [&:before]:rounded-full [&:before]:-end-15.5 [&:before]:-top-22.5 [&_h2]:text-primary [&_h2]:text-2xl [&_h2]:mt-3.75 [&_h2]:tracking-tight [&_p]:text-ui [&_p]:text-muted-foreground [&_p]:mt-3 max-tablet:p-6 max-tablet:[&_h2]:text-xl max-mobile:min-h-41.25 max-mobile:[&_h2]:text-lg max-mobile:[&_p]:max-w-57.5 max-mobile:[&_p]:text-2xs max-mobile:[&_p]:leading-loose dark:bg-accent dark:border-border dark:[&::before]:border-border dark:[&_h2]:text-primary dark:[&_p]:text-muted-foreground">
        <div>
          <span className="flex items-center gap-1.75 text-muted-foreground text-3xs dark:text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            {t('ui.serviceOperationsCenter')}
          </span>
          <h2>{t('ui.betterServiceThroughClearerCoordination')}</h2>
          <p>{t('overview.openRequests', { count: active.length })}</p>
          <Link
            to="/dispatch"
            className="flex gap-2.25 items-center text-2xs text-primary mt-5 font-bold dark:text-primary"
          >
            {t('ui.viewDispatchSchedule')} <ArrowLeft size={16} />
          </Link>
        </div>
        <div
          className="relative w-57.5 h-35 me-12.5 shrink-0 max-desktop:me-1.25 max-tablet:w-42.5 max-tablet:scale-85 max-tablet:origin-center max-mobile:hidden"
          aria-hidden="true"
        >
          <div className="absolute w-50 h-50 border border-dashed border-border rounded-full -top-7.75 left-1.75 rotate-20 dark:border-border" />
          <div className="absolute w-23.5 h-23.5 rounded-2xl grid place-items-center top-1 left-4 bg-muted text-muted-foreground -rotate-13 dark:bg-accent dark:text-muted-foreground">
            <CalendarDays size={31} />
          </div>
          <div className="absolute w-23.5 h-23.5 rounded-2xl grid place-items-center top-7.5 left-21.75 bg-linear-120 from-primary to-accent-foreground text-primary-foreground shadow-lg rotate-12 border-1.25 border-border dark:border-border">
            <Wrench size={43} strokeWidth={1.4} />
          </div>
          <span className="absolute top-0 left-40.5 bg-card p-2.25 rounded-lg text-primary rotate-8 dark:bg-card">
            <CircleCheck size={24} />
          </span>
          <span className="absolute top-31.25 left-9.25 w-2.75 h-2.75 border-0.75 border-border rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4.25 mb-5.75 max-tablet:grid-cols-2 max-mobile:gap-2.75 max-compact:gap-2">
        <StatCard
          title={t('ui.openRequests')}
          value={active.length}
          detail={t('ui.lengthAwaitingAssignment', {
            length: jobs.filter((job) => job.status === 'new').length,
          })}
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title={t('ui.technicians')}
          value={technicians.length}
          detail={t('labels.viewCapacityOnTheDispatchPage')}
          icon={<Wrench size={20} />}
        />
        <StatCard
          title={t('ui.commissionOnCompletedServices')}
          value={money(finance.commission)}
          detail={t('labels.independentOfCustomerReceipts')}
          icon={<Wallet size={20} />}
          accent
        />
        <StatCard
          title={t('ui.netCashFlow')}
          value={money(finance.cashFlow)}
          detail={t('labels.receiptsMinusAllPayments')}
          icon={<ArrowDownLeft size={20} />}
        />
      </div>
      <div className="grid grid-cols-[1.45fr_1fr] gap-5.25 mb-5.75 max-tablet:grid-cols-1">
        <Panel
          title={t('ui.cashMovement')}
          subtitle={t('labels.latestDaysWithTransactions')}
          action={
            <Link
              className="inline-flex gap-1.75 items-center text-primary text-2xs border-0 bg-none whitespace-nowrap"
              to="/finance"
            >
              {t('ui.financialDetails')} <ArrowLeft size={15} />
            </Link>
          }
        >
          <CashChart />
        </Panel>
        <Panel
          title={t('ui.requestStatuses')}
          subtitle={t('labels.fromCreationToServiceCompletion')}
        >
          <div className="flex items-center justify-evenly gap-6 pt-6 px-6 pb-5 min-h-48.25 max-desktop:gap-4 max-desktop:px-4.5 max-tablet:justify-center max-tablet:gap-11.25 max-mobile:gap-6 max-compact:gap-4.5">
            <div
              className="w-32.5 h-32.5 rounded-full grid place-items-center shrink-0 [&_>_div]:w-26.75 [&_>_div]:h-26.75 [&_>_div]:rounded-full [&_>_div]:bg-white [&_>_div]:flex [&_>_div]:items-center [&_>_div]:justify-center [&_>_div]:flex-col [&_strong]:text-3xl [&_strong]:text-primary [&_span]:text-4xs [&_span]:text-muted-foreground [&_span]:mt-1.75 max-desktop:w-26.25 max-desktop:h-26.25 max-desktop:[&_>_div]:w-21.25 max-desktop:[&_>_div]:h-21.25 max-tablet:w-32.5 max-tablet:h-32.5 max-tablet:[&_>_div]:w-26.75 max-tablet:[&_>_div]:h-26.75 max-compact:w-25.75 max-compact:h-25.75 max-compact:[&_>_div]:w-20.75 max-compact:[&_>_div]:h-20.75 dark:[&_strong]:text-primary dark:[&_>_div]:bg-card"
              style={{
                background: `conic-gradient(var(--primary) ${jobs.length ? (jobs.filter((job) => job.status === 'completed').length / jobs.length) * 100 : 0}%, #edf0f4 0)`,
              }}
            >
              <div>
                <strong>{jobs.length}</strong>
                <span>{t('ui.totalRequests')}</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4.25 min-w-33.75 max-w-52.5 [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:items-center [&_>_div]:gap-4 [&_>_div]:text-2xs [&_>_div_>_span]:flex [&_>_div_>_span]:items-center [&_>_div_>_span]:gap-1.75 [&_>_div_>_span]:text-muted-foreground [&_strong]:text-muted-foreground [&_strong]:text-xs max-desktop:min-w-27.5 max-desktop:[&_>_div_>_span]:text-3xs max-tablet:min-w-40 max-mobile:min-w-33.75">
              {(['completed', 'working', 'scheduled', 'new'] as const).map((status) => (
                <div key={status}>
                  <span>
                    <i
                      className={cn(
                        'size-1.75 rounded-sm bg-muted',
                        status === 'completed' && 'bg-status-completed-foreground',
                        status === 'working' && 'bg-status-new-foreground',
                        status === 'scheduled' && 'bg-status-scheduled-foreground',
                      )}
                    />
                    {translateLabel(statusLabels[status])}
                  </span>
                  <strong>{jobs.filter((job) => job.status === status).length}</strong>
                </div>
              ))}
            </div>
          </div>
          <Link
            className="flex items-center justify-center gap-2 border-t border-t-border mt-5.5 p-3.25 text-2xs text-muted-foreground dark:border-border"
            to="/requests"
          >
            {t('ui.manageAllRequests')} <ArrowLeft size={16} />
          </Link>
        </Panel>
      </div>
      <Panel
        title={t('ui.recentRequests')}
        subtitle={t('labels.quicklyTrackServicesAndProgress')}
        action={
          <Link
            to="/requests"
            className="inline-flex gap-1.75 items-center text-primary text-2xs border-0 bg-none whitespace-nowrap"
          >
            {t('ui.allRequests')} <ArrowLeft size={15} />
          </Link>
        }
      >
        <JobTable jobs={jobs.slice(0, 5)} onSelect={setEditor} />
      </Panel>
      <div className="grid grid-cols-[1.65fr_1fr] gap-5.5 mt-5.75 max-tablet:grid-cols-1 max-mobile:gap-4">
        <Panel
          title={t('ui.awaitingAttention')}
          subtitle={t('labels.requestsThatNeedYourAttention')}
        >
          <div className="[&_>_button]:flex [&_>_button]:items-center [&_>_button]:gap-3 [&_>_button]:w-full [&_>_button]:bg-white [&_>_button]:border-0 [&_>_button]:border-t [&_>_button]:border-t-border [&_>_button]:py-4 [&_>_button]:px-5.5 [&_>_button]:text-start [&_>_button]:h-auto [&_>_button:hover]:bg-muted [&_strong]:text-2xs [&_strong]:text-muted-foreground [&_strong]:font-medium [&_small]:block [&_small]:text-3xs [&_small]:text-muted-foreground [&_small]:mt-1.5 [&_.badge]:ms-auto max-mobile:[&_>_button]:px-4.25 max-mobile:[&_>_button]:gap-2.25 max-mobile:[&_strong]:text-3xs dark:[&_>_button]:bg-card dark:[&_>_button]:border-border dark:[&_>_button]:text-foreground dark:[&_>_button:hover]:bg-accent dark:[&_>_button:hover]:border-border">
            {active.length ? (
              active.slice(0, 3).map((job) => (
                <Button
                  variant="ghost"
                  key={job.id}
                  onClick={() => setEditor(job)}
                  className="justify-start"
                >
                  <span className="grid place-items-center text-muted-foreground bg-muted h-8.75 w-8.75 rounded-md shrink-0 dark:bg-muted dark:border-border dark:text-muted-foreground">
                    <Clock3 size={19} />
                  </span>
                  <div>
                    <strong>
                      {translateLabel(job.appliance)} {job.brand} ·{' '}
                      {customers.find((item) => item.id === job.customerId)?.name}
                    </strong>
                    <small>{job.issue}</small>
                  </div>
                  <Badge
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
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
                    {translateLabel(statusLabels[job.status])}
                  </Badge>
                </Button>
              ))
            ) : (
              <p className="p-6 text-muted-foreground">{t('ui.allRequestsHaveBeenHandled')}</p>
            )}
          </div>
        </Panel>
        <div className="bg-accent border border-border rounded-lg p-6.75 flex flex-col justify-center [&_h2]:text-primary [&_h2]:text-lg [&_h2]:mt-1.5 [&_h2]:mx-0 [&_h2]:mb-3.5 [&_p]:text-muted-foreground [&_p]:text-ui [&_p]:leading-loose [&_a]:text-primary [&_a]:text-2xs [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:mt-6 max-mobile:p-5.75 dark:[&_h2]:text-primary dark:[&_a]:text-primary dark:[&_p]:text-muted-foreground dark:bg-accent dark:border-border">
          <span className="text-muted-foreground text-3xs mb-2.5">{t('ui.financialClarity')}</span>
          <h2>{t('ui.aClearAccountForEveryService')}</h2>
          <p>{t('ui.trackCompanyCommissionTechnicianBalancesAndActualCash')}</p>
          <Link to="/finance">
            {t('ui.goToFinance')} <ArrowLeft size={17} />
          </Link>
        </div>
      </div>
      {editor && (
        <JobEditor job={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />
      )}
    </>
  );
}
