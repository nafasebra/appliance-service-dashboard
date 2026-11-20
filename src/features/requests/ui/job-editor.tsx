import { useSharedTranslation } from '@/shared/hooks';
import { useRequestsTranslation } from '../hooks/use-requests-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { useState, type FormEvent } from 'react';
import {
  useDemo,
  appliances,
  statusLabels,
  type Job,
  JobStatus,
  validateAmounts,
} from '@/entities/service';
import { useCompanySettings } from '@/entities/company';

import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { DatePicker, TimePicker } from '@/shared/ui/date-time-picker';

export function JobEditor({ job, onClose }: { job?: Job; onClose: () => void }) {
  const t = useRequestsTranslation();
  const tShared = useSharedTranslation();
  const settings = useCompanySettings((state) => state.settings);
  const customers = useDemo((state) => state.customers);
  const technicians = useDemo((state) => state.technicians);
  const saveJob = useDemo((state) => state.saveJob);
  const [error, setError] = useState('');
  const [date, setDate] = useState(job?.date ?? '2026-11-16');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const total = Number(form.get('total'));
    const commission = Number(form.get('commission'));
    const status = String(form.get('status')) as JobStatus;
    const selectedTechnician = String(form.get('technicianId') ?? '');
    const technicianId = selectedTechnician === '__unassigned' ? '' : selectedTechnician;
    if (!validateAmounts(total, commission))
      return setError('requests:editor.amountsMustBeNonNegativeWholeNumbersCommission');
    if (
      [JobStatus.Scheduled, JobStatus.Working, JobStatus.Completed].includes(status) &&
      !technicianId
    )
      return setError('requests:editor.selectATechnicianForThisStatus');
    if (status === JobStatus.Completed && total === 0)
      return setError('requests:editor.enterTheServiceAmountBeforeCompletingTheRequest');
    const saveError = saveJob({
      id: job?.id ?? `SR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      customerId: String(form.get('customerId')),
      appliance: String(form.get('appliance')) as Job['appliance'],
      brand: String(form.get('brand')).trim(),
      issue: String(form.get('issue')).trim(),
      status,
      priority: form.get('priority') === 'urgent' ? 'urgent' : 'normal',
      technicianId,
      date: String(form.get('date')),
      time: String(form.get('time')),
      total,
      commission,
    });
    if (saveError) return setError(saveError);
    onClose();
  }
  return (
    <Modal
      title={job ? t('editor.requestDetailsId', { id: job.id }) : t('editor.createNewRequest')}
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="grid grid-cols-2 gap-4.5 p-5.75 [&_label]:flex [&_label]:flex-col [&_label]:gap-2.25 [&_input]:border [&_input]:border-border [&_input]:rounded-md [&_input]:p-2.5 [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-border [&_select]:rounded-md [&_select]:p-2.5 [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-md [&_textarea]:p-2.5 [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-19.5 [&_textarea]:resize-y max-mobile:gap-3.5 max-mobile:p-4.5 max-compact:grid-cols-1 dark:[&_input]:bg-muted dark:[&_input]:border-border dark:[&_input]:text-primary-foreground dark:[&_select]:bg-muted dark:[&_select]:border-border dark:[&_select]:text-primary-foreground dark:[&_textarea]:bg-muted dark:[&_textarea]:border-border dark:[&_textarea]:text-primary-foreground"
      >
        <Label className="flex flex-col gap-2">
          {t('common.customer')}
          <Select name="customerId" defaultValue={job?.customerId ?? customers[0]?.id} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tShared('select.selectAnOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {customers.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {translateLabel(item.name)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2">
          {t('common.applianceType')}
          <Select name="appliance" defaultValue={job?.appliance ?? appliances[0]}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tShared('select.selectAnOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {appliances.map((item) => (
                  <SelectItem key={item} value={item}>
                    {translateLabel(item)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.applianceBrand')}
          <Input
            name="brand"
            defaultValue={job ? translateLabel(job.brand) : undefined}
            required
            maxLength={50}
            placeholder={t('editor.forExampleSamsung')}
          />
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.priority')}
          <Select name="priority" defaultValue={job?.priority ?? settings.defaultPriority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tShared('select.selectAnOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="normal">{t('priorities.normal')}</SelectItem>
                <SelectItem value="urgent">{t('priorities.urgent')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="col-span-full flex flex-col gap-2">
          {t('editor.problemDescription')}
          <Textarea
            name="issue"
            defaultValue={job ? translateLabel(job.issue) : undefined}
            required
            maxLength={500}
            placeholder={t('editor.describeTheApplianceProblem')}
          />
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.visitDateJalali')}
          <DatePicker
            name="date"
            value={date}
            onValueChange={setDate}
            aria-label={t('editor.visitDate')}
            required
          />
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.visitTime')}
          <TimePicker name="time" defaultValue={job?.time ?? settings.defaultVisitTime} required />
        </Label>
        <Label className="flex flex-col gap-2">
          {t('common.technician')}
          <Select name="technicianId" defaultValue={job?.technicianId || '__unassigned'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('common.unassigned')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="__unassigned">{t('common.unassigned')}</SelectItem>

                {technicians.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {translateLabel(item.name)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2">
          {tShared('fields.status')}
          <Select name="status" defaultValue={job?.status ?? JobStatus.New}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tShared('select.selectAnOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {translateLabel(label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.serviceAmountSampleToman')}
          <Input
            name="total"
            type="number"
            min="0"
            step="1"
            defaultValue={job?.total ?? 0}
            required
          />
        </Label>
        <Label className="flex flex-col gap-2">
          {t('editor.companyShareSampleToman')}
          <Input
            name="commission"
            type="number"
            min="0"
            step="1"
            defaultValue={job?.commission ?? 0}
            required
          />
        </Label>
        <p className="text-caption text-muted-foreground leading-loose col-span-full">
          {t('editor.changingStatusDoesNotMeanPaymentWasCollected')}
        </p>
        {error && (
          <p
            role="alert"
            className="bg-status-cancelled text-destructive p-2.5 rounded-md text-body leading-loose dark:bg-status-cancelled dark:text-destructive col-span-full"
          >
            {translateLabel(error)}
          </p>
        )}
        <div className="flex gap-2.25 mt-1.25 col-span-full">
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
            type="submit"
          >
            {t('editor.saveRequest')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground"
            onClick={onClose}
          >
            {tShared('actions.cancel2')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
