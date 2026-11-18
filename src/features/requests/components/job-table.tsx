import { useSharedTranslation } from '@/shared/i18n/use-shared-translation';
import { useRequestsTranslation } from '../i18n/use-requests-translation';
import { translateLabel } from '@/shared/i18n';
import { JobStatusBadge } from '@/entities/service/ui/job-status-badge';
import { useMemo } from 'react';
import { ArrowUpLeft, WashingMachine, Refrigerator, Wind, CookingPot } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import { statusLabels, type Job } from '@/entities/service/model/types';
import { dateLabel, money } from '@/shared/lib/format';
import { EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

export function ApplianceIcon({ appliance }: { appliance: string }) {
  const Icon =
    appliance === 'یخچال'
      ? Refrigerator
      : appliance === 'کولر گازی'
        ? Wind
        : appliance === 'اجاق گاز'
          ? CookingPot
          : WashingMachine;
  return <Icon size={20} strokeWidth={1.6} />;
}

export function JobTable({ jobs, onSelect }: { jobs: Job[]; onSelect: (job: Job) => void }) {
  const t = useRequestsTranslation();
  const tShared = useSharedTranslation();
  const customers = useDemo((state) => state.customers);
  const technicians = useDemo((state) => state.technicians);
  const jobColumns = useMemo<DataTableColumn<(typeof jobs)[number]>[]>(
    () => [
      {
        id: 'درخواست / دستگاه',
        header: t('table.requestAppliance'),
        accessorFn: (job) => `${job.appliance} ${job.brand} ${job.id}`,
        cell: ({ row: { original: job } }) => (
          <div className="flex gap-2.5 items-center min-w-33.75">
            <span className="w-8.5 h-9 border border-border rounded-md bg-muted grid place-items-center text-muted-foreground shrink-0 dark:bg-muted dark:border-border dark:text-muted-foreground">
              <ApplianceIcon appliance={job.appliance} />
            </span>
            <div>
              <strong>
                {translateLabel(job.appliance)} {job.brand}
              </strong>
              <small className="direction-ltr text-start font-latin tracking-normal">
                {job.id}
              </small>
            </div>
            {job.priority === 'urgent' && (
              <span
                className="w-1.25 h-1.25 rounded-full bg-secondary"
                title={t('priorities.urgent')}
              />
            )}
          </div>
        ),
      },
      {
        id: 'مشتری',
        header: 'مشتری',
        accessorFn: (job) => customers.find((item) => item.id === job.customerId)?.name,
        cell: ({ row: { original: job } }) => (
          <>
            <strong>{customers.find((item) => item.id === job.customerId)?.name}</strong>
            <small>
              {customers.find((item) => item.id === job.customerId)?.address.split('،')[1]}
            </small>
          </>
        ),
      },
      {
        id: 'تعمیرکار',
        header: 'تعمیرکار',
        accessorFn: (job) => technicians.find((item) => item.id === job.technicianId)?.name,
        cell: ({ row: { original: job } }) =>
          technicians.find((item) => item.id === job.technicianId)?.name ?? (
            <span className="text-muted-foreground">{t('table.notAssigned')}</span>
          ),
      },
      {
        id: 'زمان مراجعه',
        header: t('table.visitTime'),
        accessorFn: (job) => `${job.date}T${job.time}`,
        cell: ({ row: { original: job } }) => (
          <>
            {dateLabel(job.date)}
            <small className="direction-ltr text-start font-latin tracking-normal">
              {job.time}
            </small>
          </>
        ),
      },
      {
        id: 'وضعیت',
        header: 'وضعیت',
        accessorFn: (job) => translateLabel(statusLabels[job.status]),
        cell: ({ row: { original: job } }) => <JobStatusBadge status={job.status} showDot />,
      },
      {
        id: 'مبلغ خدمت',
        header: 'مبلغ خدمت',
        accessorFn: (job) => job.total,
        cell: ({ row: { original: job } }) => (
          <span className="whitespace-nowrap">
            {job.total ? money(job.total) : tShared('fields.notSpecified')}
          </span>
        ),
      },
      {
        id: 'جزئیات',
        header: t('table.details'),
        enableSorting: false,
        cell: ({ row: { original: job } }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            className="grid place-items-center h-7.75 w-7.75 border border-transparent rounded-md text-muted-foreground bg-transparent shrink-0 [&:hover]:bg-accent [&:hover]:border-border dark:[&:hover]:bg-accent dark:[&:hover]:border-border"
            aria-label={t('table.detailsForId', { id: job.id })}
            onClick={() => onSelect(job)}
          >
            <ArrowUpLeft size={18} />
          </Button>
        ),
      },
    ],
    [customers, technicians, onSelect, t, tShared],
  );
  if (!jobs.length) return <EmptyState />;
  return (
    <DataTable
      data={jobs}
      getRowId={(job) => String(job.id)}
      columns={jobColumns}
      emptyMessage={null}
    />
  );
}
