import { useState } from 'react';
import { Clock3, MapPin, Plus } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { statusLabels, type Job } from './model/types';
import { JobEditor } from './components/job-editor';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { number } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <Label className="date-control">
            تاریخ برنامه
            <Input
              aria-label="تاریخ برنامه اعزام"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Label>
        }
      />
      <div className="dispatch-notice">
        <Clock3 size={20} />
        <span>
          نمای برنامه روزانه · {number(visits.length)} مراجعه · ساعت‌ها بر اساس زمان محلی تهران در
          این نمونه
        </span>
        <Button variant="link" className="text-link" onClick={() => setEditor('new')}>
          <Plus size={16} />
          درخواست جدید
        </Button>
      </div>
      <div className="dispatch-grid">
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
                <Badge variant="secondary" className="count-badge">
                  {number(assigned.length)}
                </Badge>
              }
            >
              <div className="dispatch-column">
                {assigned.length ? (
                  assigned.map((job) => (
                    <Button
                      variant="outline"
                      key={job.id}
                      className={`visit-card ${job.priority === 'urgent' ? 'visit-urgent' : ''}`}
                      onClick={() => setEditor(job)}
                    >
                      <div className="visit-time">
                        <Clock3 size={15} />
                        <span className="latin">{job.time}</span>
                        <Badge className={`badge status-${job.status}`}>
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
                      <div className="visit-issue">{job.issue}</div>
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
