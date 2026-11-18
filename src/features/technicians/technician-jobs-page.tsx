import { useSharedTranslation } from '@/shared/hooks/use-shared-translation';
import { JobStatus, type Job } from '@/entities/service/model/types';
import { useTechniciansTranslation } from './hooks/use-technicians-translation';
import { useState } from 'react';
import { useDemo } from '@/shared/store/demo-store';

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

export function TechnicianJobsPage() {
  const t = useTechniciansTranslation();
  const tShared = useSharedTranslation();
  const technicians = useDemo((state) => state.technicians);
  const jobs = useDemo((state) => state.jobs);
  const [technicianId, setTechnicianId] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Job | null>(null);
  const active = jobs.filter(
    (job) =>
      job.technicianId &&
      [JobStatus.New, JobStatus.Accepted, JobStatus.Scheduled, JobStatus.Working].includes(
        job.status,
      ) &&
      (technicianId === 'all' || job.technicianId === technicianId) &&
      (status === 'all' || job.status === status),
  );
  return (
    <>
      <PageHeading
        title={t('assignments.techniciansActiveOrders')}
        description={t('assignments.trackAssignedOpenOrdersVisitTimesAndProgress')}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={technicianId} onValueChange={(value) => setTechnicianId(value)}>
          <SelectTrigger className="w-full" aria-label={t('assignments.filterByTechnician')}>
            <SelectValue placeholder={tShared('select.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('finance.allTechnicians')}</SelectItem>
              {technicians.map((tech) => (
                <SelectItem value={tech.id} key={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label={t('assignments.filterByOrderStatus')}>
            <SelectValue placeholder={tShared('select.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('assignments.allOpenOrders')}</SelectItem>
              <SelectItem value="new">{t('common.awaitingDispatch')}</SelectItem>
              <SelectItem value="scheduled">{t('assignments.scheduled')}</SelectItem>
              <SelectItem value="working">{t('common.inProgress')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel
        title={t('assignments.assignedOrders')}
        subtitle={t('assignments.lengthOpenOrders', { length: active.length })}
      >
        <JobTable jobs={active} onSelect={setSelected} />
      </Panel>
      {selected ? <JobEditor job={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
