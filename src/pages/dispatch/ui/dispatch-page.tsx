import { JobStatus, type Job, JobStatusBadge, useDemo } from '@/entities/service';
import { useDispatchTranslation } from '../hooks/use-dispatch-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';

import { cn } from '@/shared/lib';
import { useState } from 'react';
import { Clock3, MapPin, Plus } from 'lucide-react';

import { JobEditor } from '@/features/requests';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';

export function DispatchPage() {
  const t = useDispatchTranslation();

  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const technicians = useDemo((state) => state.technicians);
  const [date, setDate] = useState('2026-11-16');
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const visits = jobs.filter((job) => job.date === date && job.status !== JobStatus.Cancelled);

  return (
    <>
      <PageHeading
        title={t('navigation.schedulingAndDispatch')}
        description={t('schedule.viewEachTechnicianSVisitScheduleAndAssign')}
        action={
          <Label className="flex flex-col gap-1.75 text-muted-foreground">
            {t('schedule.scheduleDate')}
            <JalaliDatePicker
              aria-label={t('schedule.dispatchScheduleDate')}
              value={date}
              onValueChange={setDate}
            />
          </Label>
        }
      />
      <div className="flex gap-2.5 items-center py-4 px-4.75 border border-border rounded-md text-muted-foreground bg-accent text-body mb-6 [&_button]:ms-auto max-mobile:flex-wrap max-mobile:leading-loose max-mobile:[&_>_span]:flex-1 max-mobile:[&_button]:ms-7.5 dark:bg-accent dark:border-border">
        <Clock3 size={20} />
        <span>{t('schedule.summary', { count: visits.length })}</span>
        <Button
          variant="link"
          className="inline-flex gap-1.75 items-center text-primary border-0 bg-none whitespace-nowrap"
          onClick={() => setEditor('new')}
        >
          <Plus size={16} />
          {t('common.newRequest')}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4.5 items-start max-desktop:grid-cols-2 max-mobile:grid-cols-1">
        {[
          {
            id: '',
            name: t('common.unassigned'),
            specialty: t('schedule.chooseATechnicianForTheseRequests'),
          },
          ...technicians,
        ].map((tech) => {
          const assigned = visits
            .filter((job) => job.technicianId === tech.id)
            .sort((a, b) => a.time.localeCompare(b.time));
          return (
            <Panel
              key={tech.id}
              title={translateLabel(tech.name)}
              subtitle={translateLabel(tech.specialty)}
              action={
                <Badge
                  variant="secondary"
                  className="text-caption bg-accent py-1 px-2 rounded-md text-muted-foreground dark:bg-accent dark:text-primary"
                >
                  {assigned.length}
                </Badge>
              }
            >
              <div className="pt-0 px-3.75 pb-3.75 min-h-37.5">
                {assigned.length ? (
                  assigned.map((job) => (
                    <Card
                      key={job.id}
                      className={cn(
                        'mt-3 gap-0 overflow-hidden rounded-md border-border bg-muted py-0 shadow-none transition-colors hover:bg-accent dark:border-border dark:bg-muted dark:hover:bg-accent',
                        job.priority === 'urgent' && 'border-s-2 border-s-destructive',
                      )}
                    >
                      <CardContent className="p-0">
                        <Button
                          variant="ghost"
                          className="h-auto w-full flex-col items-stretch gap-0 rounded-none p-4 text-start whitespace-normal hover:bg-transparent hover:text-foreground"
                          onClick={() => setEditor(job)}
                        >
                          <div className="flex items-center gap-1.75 text-body text-muted-foreground [&_.badge]:ms-auto [&_.badge]:text-caption">
                            <Clock3 size={15} />
                            <span className="direction-ltr text-start font-latin tracking-normal">
                              {job.time}
                            </span>
                            <JobStatusBadge status={job.status} />
                          </div>
                          <h3 className="mt-4.25 mb-2 text-body font-semibold text-primary">
                            {translateLabel(job.appliance)} {translateLabel(job.brand)}
                          </h3>
                          <p className="text-body text-muted-foreground">
                            {translateLabel(
                              customers.find((item) => item.id === job.customerId)?.name ?? '',
                            )}
                          </p>
                          <small className="mt-3 flex items-start gap-1.25 text-caption leading-loose text-muted-foreground">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            {translateLabel(
                              customers.find((item) => item.id === job.customerId)?.address ?? '',
                            )}
                          </small>
                          <div className="mt-3.5 w-full border-t border-dashed border-border pt-2.75 text-caption text-muted-foreground">
                            {translateLabel(job.issue)}
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <EmptyState text={t('schedule.noVisitsScheduledForThisDay')} />
                )}
              </div>
            </Panel>
          );
        })}
      </div>
      {editor && (
        <JobEditor job={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />
      )}
    </>
  );
}
