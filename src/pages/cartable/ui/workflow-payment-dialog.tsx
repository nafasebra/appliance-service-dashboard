import {
  JobStatus,
  type Job,
  type Transaction,
  paymentMethodLabels,
  useDemo,
} from '@/entities/service';
import { useRef, useState, type FormEvent } from 'react';

import { translateLabel } from '../../../shared/i18n/index';
import { money, toIsoDate } from '@/shared/lib';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Modal } from '@/shared/ui/primitives';
import { DatePicker } from '@/shared/ui/date-time-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { getWorkflowAccount } from '../model/workflow-queues';
import { useCartableTranslation } from '../hooks/use-cartable-translation';

export function WorkflowPaymentDialog({
  job,
  kind,
  onClose,
  onDone,
}: {
  job: Job;
  kind: 'receipt' | 'payout';
  onClose: () => void;
  onDone: () => void;
}) {
  const t = useCartableTranslation();
  const current = useDemo((state) => state.jobs.find((item) => item.id === job.id));
  const transactions = useDemo((state) => state.transactions);
  const addTransaction = useDemo((state) => state.addTransaction);
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [method, setMethod] = useState<NonNullable<Transaction['method']>>('bank');
  const [error, setError] = useState('');
  const transactionId = useRef(crypto.randomUUID());
  const submitting = useRef(false);
  const account = current ? getWorkflowAccount(current, transactions) : null;
  const limit = (kind === 'receipt' ? account?.outstanding : account?.payable) ?? 0;
  const blocked =
    current?.status !== JobStatus.Completed ||
    limit <= 0 ||
    (kind === 'payout' && account?.outstanding !== 0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (blocked) return setError('cartable:errors.stale');
    submitting.current = true;
    const form = new FormData(event.currentTarget);
    const failure = addTransaction({
      id: transactionId.current,
      jobId: job.id,
      kind,
      amount: Number(form.get('amount')),
      date,
      method,
      reference: String(form.get('reference') ?? '').trim(),
      description: String(form.get('description') ?? '').trim(),
    });
    if (failure) {
      setError(failure);
      submitting.current = false;
      return;
    }
    onDone();
  }

  return (
    <Modal
      title={t('dialog.title', { action: t(`actions.${kind}`), id: job.id })}
      onClose={onClose}
    >
      <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
        <Alert className="col-span-full">
          <AlertDescription>{t('dialog.limit', { amount: money(limit) })}</AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2">
          <Label htmlFor="workflow-payment-amount">{t('dialog.amount')}</Label>
          <Input
            id="workflow-payment-amount"
            name="amount"
            type="number"
            min="1"
            max={limit}
            step="1"
            defaultValue={limit}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t('dialog.paymentDate')}</Label>
          <DatePicker
            value={date}
            onValueChange={setDate}
            aria-label={t('dialog.paymentDate')}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="workflow-payment-method">{t('dialog.method')}</Label>
          <Select
            value={method}
            onValueChange={(value) => {
              if (value === 'bank' || value === 'cash' || value === 'card') setMethod(value);
            }}
          >
            <SelectTrigger id="workflow-payment-method" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {translateLabel(label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="workflow-payment-reference">{t('dialog.reference')}</Label>
          <Input id="workflow-payment-reference" name="reference" maxLength={100} />
        </div>
        <div className="col-span-full flex flex-col gap-2">
          <Label htmlFor="workflow-payment-description">{t('dialog.description')}</Label>
          <Input
            id="workflow-payment-description"
            name="description"
            maxLength={150}
            defaultValue={t(
              kind === 'receipt' ? 'dialog.receiptDescription' : 'dialog.payoutDescription',
              { id: job.id },
            )}
            required
          />
        </div>
        {error ? (
          <Alert variant="destructive" className="col-span-full">
            <AlertDescription>{translateLabel(error)}</AlertDescription>
          </Alert>
        ) : null}
        <div className="col-span-full flex flex-wrap gap-2">
          <Button type="submit" disabled={blocked}>
            {t(`actions.${kind}`)}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('actions.close')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
