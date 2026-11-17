import { useState } from 'react';
import { useDemo } from '@/entities/service/model/demo-store';
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

export function TechnicianJobsPage() {
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
        title="سفارش‌های در دست انجام تعمیرکاران"
        description="پیگیری سفارش‌های باز تخصیص‌یافته، زمان مراجعه و وضعیت رسیدگی."
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select dir="rtl" value={technicianId} onValueChange={(value) => setTechnicianId(value)}>
          <SelectTrigger className="w-full" aria-label="فیلتر تعمیرکار">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه تعمیرکاران</SelectItem>
              {technicians.map((tech) => (
                <SelectItem value={tech.id} key={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select dir="rtl" value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label="فیلتر وضعیت سفارش">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه سفارش‌های باز</SelectItem>
              <SelectItem value="new">در انتظار اعزام</SelectItem>
              <SelectItem value="scheduled">برنامه‌ریزی‌شده</SelectItem>
              <SelectItem value="working">در حال انجام</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel title="سفارش‌های تخصیص‌یافته" subtitle={`${number(active.length)} سفارش باز`}>
        <JobTable jobs={active} onSelect={setSelected} />
      </Panel>
      {selected ? <JobEditor job={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
