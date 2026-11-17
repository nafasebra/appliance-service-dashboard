import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { Clock3, MapPin, Plus } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
import { statusLabels, type Job } from '@/entities/service/model/types';
import { JobEditor } from '@/features/requests/job-components';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { number } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { JalaliDatePicker } from '@/shared/ui/date-time-picker';

export function DispatchPage() {
  const { jobs, customers, technicians } = useDemo();
  const [date, setDate] = useState('2026-11-16');
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const visits = jobs.filter((job) => job.date === date && job.status !== 'cancelled');
  return (
    <>
      <PageHeading
        title="برنامه‌ریزی و اعزام"
        description="برنامه مراجعه هر تعمیرکار را ببینید و درخواست‌ها را تخصیص دهید."
        action={
          <Label className="flex flex-col gap-1.75 text-2xs text-muted-foreground">
            تاریخ برنامه
            <JalaliDatePicker
              aria-label="تاریخ برنامه اعزام"
              value={date}
              onValueChange={setDate}
            />
          </Label>
        }
      />
      <div className="flex gap-2.5 items-center py-4 px-4.75 border border-border rounded-md text-muted-foreground bg-accent text-ui mb-6 [&_button]:ms-auto max-mobile:flex-wrap max-mobile:leading-loose max-mobile:[&_>_span]:flex-1 max-mobile:[&_button]:ms-7.5 dark:bg-accent dark:border-border">
        <Clock3 size={20} />
        <span>
          نمای برنامه روزانه · {number(visits.length)} مراجعه · ساعت‌ها بر اساس زمان محلی تهران در
          این نمونه
        </span>
        <Button
          variant="link"
          className="inline-flex gap-1.75 items-center text-primary text-2xs border-0 bg-none whitespace-nowrap"
          onClick={() => setEditor('new')}
        >
          <Plus size={16} />
          درخواست جدید
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4.5 items-start max-desktop:grid-cols-2 max-mobile:grid-cols-1">
        {[
          { id: '', name: 'بدون تخصیص', specialty: 'برای این درخواست‌ها تعمیرکار انتخاب کنید' },
          ...technicians,
        ].map((tech) => {
          const assigned = visits
            .filter((job) => job.technicianId === tech.id)
            .sort((a, b) => a.time.localeCompare(b.time));
          return (
            <Panel
              key={tech.id}
              title={tech.name}
              subtitle={tech.specialty}
              action={
                <Badge
                  variant="secondary"
                  className="text-2xs bg-accent py-1 px-2 rounded-md text-muted-foreground dark:bg-accent dark:text-primary"
                >
                  {number(assigned.length)}
                </Badge>
              }
            >
              <div className="pt-0 px-3.75 pb-3.75 min-h-37.5">
                {assigned.length ? (
                  assigned.map((job) => (
                    <Button
                      variant="outline"
                      key={job.id}
                      className={cn(
                        'mt-3 block h-auto w-full rounded-md border border-border bg-muted p-4 text-start whitespace-normal hover:bg-accent [&_h3]:mt-4.25 [&_h3]:mx-0 [&_h3]:mb-2 [&_h3]:text-body [&_h3]:text-primary [&_p]:text-ui [&_p]:text-muted-foreground [&_small]:mt-3 [&_small]:flex [&_small]:items-start [&_small]:gap-1.25 [&_small]:text-3xs [&_small]:leading-loose [&_small]:text-muted-foreground [&_small_svg]:mt-0.5 [&_small_svg]:shrink-0 dark:border-border dark:bg-muted dark:text-primary-foreground dark:hover:bg-accent dark:[&_h3]:text-primary',
                        job.priority === 'urgent' && 'border-s-0.75 border-s-border',
                      )}
                      onClick={() => setEditor(job)}
                    >
                      <div className="flex items-center gap-1.75 text-ui text-muted-foreground [&_.badge]:ms-auto [&_.badge]:text-4xs">
                        <Clock3 size={15} />
                        <span className="direction-ltr text-start font-latin tracking-normal">
                          {job.time}
                        </span>
                        <Badge
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
                            job.status === 'new' && 'bg-status-new text-status-new-foreground',
                            job.status === 'scheduled' &&
                              'bg-status-scheduled text-status-scheduled-foreground',
                            job.status === 'working' &&
                              'bg-status-working text-status-working-foreground',
                            job.status === 'completed' &&
                              'bg-status-completed text-status-completed-foreground',
                            job.status === 'cancelled' &&
                              'bg-status-cancelled text-status-cancelled-foreground',
                          )}
                        >
                          {statusLabels[job.status]}
                        </Badge>
                      </div>
                      <h3>
                        {job.appliance} {job.brand}
                      </h3>
                      <p>{customers.find((item) => item.id === job.customerId)?.name}</p>
                      <small>
                        <MapPin size={14} />
                        {customers.find((item) => item.id === job.customerId)?.address}
                      </small>
                      <div className="text-2xs text-muted-foreground mt-3.5 pt-2.75 border-t border-dashed border-t-border dark:border-border">
                        {job.issue}
                      </div>
                    </Button>
                  ))
                ) : (
                  <EmptyState text="مراجعه‌ای برای این روز ثبت نشده است." />
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
