import {
  JobStatus,
  statusLabels,
  type Customer,
  type Job,
  type Technician,
  JobStatusBadge,
} from '@/entities/service';
import { useMemo } from 'react';

import { translateLabel } from '../../../shared/i18n/index.ts';
import { dateLabel, money } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import type { DataTableColumn } from '@/shared/ui/data-table';
import { useCartableTranslation } from './use-cartable-translation.tsx';
import type { WorkflowQueue } from '../model/workflow-queues.ts';
import type { WorkflowDialogMode } from '../ui/workflow-dialog.tsx';

export type CartableDialogMode = WorkflowDialogMode | 'receipt' | 'payout';
export interface CartableRow {
  job: Job;
  customer?: Customer;
  technician?: Technician;
  outstanding: number;
  payable: number;
}

export function useCartableColumns(
  queue: WorkflowQueue,
  onOpen: (job: Job, mode: CartableDialogMode) => void,
  onAccept: (job: Job) => void,
) {
  const t = useCartableTranslation();
  return useMemo<DataTableColumn<CartableRow>[]>(
    () => [
      {
        id: 'order',
        header: t('columns.order'),
        accessorFn: ({ job }) => job.id,
        cell: ({
          row: {
            original: { job },
          },
        }) => (
          <div className="flex flex-col gap-1">
            <strong>
              <bdi>{job.id}</bdi>
            </strong>
            <span>
              {translateLabel(job.appliance)} · {job.brand}
            </span>
          </div>
        ),
      },
      {
        id: 'customer',
        header: t('columns.customer'),
        accessorFn: ({ customer }) => customer?.name ?? '',
        cell: ({
          row: {
            original: { customer },
          },
        }) => (
          <div className="flex flex-col gap-1">
            <span>{customer?.name}</span>
            <bdi className="text-muted-foreground">{customer?.phone}</bdi>
          </div>
        ),
      },
      {
        id: 'visit',
        header: t('columns.technician'),
        accessorFn: ({ job }) => `${job.date}T${job.time}`,
        cell: ({
          row: {
            original: { job, technician },
          },
        }) => (
          <div className="flex flex-col gap-1">
            <span>{technician?.name ?? '—'}</span>
            {job.status === JobStatus.Scheduled ||
            job.status === JobStatus.Working ||
            job.status === JobStatus.Completed ? (
              <span className="text-muted-foreground">
                {dateLabel(job.date)} · <bdi>{job.time}</bdi>
              </span>
            ) : null}
          </div>
        ),
      },
      {
        id: 'status',
        header: t('columns.status'),
        accessorFn: ({ job }) => translateLabel(statusLabels[job.status]),
        cell: ({
          row: {
            original: { job },
          },
        }) => <JobStatusBadge status={job.status} />,
      },
      {
        id: 'outstanding',
        header: t('columns.balance'),
        accessorFn: ({ outstanding }) => outstanding,
        cell: ({ cell }) => money(Number(cell.getValue())),
      },
      {
        id: 'payable',
        header: t('columns.payable'),
        accessorFn: ({ payable }) => payable,
        cell: ({ cell }) => money(Number(cell.getValue())),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        cell: ({
          row: {
            original: { job },
          },
        }) => (
          <div className="flex flex-wrap gap-2">
            {queue === 'inbox' ? (
              <Button size="sm" onClick={() => onAccept(job)}>
                {t('actions.accept')}
              </Button>
            ) : null}
            {queue === 'assignment' ? (
              <Button size="sm" onClick={() => onOpen(job, 'assign')}>
                {t('actions.assign')}
              </Button>
            ) : null}
            {queue === 'active' ? (
              <Button
                size="sm"
                onClick={() =>
                  onOpen(job, job.status === JobStatus.Scheduled ? 'start' : 'complete')
                }
              >
                {t(job.status === JobStatus.Scheduled ? 'actions.start' : 'actions.complete')}
              </Button>
            ) : null}
            {queue === 'collection' ? (
              <Button size="sm" onClick={() => onOpen(job, 'receipt')}>
                {t('actions.receipt')}
              </Button>
            ) : null}
            {queue === 'settlement' ? (
              <Button size="sm" onClick={() => onOpen(job, 'payout')}>
                {t('actions.payout')}
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={() => onOpen(job, 'details')}>
              {t('actions.details')}
            </Button>
            {[JobStatus.New, JobStatus.Accepted, JobStatus.Scheduled, JobStatus.Working].includes(
              job.status,
            ) ? (
              <Button variant="ghost" size="sm" onClick={() => onOpen(job, 'cancel')}>
                {t('actions.cancel')}
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [queue, onOpen, onAccept, t],
  );
}
