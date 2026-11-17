import { useRef, useState, type FormEvent } from 'react';
import { useDemo } from '@/entities/service/model/demo-store';
import type { Transaction } from '@/entities/service/model/types';
import { paymentMethodLabels, getOrderAccount } from '@/entities/service/model/customer-account';
import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';
import { toIsoDate } from '@/shared/lib/date';
import { money } from '@/shared/lib/format';
import { getFormText } from '@/shared/utils/form';

export function TransactionDialog({
  kind,
  initialJobId = '',
  onClose,
}: {
  kind: 'receipt' | 'expense';
  initialJobId?: string;
  onClose: () => void;
}) {
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const transactions = useDemo((state) => state.transactions);
  const addTransaction = useDemo((state) => state.addTransaction);
  const [jobId, setJobId] = useState(initialJobId);
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [method, setMethod] = useState<NonNullable<Transaction['method']>>('bank');
  const [error, setError] = useState('');
  const transactionId = useRef(crypto.randomUUID());
  const submitting = useRef(false);
  const selectedJob = jobs.find((job) => job.id === jobId);
  const eligible = jobs.filter(
    (job) => job.status !== 'cancelled' && job.total > getOrderAccount(job, transactions).receipts,
  );
  const remaining = selectedJob
    ? selectedJob.total - getOrderAccount(selectedJob, transactions).receipts
    : 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const form = new FormData(event.currentTarget);
    const failure = addTransaction({
      id: transactionId.current,
      kind,
      jobId: kind === 'expense' ? '' : jobId,
      amount: Number(form.get('amount')),
      date,
      method,
      reference: getFormText(form, 'reference'),
      description: getFormText(form, 'description'),
    });
    if (failure) {
      setError(failure);
      submitting.current = false;
      return;
    }
    onClose();
  }

  return (
    <Modal title={kind === 'receipt' ? 'ثبت دریافت از مشتری' : 'ثبت هزینه شرکت'} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
        {kind === 'receipt' ? (
          <div className="col-span-full flex flex-col gap-2">
            <Label htmlFor="receipt-job">سفارش مشتری</Label>
            <Select dir="rtl" value={jobId} onValueChange={setJobId} required>
              <SelectTrigger id="receipt-job" className="w-full">
                <SelectValue placeholder="انتخاب سفارش دارای مانده" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {eligible.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.id} ·{' '}
                      {customers.find((customer) => customer.id === job.customerId)?.name} ·{' '}
                      {job.appliance}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              مانده قابل دریافت: {money(remaining)}
              {selectedJob && selectedJob.status !== 'completed'
                ? ' · این دریافت به‌عنوان پیش‌دریافت نمایش داده می‌شود.'
                : ''}
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor="transaction-amount">مبلغ (تومان)</Label>
          <Input
            id="transaction-amount"
            name="amount"
            type="number"
            min="1"
            max={kind === 'receipt' ? remaining : undefined}
            step="1"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>تاریخ</Label>
          <JalaliDatePicker
            value={date}
            onValueChange={setDate}
            required
            aria-label="تاریخ تراکنش"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transaction-method">روش پرداخت</Label>
          <Select
            dir="rtl"
            value={method}
            onValueChange={(value) => {
              if (value === 'cash' || value === 'card' || value === 'bank') setMethod(value);
            }}
          >
            <SelectTrigger id="transaction-method" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transaction-reference">شماره پیگیری / سند (اختیاری)</Label>
          <Input id="transaction-reference" name="reference" maxLength={100} />
        </div>
        <div className="col-span-full flex flex-col gap-2">
          <Label htmlFor="transaction-description">شرح تراکنش</Label>
          <Input id="transaction-description" name="description" required maxLength={150} />
        </div>
        {error ? (
          <Alert variant="destructive" className="col-span-full">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="col-span-full flex gap-2">
          <Button type="submit" disabled={kind === 'receipt' && remaining <= 0}>
            ثبت تراکنش
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
}
