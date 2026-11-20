import { useSharedTranslation } from '@/shared/hooks';
import { useRequestsPageTranslation } from '../hooks/use-requests-page-translation';
import { translateLabel } from '../../../shared/i18n/index';
import { useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useDemo, statusLabels, type Job } from '@/entities/service';

import { JobEditor, JobTable } from '@/features/requests';

import { PageHeading, Panel } from '@/shared/ui/primitives';

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

export function RequestsPage() {
  const t = useRequestsPageTranslation();
  const tShared = useSharedTranslation();
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const filtered = jobs.filter(
    (job) =>
      (status === 'all' || job.status === status) &&
      `${job.id} ${translateLabel(job.appliance)} ${translateLabel(job.brand)} ${translateLabel(job.issue)} ${translateLabel(customers.find((customer) => customer.id === job.customerId)?.name ?? '')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title={t('navigation.serviceRequests')}
        description={t('list.followEachRequestFromTheFirstCallTo')}
        action={
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:[&:hover]:bg-primary"
            onClick={() => setEditor('new')}
          >
            <Plus size={18} />
            {t('list.createRequest')}
          </Button>
        }
      />
      <Panel
        title={t('list.requestList')}
        subtitle={t('list.lengthRequestsInThisView', { length: filtered.length })}
      >
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <Label className="flex w-85 max-w-full items-center gap-2.5 rounded-md border border-border py-0 px-2.75 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-2.75 [&_input]:px-0 [&_input]:outline-hidden dark:border-border dark:bg-muted dark:text-primary-foreground">
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label={t('list.searchRequests')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('list.searchCustomerApplianceOrRequestId')}
            />
          </Label>
          <div className="flex items-center gap-1.75 text-muted-foreground">
            <SlidersHorizontal aria-hidden="true" size={17} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger aria-label={t('list.filterByStatus')} size="sm" className="min-w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{tShared('filters.allStatuses')}</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {translateLabel(label)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <JobTable jobs={filtered} onSelect={setEditor} />
      </Panel>
      {editor && (
        <JobEditor job={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />
      )}
    </>
  );
}
