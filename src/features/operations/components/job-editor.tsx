import { useState, type FormEvent } from 'react';
import { useDemo } from '../model/demo-store';
import { appliances, statusLabels, type Job, type JobStatus } from '../model/types';
import { validateAmounts } from '../model/finance';
import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { NativeSelect } from '@/shared/ui/native-select';
import { Textarea } from '@/shared/ui/textarea';

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
        className="grid grid-cols-2 gap-4.5 p-[23px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[9px] [&_label]:text-[11px] [&_input]:border [&_input]:border-[#dce5d6] [&_input]:rounded-[7px] [&_input]:p-2.5 [&_input]:text-[12px] [&_input]:w-full [&_input]:bg-white [&_select]:border [&_select]:border-[#dce5d6] [&_select]:rounded-[7px] [&_select]:p-2.5 [&_select]:text-[12px] [&_select]:w-full [&_select]:bg-white [&_textarea]:border [&_textarea]:border-[#dce5d6] [&_textarea]:rounded-[7px] [&_textarea]:p-2.5 [&_textarea]:text-[12px] [&_textarea]:w-full [&_textarea]:bg-white [&_input[type='date']]:direction-ltr [&_input[type='time']]:direction-ltr [&_textarea]:min-h-[78px] [&_textarea]:resize-y max-[761px]:gap-3.5 max-[761px]:p-4.5 max-[401px]:grid-cols-1 dark:[&_input]:bg-[#1c2823] dark:[&_input]:border-[#33453d] dark:[&_input]:text-[#dce7e1] dark:[&_select]:bg-[#1c2823] dark:[&_select]:border-[#33453d] dark:[&_select]:text-[#dce7e1] dark:[&_textarea]:bg-[#1c2823] dark:[&_textarea]:border-[#33453d] dark:[&_textarea]:text-[#dce7e1]"
      >
        <Label className="flex flex-col gap-2 text-[11px]">
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
        <Label className="flex flex-col gap-2 text-[11px]">
          نوع دستگاه
          <NativeSelect name="appliance" defaultValue={job?.appliance}>
            {appliances.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
          برند دستگاه
          <Input
            name="brand"
            defaultValue={job?.brand}
            required
            maxLength={50}
            placeholder="مثلاً سامسونگ"
          />
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
          اولویت
          <NativeSelect name="priority" defaultValue={job?.priority ?? 'normal'}>
            <option value="normal">عادی</option>
            <option value="urgent">فوری</option>
          </NativeSelect>
        </Label>
        <Label className="col-span-full flex flex-col gap-2 text-[11px]">
          شرح مشکل
          <Textarea
            name="issue"
            defaultValue={job?.issue}
            required
            maxLength={500}
            placeholder="مشکل دستگاه را توضیح دهید…"
          />
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
          تاریخ مراجعه (میلادی)
          <Input type="date" name="date" defaultValue={job?.date ?? '2026-11-16'} required />
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
          ساعت مراجعه
          <Input type="time" name="time" defaultValue={job?.time ?? '09:00'} required />
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
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
        <Label className="flex flex-col gap-2 text-[11px]">
          وضعیت
          <NativeSelect name="status" defaultValue={job?.status ?? 'new'}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </Label>
        <Label className="flex flex-col gap-2 text-[11px]">
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
        <Label className="flex flex-col gap-2 text-[11px]">
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
        <p className="text-[10px] text-[#919d89] leading-[2] col-span-full">
          تغییر وضعیت به معنی دریافت پول نیست. دریافت و پرداخت در بخش مالی ثبت می‌شود.
        </p>
        {error && (
          <p
            role="alert"
            className="bg-[#fff0ee] text-[#aa5445] p-2.5 rounded-[7px] text-[11px] leading-[1.9] dark:bg-[#412929] dark:text-[#e2a5a5] col-span-full"
          >
            {error}
          </p>
        )}
        <div className="flex gap-[9px] mt-[5px] col-span-full">
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-primary text-white border-primary shadow-[0_3px_5px_#246b5510] [&:hover]:bg-(--primary-dark) dark:bg-[#3d8c6d] dark:border-[#3d8c6d] dark:text-[#ffffff] dark:[&:hover]:bg-[#4c9d7d]"
            type="submit"
          >
            ذخیره درخواست
          </Button>
          <Button
            type="button"
            variant="outline"
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1]"
            onClick={onClose}
          >
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
}
