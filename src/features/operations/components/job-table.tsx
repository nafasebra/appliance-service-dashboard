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
              <div className="flex gap-2.5 items-center min-w-33.75">
                <span className="w-8.5 h-9 border border-border rounded-md bg-muted grid place-items-center text-muted-foreground shrink-0 dark:bg-muted dark:border-border dark:text-muted-foreground">
                  <ApplianceIcon appliance={job.appliance} />
                </span>
                <div>
                  <strong>
                    {job.appliance} {job.brand}
                  </strong>
                  <small className="direction-ltr text-start font-latin tracking-normal">
                    {job.id}
                  </small>
                </div>
                {job.priority === 'urgent' && (
                  <span className="w-1.25 h-1.25 rounded-full bg-secondary" title="فوری" />
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
                <span className="text-muted-foreground">تخصیص داده نشده</span>
              )}
            </TableCell>
            <TableCell>
              {dateLabel(job.date)}
              <small className="direction-ltr text-start font-latin tracking-normal">
                {job.time}
              </small>
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap [&_i]:size-1 [&_i]:rounded-full [&_i]:bg-current',
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
                className="grid place-items-center h-7.75 w-7.75 border border-transparent rounded-md text-muted-foreground bg-transparent shrink-0 [&:hover]:bg-accent [&:hover]:border-border dark:[&:hover]:bg-accent dark:[&:hover]:border-border"
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
