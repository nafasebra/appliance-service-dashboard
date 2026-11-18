import { useState, type FormEvent } from 'react';
import type { Job } from '@/entities/service/model/types';
import type { JobWorkflowAction, WorkflowFailure } from '@/entities/service/model/job-workflow';
import { useDemo } from '@/shared/store/demo-store';
import { translateLabel } from '@/shared/i18n';
import { money } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Modal } from '@/shared/ui/primitives';
import { JalaliDatePicker, TimePicker } from '@/shared/ui/date-time-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  useCartableTranslation,
  useWorkflowFailureMessage,
} from '../hooks/use-cartable-translation';

export type WorkflowDialogMode = 'assign' | 'start' | 'complete' | 'cancel' | 'details';

export function WorkflowDialog({
  job,
  mode,
  onClose,
  onDone,
}: {
  job: Job;
  mode: WorkflowDialogMode;
  onClose: () => void;
  onDone: () => void;
}) {
  const t = useCartableTranslation();
  const technicians = useDemo((state) => state.technicians);
  const customer = useDemo((state) => state.customers.find((item) => item.id === job.customerId));
  const advanceJob = useDemo((state) => state.advanceJob);
  const [technicianId, setTechnicianId] = useState(job.technicianId);
  const [date, setDate] = useState(job.date);
  const [failure, setFailure] = useState<WorkflowFailure | null>(null);
  const failureMessage = useWorkflowFailureMessage(failure);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === 'details') return;
    const form = new FormData(event.currentTarget);
    const action: JobWorkflowAction =
      mode === 'assign'
        ? { type: 'assign', technicianId, date, time: String(form.get('time') ?? '') }
        : mode === 'complete'
          ? {
              type: 'complete',
              total: Number(form.get('total')),
              commission: Number(form.get('commission')),
            }
          : { type: mode };
    const error = advanceJob(job.id, job.status, action);
    if (error) return setFailure(error);
    onDone();
  }

  return (
    <Modal
      title={t('dialog.title', { action: t(`actions.${mode}`), id: job.id })}
      onClose={onClose}
    >
      <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
        <dl className="col-span-full grid gap-2 rounded-lg bg-muted p-4 text-sm">
          <dt className="font-medium">
            {customer?.name} · <bdi>{customer?.phone}</bdi>
          </dt>
          <dt className="text-muted-foreground">{t('dialog.address')}</dt>
          <dd>{customer?.address}</dd>
          <dt className="text-muted-foreground">{t('dialog.issue')}</dt>
          <dd>
            {translateLabel(job.appliance)} · {job.brand} · {job.issue}
          </dd>
          <dt className="text-muted-foreground">{t('dialog.total')}</dt>
          <dd>{money(job.total)}</dd>
          <dt className="text-muted-foreground">{t('dialog.commission')}</dt>
          <dd>{money(job.commission)}</dd>
        </dl>
        {mode === 'assign' ? (
          <>
            <div className="col-span-full flex flex-col gap-2">
              <Label htmlFor="workflow-technician">{t('dialog.technician')}</Label>
              <Select value={technicianId} onValueChange={setTechnicianId} required>
                <SelectTrigger id="workflow-technician" className="w-full">
                  <SelectValue placeholder={t('dialog.selectTechnician')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>
                        {technician.name} · {technician.specialty} · {technician.area}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!technicians.length ? (
                <p className="text-sm text-muted-foreground">{t('dialog.noTechnicians')}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('dialog.date')}</Label>
              <JalaliDatePicker
                value={date}
                onValueChange={setDate}
                aria-label={t('dialog.date')}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workflow-time">{t('dialog.time')}</Label>
              <TimePicker id="workflow-time" name="time" defaultValue={job.time} required />
            </div>
          </>
        ) : null}
        {mode === 'complete' ? (
          <>
            <Alert className="col-span-full">
              <AlertDescription>{t('dialog.completeNote')}</AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workflow-total">{t('dialog.total')}</Label>
              <Input
                id="workflow-total"
                name="total"
                type="number"
                min="1"
                step="1"
                defaultValue={job.total || ''}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workflow-commission">{t('dialog.commission')}</Label>
              <Input
                id="workflow-commission"
                name="commission"
                type="number"
                min="0"
                step="1"
                defaultValue={job.commission}
                required
              />
            </div>
          </>
        ) : null}
        {mode === 'cancel' ? (
          <Alert className="col-span-full">
            <AlertDescription>{t('dialog.cancelNote')}</AlertDescription>
          </Alert>
        ) : null}
        {failure ? (
          <Alert variant="destructive" className="col-span-full">
            <AlertDescription>{failureMessage}</AlertDescription>
          </Alert>
        ) : null}
        <div className="col-span-full flex flex-wrap gap-2">
          {mode !== 'details' ? (
            <Button
              type="submit"
              variant={mode === 'cancel' ? 'destructive' : 'default'}
              disabled={mode === 'assign' && !technicians.length}
            >
              {t(`actions.${mode}`)}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={onClose}>
            {t('actions.close')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
