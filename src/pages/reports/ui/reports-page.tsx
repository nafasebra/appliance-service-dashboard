import { useSharedTranslation } from '@/shared/hooks';
import { JobStatus, appliances, useDemo, summarizeFinance } from '@/entities/service';
import { useReportsTranslation } from '../hooks/use-reports-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { useMemo } from 'react';

import { CashChart } from '@/features/finance';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { money } from '@/shared/lib';
import { Progress } from '@/shared/ui/progress';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

export function ReportsPage() {
  const t = useReportsTranslation();
  const tShared = useSharedTranslation();
  const jobs = useDemo((state) => state.jobs);
  const technicians = useDemo((state) => state.technicians);
  const transactions = useDemo((state) => state.transactions);
  const performanceRows = useMemo(
    () =>
      technicians.map((tech) => {
        const assigned = jobs.filter((job) => job.technicianId === tech.id);
        const summary = summarizeFinance(
          assigned,
          transactions.filter((item) => assigned.some((job) => job.id === item.jobId)),
        );
        return { tech, assigned, summary };
      }),
    [technicians, jobs, transactions, t, tShared],
  );
  const performanceColumns = useMemo<DataTableColumn<(typeof performanceRows)[number]>[]>(
    () => [
      {
        id: 'تعمیرکار',
        header: 'تعمیرکار',
        accessorFn: ({ tech }) => tech.name,
        cell: ({
          row: {
            original: { tech },
          },
        }) => <strong>{tech.name}</strong>,
      },
      {
        id: 'کل درخواست‌ها',
        header: 'کل درخواست‌ها',
        accessorFn: ({ assigned }) => assigned.length,
        cell: ({
          row: {
            original: { assigned },
          },
        }) => assigned.length,
      },
      {
        id: 'تکمیل‌شده',
        header: t('performance.completed2'),
        accessorFn: ({ assigned }) =>
          assigned.filter((job) => job.status === JobStatus.Completed).length,
        cell: ({
          row: {
            original: { assigned },
          },
        }) => assigned.filter((job) => job.status === JobStatus.Completed).length,
      },
      {
        id: 'ارزش خدمات تکمیل‌شده',
        header: 'ارزش خدمات تکمیل‌شده',
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
        id: 'مانده تعمیرکار',
        header: t('performance.technicianBalance'),
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
  return (
    <>
      <PageHeading
        title={t('performance.performanceReports')}
        description={t('performance.anOverviewOfServicesTeamPerformanceAndCash')}
      />
      <div className="grid grid-cols-[1.2fr_1fr] gap-5 mb-5.75 max-tablet:grid-cols-1">
        <Panel
          title={t('performance.receiptsAndPayments')}
          subtitle={t('performance.daysWithTransactionsMillionToman')}
        >
          <CashChart />
        </Panel>
        <Panel
          title={t('performance.requestsByAppliance')}
          subtitle={tShared('filters.allStatuses')}
        >
          <div className="pt-2 px-6 pb-6.25 flex flex-col gap-5.25 [&_>_div_>_div:first-child]:flex [&_>_div_>_div:first-child]:justify-between [&_>_div_>_div:first-child]:text-2xs [&_>_div_>_div:first-child]:text-muted-foreground [&_>_div_>_div:first-child]:mb-2.5 [&_strong]:font-normal">
            {appliances.map((appliance) => {
              const count = jobs.filter((job) => job.appliance === appliance).length;
              return (
                <div key={appliance}>
                  <div>
                    <span>{translateLabel(appliance)}</span>
                    <strong>{t('performance.count', { count })}</strong>
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
        title={t('performance.technicianPerformanceAndAccounts')}
        subtitle={t('performance.commissionAndTechnicianSharesAreBasedOnCompleted')}
      >
        <DataTable
          data={performanceRows}
          getRowId={({ tech }) => String(tech.id)}
          columns={performanceColumns}
        />
      </Panel>
    </>
  );
}
