import { useState, type FormEvent } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import { useCompanySettings } from '@/shared/store/settings-store';
import { appliances, statusLabels, type Job, type JobStatus } from '@/entities/service/model/types';
import { validateAmounts } from '@/entities/service/model/finance';
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
import { JalaliDatePicker, TimePicker } from '@/shared/ui/date-time-picker';

export function JobEditor({ job, onClose }: { job?: Job; onClose: () => void }) {
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
      return setError('مبلغ‌ها باید عدد صحیح و نامنفی باشند و کمیسیون از مبلغ خدمت بیشتر نباشد.');
    if (['scheduled', 'working', 'completed'].includes(status) && !technicianId)
      return setError('برای این وضعیت، یک تعمیرکار انتخاب کنید.');
    if (status === 'completed' && total === 0)
      return setError('برای تکمیل درخواست، مبلغ خدمت را ثبت کنید.');
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
    <Modal title={job ? `جزئیات درخواست ${job.id}` : 'ثبت درخواست جدید'} onClose={onClose}>
      <form
        onSubmit={submit}
        className="grid grid-cols-2 gap-4.5 p-5.75 [&_label]:flex [&_label]:flex-col [&_label]:gap-2.25 [&_label]:text-ui [&_input]:border [&_input]:border-border [&_input]:rounded-md [&_input]:p-2.5 [&_input]:text-xs [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-border [&_select]:rounded-md [&_select]:p-2.5 [&_select]:text-xs [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-md [&_textarea]:p-2.5 [&_textarea]:text-xs [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-19.5 [&_textarea]:resize-y max-mobile:gap-3.5 max-mobile:p-4.5 max-compact:grid-cols-1 dark:[&_input]:bg-muted dark:[&_input]:border-border dark:[&_input]:text-primary-foreground dark:[&_select]:bg-muted dark:[&_select]:border-border dark:[&_select]:text-primary-foreground dark:[&_textarea]:bg-muted dark:[&_textarea]:border-border dark:[&_textarea]:text-primary-foreground"
      >
        <Label className="flex flex-col gap-2 text-ui">
          مشتری
          <Select
            dir="rtl"
            name="customerId"
            defaultValue={job?.customerId ?? customers[0]?.id}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {customers.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          نوع دستگاه
          <Select dir="rtl" name="appliance" defaultValue={job?.appliance ?? appliances[0]}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {appliances.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          برند دستگاه
          <Input
            name="brand"
            defaultValue={job?.brand}
            required
            maxLength={50}
            placeholder="مثلاً سامسونگ"
          />
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          اولویت
          <Select
            dir="rtl"
            name="priority"
            defaultValue={job?.priority ?? settings.defaultPriority}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="normal">عادی</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="col-span-full flex flex-col gap-2 text-ui">
          شرح مشکل
          <Textarea
            name="issue"
            defaultValue={job?.issue}
            required
            maxLength={500}
            placeholder="مشکل دستگاه را توضیح دهید…"
          />
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          تاریخ مراجعه (جلالی)
          <JalaliDatePicker
            name="date"
            value={date}
            onValueChange={setDate}
            aria-label="تاریخ مراجعه"
            required
          />
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          ساعت مراجعه
          <TimePicker name="time" defaultValue={job?.time ?? settings.defaultVisitTime} required />
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          تعمیرکار
          <Select dir="rtl" name="technicianId" defaultValue={job?.technicianId || '__unassigned'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="بدون تخصیص" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="__unassigned">بدون تخصیص</SelectItem>

                {technicians.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
          وضعیت
          <Select dir="rtl" name="status" defaultValue={job?.status ?? 'new'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col gap-2 text-ui">
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
        <Label className="flex flex-col gap-2 text-ui">
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
        <p className="text-2xs text-muted-foreground leading-loose col-span-full">
          تغییر وضعیت به معنی دریافت پول نیست. دریافت و پرداخت در بخش مالی ثبت می‌شود.
        </p>
        {error && (
          <p
            role="alert"
            className="bg-status-cancelled text-destructive p-2.5 rounded-md text-ui leading-loose dark:bg-status-cancelled dark:text-destructive col-span-full"
          >
            {error}
          </p>
        )}
        <div className="flex gap-2.25 mt-1.25 col-span-full">
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
            type="submit"
          >
            ذخیره درخواست
          </Button>
          <Button
            type="button"
            variant="outline"
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground"
            onClick={onClose}
          >
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
}
