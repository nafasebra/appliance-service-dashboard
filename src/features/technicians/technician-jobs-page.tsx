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

import { useTranslation } from 'react-i18next';

export function TechnicianJobsPage() {
  const { t } = useTranslation();
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
        title={t('ui.techniciansActiveOrders')}
        description={t('ui.trackAssignedOpenOrdersVisitTimesAndProgress')}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={technicianId} onValueChange={(value) => setTechnicianId(value)}>
          <SelectTrigger className="w-full" aria-label={t('ui.filterByTechnician')}>
            <SelectValue placeholder={t('ui.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('ui.allTechnicians')}</SelectItem>
              {technicians.map((tech) => (
                <SelectItem value={tech.id} key={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label={t('ui.filterByOrderStatus')}>
            <SelectValue placeholder={t('ui.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('ui.allOpenOrders')}</SelectItem>
              <SelectItem value="new">{t('ui.awaitingDispatch')}</SelectItem>
              <SelectItem value="scheduled">{t('ui.scheduled')}</SelectItem>
              <SelectItem value="working">{t('ui.inProgress')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel
        title={t('ui.assignedOrders')}
        subtitle={t('ui.lengthOpenOrders', { length: active.length })}
      >
        <JobTable jobs={active} onSelect={setSelected} />
      </Panel>
      {selected ? <JobEditor job={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
