import { useState } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import type { Job } from '@/entities/service/model/types';
import { JobTable, JobEditor } from '@/features/requests/job-components';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/select';
import { number } from '@/shared/lib/format';
import { useTranslation } from 'react-i18next'

export function TechnicianJobsPage() {
  const { t } = useTranslation()
  const technicians = useDemo((state) => state.technicians);
  const jobs = useDemo((state) => state.jobs);
  const [technicianId, setTechnicianId] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Job | null>(null);
  const active = jobs.filter(
    (job) =>
      job.technicianId &&
      ['new', 'scheduled', 'working'].includes(job.status) &&
      (technicianId === 'all' || job.technicianId === technicianId) &&
      (status === 'all' || job.status === status),
  );
  return (
    <>
      <PageHeading
        title={t('key60', 'سفارش‌های در دست انجام تعمیرکاران')}
        description={t('key61', 'پیگیری سفارش‌های باز تخصیص‌یافته، زمان مراجعه و وضعیت رسیدگی.')}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select dir="rtl" value={technicianId} onValueChange={(value) => setTechnicianId(value)}>
          <SelectTrigger className="w-full" aria-label={t('key62', 'فیلتر تعمیرکار')}>
            <SelectValue placeholder={t('key63', 'انتخاب کنید')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('key64', 'همه تعمیرکاران')}</SelectItem>
              {technicians.map((tech) => (
                <SelectItem value={tech.id} key={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select dir="rtl" value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label={t('key65', 'فیلتر وضعیت سفارش')}>
            <SelectValue placeholder={t('key63', 'انتخاب کنید')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('key66', 'همه سفارش‌های باز')}</SelectItem>
              <SelectItem value="new">{t('key67', 'در انتظار اعزام')}</SelectItem>
              <SelectItem value="scheduled">{t('key68', 'برنامه‌ریزی‌شده')}</SelectItem>
              <SelectItem value="working">{t('key69', 'در حال انجام')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel title={t('key70', 'سفارش‌های تخصیص‌یافته')} subtitle={t('length2', '{{length}} سفارش باز', { length: number(active.length) })}>
        <JobTable jobs={active} onSelect={setSelected} />
      </Panel>
      {selected ? <JobEditor job={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
