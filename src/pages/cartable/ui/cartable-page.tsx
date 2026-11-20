import { useCallback, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { type Job, type WorkflowFailure, useDemo } from '@/entities/service';

import { JobEditor } from '@/features/requests';

import { translateLabel } from '../../../shared/i18n/index';
import { localizeDigits } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable } from '@/shared/ui/data-table';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { WorkflowDialog } from './workflow-dialog';
import { WorkflowPaymentDialog } from './workflow-payment-dialog';
import { useCartableColumns, type CartableDialogMode } from '../hooks/use-cartable-columns';
import {
  getWorkflowAccount,
  getWorkflowQueue,
  workflowQueues,
  type WorkflowQueue,
} from '../model/workflow-queues';
import {
  useCartableTranslation,
  useCartableQueueDescription,
  useWorkflowFailureMessage,
} from '../hooks/use-cartable-translation';

const queuePaths = {
  inbox: '/cartable',
  assignment: '/cartable/assignment',
  active: '/cartable/active',
  collection: '/cartable/collection',
  settlement: '/cartable/settlement',
  archive: '/cartable/archive',
} as const;

export function CartablePage({ queue }: { queue: WorkflowQueue }) {
  const t = useCartableTranslation();
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const technicians = useDemo((state) => state.technicians);
  const transactions = useDemo((state) => state.transactions);
  const storageError = useDemo((state) => state.storageError);
  const advanceJob = useDemo((state) => state.advanceJob);
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<{ job: Job; mode: CartableDialogMode } | null>(null);
  const [creating, setCreating] = useState(false);
  const [failure, setFailure] = useState<WorkflowFailure | null>(null);
  const [saved, setSaved] = useState(false);
  const description = useCartableQueueDescription(queue);
  const failureMessage = useWorkflowFailureMessage(failure);
  const onOpen = useCallback(
    (job: Job, mode: CartableDialogMode) => setSelection({ job, mode }),
    [],
  );
  const onAccept = useCallback(
    (job: Job) => {
      const error = advanceJob(job.id, job.status, { type: 'accept' });
      setFailure(error);
      setSaved(!error);
    },
    [advanceJob],
  );
  const columns = useCartableColumns(queue, onOpen, onAccept);
  const entries = useMemo(
    () =>
      jobs.map((job) => ({
        job,
        customer: customers.find((item) => item.id === job.customerId),
        technician: technicians.find((item) => item.id === job.technicianId),
        queue: getWorkflowQueue(job, transactions),
        ...getWorkflowAccount(job, transactions),
      })),
    [jobs, customers, technicians, transactions],
  );
  const rows = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return entries.filter(
      (row) =>
        row.queue === queue &&
        `${row.job.id} ${translateLabel(row.customer?.name ?? '')} ${localizeDigits(row.customer?.phone ?? '')} ${row.job.appliance} ${translateLabel(row.job.appliance)} ${translateLabel(row.job.brand)} ${translateLabel(row.job.issue)} ${translateLabel(row.technician?.name ?? '')}`
          .toLocaleLowerCase()
          .includes(search),
    );
  }, [entries, queue, query, t]);

  function done() {
    setSelection(null);
    setFailure(null);
    setSaved(true);
  }

  return (
    <>
      <PageHeading
        title={t(`queues.${queue}.title`)}
        description={description}
        action={
          queue === 'inbox' ? (
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              {t('actions.new')}
            </Button>
          ) : undefined
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {workflowQueues.map((item) => (
          <Link
            key={item}
            to={queuePaths[item]}
            aria-current={item === queue ? 'page' : undefined}
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Card className={item === queue ? 'border-primary bg-accent' : ''}>
              <CardContent className="flex items-center justify-between gap-3">
                <span className="text-body">{t(`queues.${item}.title`)}</span>
                <strong className="text-page-title tabular-nums">
                  {entries.filter((entry) => entry.queue === item).length}
                </strong>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-3">
        <Alert>
          <AlertDescription>
            <p>{t('flow')}</p>
            <p>{t('paymentNote')}</p>
          </AlertDescription>
        </Alert>
        {storageError ? (
          <Alert variant="destructive">
            <AlertDescription>{t('storageError')}</AlertDescription>
          </Alert>
        ) : null}
        {failure ? (
          <Alert variant="destructive">
            <AlertDescription>{failureMessage}</AlertDescription>
          </Alert>
        ) : saved ? (
          <Alert role="status">
            <AlertDescription>{t('saved')}</AlertDescription>
          </Alert>
        ) : null}
      </div>
      <Panel title={t(`queues.${queue}.title`)} subtitle={t('count', { count: rows.length })}>
        <div className="px-5 pb-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('search')}
            placeholder={t('search')}
            className="max-w-lg"
          />
        </div>
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(row) => row.job.id}
          emptyMessage={t('empty')}
        />
      </Panel>
      {creating ? <JobEditor onClose={() => setCreating(false)} /> : null}
      {selection ? (
        selection.mode === 'receipt' || selection.mode === 'payout' ? (
          <WorkflowPaymentDialog
            key={`${selection.job.id}-${selection.mode}`}
            job={selection.job}
            kind={selection.mode}
            onClose={() => setSelection(null)}
            onDone={done}
          />
        ) : (
          <WorkflowDialog
            key={`${selection.job.id}-${selection.mode}`}
            job={selection.job}
            mode={selection.mode}
            onClose={() => setSelection(null)}
            onDone={done}
          />
        )
      ) : null}
    </>
  );
}
