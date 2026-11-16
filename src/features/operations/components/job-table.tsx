import { cn } from '@/shared/lib/utils';
import { ArrowUpLeft, WashingMachine, Refrigerator, Wind, CookingPot } from 'lucide-react';
import { useDemo } from '../model/demo-store';
import { statusLabels, type Job } from '../model/types';
import { dateLabel, money } from '@/shared/lib/format';
import { EmptyState } from '@/shared/ui/primitives';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function ApplianceIcon({ appliance }: { appliance: string }) {
  const Icon =
    appliance === 'یخچال'
      ? Refrigerator
      : appliance === 'کولر گازی'
        ? Wind
        : appliance === 'اجاق گاز'
          ? CookingPot
          : WashingMachine;
  return <Icon size={20} strokeWidth={1.6} />;
}

export function JobTable({ jobs, onSelect }: { jobs: Job[]; onSelect: (job: Job) => void }) {
  const { customers, technicians } = useDemo();
  if (!jobs.length) return <EmptyState />;
  return (
    <Table className="overflow-auto">
      <TableHeader>
        <TableRow>
          <TableHead>درخواست / دستگاه</TableHead>
          <TableHead>مشتری</TableHead>
          <TableHead>تعمیرکار</TableHead>
          <TableHead>زمان مراجعه</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>مبلغ خدمت</TableHead>
          <TableHead>
            <span className="sr-only">جزئیات</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>
              <div className="flex gap-2.5 items-center min-w-[135px]">
                <span className="w-[34px] h-[36px] border border-[#eaf0e8] rounded-[8px] bg-[#f7f9f5] grid place-items-center text-[#84957d] shrink-0 dark:bg-[#202e28] dark:border-[#31433a] dark:text-[#8eb19d]">
                  <ApplianceIcon appliance={job.appliance} />
                </span>
                <div>
                  <strong>
                    {job.appliance} {job.brand}
                  </strong>
                  <small className="direction-ltr text-start font-[Arial,_sans-serif] tracking-[0.3px]">
                    {job.id}
                  </small>
                </div>
                {job.priority === 'urgent' && (
                  <span className="w-[5px] h-[5px] rounded-full bg-[#d19b69]" title="فوری" />
                )}
              </div>
            </TableCell>
            <TableCell>
              <strong>{customers.find((item) => item.id === job.customerId)?.name}</strong>
              <small>
                {customers.find((item) => item.id === job.customerId)?.address.split('،')[1]}
              </small>
            </TableCell>
            <TableCell>
              {technicians.find((item) => item.id === job.technicianId)?.name ?? (
                <span className="text-[#9ba49e]">تخصیص داده نشده</span>
              )}
            </TableCell>
            <TableCell>
              {dateLabel(job.date)}
              <small className="direction-ltr text-start font-[Arial,_sans-serif] tracking-[0.3px]">
                {job.time}
              </small>
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] whitespace-nowrap [&_i]:size-1 [&_i]:rounded-full [&_i]:bg-current',
                  job.status === 'new' && 'bg-status-new text-status-new-foreground',
                  job.status === 'scheduled' &&
                    'bg-status-scheduled text-status-scheduled-foreground',
                  job.status === 'working' && 'bg-status-working text-status-working-foreground',
                  job.status === 'completed' &&
                    'bg-status-completed text-status-completed-foreground',
                  job.status === 'cancelled' &&
                    'bg-status-cancelled text-status-cancelled-foreground',
                )}
              >
                <i />
                {statusLabels[job.status]}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {job.total ? money(job.total) : 'تعیین نشده'}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon-sm"
                className="grid place-items-center h-[31px] w-[31px] border border-transparent rounded-[6px] text-[#89998c] bg-transparent shrink-0 [&:hover]:bg-[#f0f5ef] [&:hover]:border-[#e3ebe1] dark:[&:hover]:bg-[#1c2a24] dark:[&:hover]:border-[#35483f]"
                aria-label={`جزئیات ${job.id}`}
                onClick={() => onSelect(job)}
              >
                <ArrowUpLeft size={18} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
