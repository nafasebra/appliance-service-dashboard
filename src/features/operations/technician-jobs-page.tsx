import { useState } from 'react';
import { useDemo } from './model/demo-store';
import type { Job } from './model/types';
import { JobTable } from './components/job-table';
import { JobEditor } from './components/job-editor';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { NativeSelect } from '@/shared/ui/native-select';
import { number } from '@/shared/lib/format';

export function TechnicianJobsPage() {
  const { technicians, jobs } = useDemo();
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
        <NativeSelect
          aria-label="فیلتر تعمیرکار"
          value={technicianId}
          onChange={(event) => setTechnicianId(event.target.value)}
        >
          <option value="all">همه تعمیرکاران</option>
          {technicians.map((tech) => (
            <option value={tech.id} key={tech.id}>
              {tech.name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="فیلتر وضعیت سفارش"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">همه سفارش‌های باز</option>
          <option value="new">در انتظار اعزام</option>
          <option value="scheduled">برنامه‌ریزی‌شده</option>
          <option value="working">در حال انجام</option>
        </NativeSelect>
      </div>
      <Panel title="سفارش‌های تخصیص‌یافته" subtitle={`${number(active.length)} سفارش باز`}>
        <JobTable jobs={active} onSelect={setSelected} />
      </Panel>
      {selected ? <JobEditor job={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
