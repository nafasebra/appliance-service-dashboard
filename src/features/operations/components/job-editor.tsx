import { useState, type FormEvent } from 'react';
import { useDemo } from '../model/demo-store';
import { appliances, statusLabels, type Job, type JobStatus } from '../model/types';
import { validateAmounts } from '../model/finance';
import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

export function JobEditor({ job, onClose }: { job?: Job; onClose: () => void }) {
  const { customers, technicians, saveJob } = useDemo();
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const total = Number(form.get('total'));
    const commission = Number(form.get('commission'));
    const status = String(form.get('status')) as JobStatus;
    const technicianId = String(form.get('technicianId'));
    if (!validateAmounts(total, commission))
      return setError('مبلغ‌ها باید عدد صحیح و نامنفی باشند و کمیسیون از مبلغ خدمت بیشتر نباشد.');
    if (['scheduled', 'working', 'completed'].includes(status) && !technicianId)
      return setError('برای این وضعیت، یک تعمیرکار انتخاب کنید.');
    if (status === 'completed' && total === 0)
      return setError('برای تکمیل درخواست، مبلغ خدمت را ثبت کنید.');
    saveJob({
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
    onClose();
  }
  return (
    <Modal title={job ? `جزئیات درخواست ${job.id}` : 'ثبت درخواست جدید'} onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Label className="form-field">
          مشتری
          <NativeSelect
            name="customerId"
            defaultValue={job?.customerId ?? customers[0]?.id}
            required
          >
            {customers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="form-field">
          نوع دستگاه
          <NativeSelect name="appliance" defaultValue={job?.appliance}>
            {appliances.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="form-field">
          برند دستگاه
          <Input
            name="brand"
            defaultValue={job?.brand}
            required
            maxLength={50}
            placeholder="مثلاً سامسونگ"
          />
        </Label>
        <Label className="form-field">
          اولویت
          <NativeSelect name="priority" defaultValue={job?.priority ?? 'normal'}>
            <option value="normal">عادی</option>
            <option value="urgent">فوری</option>
          </NativeSelect>
        </Label>
        <Label className="form-field full-width">
          شرح مشکل
          <Textarea
            name="issue"
            defaultValue={job?.issue}
            required
            maxLength={500}
            placeholder="مشکل دستگاه را توضیح دهید…"
          />
        </Label>
        <Label className="form-field">
          تاریخ مراجعه (میلادی)
          <Input type="date" name="date" defaultValue={job?.date ?? '2026-11-16'} required />
        </Label>
        <Label className="form-field">
          ساعت مراجعه
          <Input type="time" name="time" defaultValue={job?.time ?? '09:00'} required />
        </Label>
        <Label className="form-field">
          تعمیرکار
          <NativeSelect name="technicianId" defaultValue={job?.technicianId ?? ''}>
            <option value="">بدون تخصیص</option>
            {technicians.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="form-field">
          وضعیت
          <NativeSelect name="status" defaultValue={job?.status ?? 'new'}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="form-field">
          مبلغ خدمت (تومان نمونه)
          <Input
            name="total"
            type="number"
            min="0"
            step="1"
            defaultValue={job?.total ?? 0}
            required
          />
        </Label>
        <Label className="form-field">
          سهم شرکت (تومان نمونه)
          <Input
            name="commission"
            type="number"
            min="0"
            step="1"
            defaultValue={job?.commission ?? 0}
            required
          />
        </Label>
        <p className="form-note full-width">
          تغییر وضعیت به معنی دریافت پول نیست. دریافت و پرداخت در بخش مالی ثبت می‌شود.
        </p>
        {error && (
          <p role="alert" className="form-error full-width">
            {error}
          </p>
        )}
        <div className="form-actions full-width">
          <Button className="button button-primary" type="submit">
            ذخیره درخواست
          </Button>
          <Button type="button" variant="outline" className="button" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
}
