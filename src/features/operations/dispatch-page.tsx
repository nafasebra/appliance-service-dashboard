import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { Clock3, MapPin, Plus } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { statusLabels, type Job } from './model/types';
import { JobEditor } from './components/job-editor';
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
          <Label className="flex flex-col gap-[7px] text-[10px] text-[#8b9785]">
            تاریخ برنامه
            <JalaliDatePicker
              aria-label="تاریخ برنامه اعزام"
              value={date}
              onValueChange={setDate}
            />
          </Label>
        }
      />
      <div className="flex gap-2.5 items-center p-[16px_19px] border border-[#dfe8d8] rounded-[9px] text-[#7a8e6e] bg-[#f1f6ec] text-[11px] mb-6 [&_button]:ms-auto max-[761px]:flex-wrap max-[761px]:leading-[2] max-[761px]:[&_>_span]:flex-1 max-[761px]:[&_button]:ms-[30px] dark:bg-[#1d2d25] dark:border-[#2c4136]">
        <Clock3 size={20} />
        <span>
          نمای برنامه روزانه · {number(visits.length)} مراجعه · ساعت‌ها بر اساس زمان محلی تهران در
          این نمونه
        </span>
        <Button
          variant="link"
          className="inline-flex gap-[7px] items-center text-[#5d8167] text-[10px] border-0 bg-none whitespace-nowrap"
          onClick={() => setEditor('new')}
        >
          <Plus size={16} />
          درخواست جدید
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4.5 items-start max-[1201px]:grid-cols-2 max-[761px]:grid-cols-1">
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
                  className="text-[10px] bg-[#edf3e8] p-[4px_8px] rounded-[6px] text-[#819171] dark:bg-[#263b31] dark:text-[#8fc4a9]"
                >
                  {number(assigned.length)}
                </Badge>
              }
            >
              <div className="p-[0_15px_15px] min-h-[150px]">
                {assigned.length ? (
                  assigned.map((job) => (
                    <Button
                      variant="outline"
                      key={job.id}
                      className={cn(
                        'mt-3 block h-auto w-full rounded-[9px] border border-[#e0e8d9] bg-[#fcfdf9] p-4 text-start whitespace-normal hover:bg-[#f3f7ed] [&_h3]:m-[17px_0_8px] [&_h3]:text-[13px] [&_h3]:text-[#536d47] [&_p]:text-[11px] [&_p]:text-[#8b9981] [&_small]:mt-3 [&_small]:flex [&_small]:items-start [&_small]:gap-[5px] [&_small]:text-[9px] [&_small]:leading-[2] [&_small]:text-[#9ca68f] [&_small_svg]:mt-[2px] [&_small_svg]:shrink-0 dark:border-[#2c4036] dark:bg-[#19251f] dark:text-[#d5e2db] dark:hover:bg-[#203129] dark:[&_h3]:text-[#b8d8c7]',
                        job.priority === 'urgent' && 'border-s-[3px] border-s-[#c4a36c]',
                      )}
                      onClick={() => setEditor(job)}
                    >
                      <div className="flex items-center gap-[7px] text-[11px] text-[#9aa68f] [&_.badge]:ms-auto [&_.badge]:text-[8px]">
                        <Clock3 size={15} />
                        <span className="direction-ltr text-start font-[Arial,_sans-serif] tracking-[0.3px]">
                          {job.time}
                        </span>
                        <Badge
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] whitespace-nowrap',
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
                      <div className="text-[10px] text-[#7e8b71] mt-3.5 pt-[11px] border-t border-dashed border-t-[#dee6d3] dark:border-border">
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
