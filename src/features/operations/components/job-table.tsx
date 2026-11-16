import { ArrowUpLeft, WashingMachine, Refrigerator, Wind, CookingPot } from 'lucide-react';
import { useDemo } from '../model/demo-store';
import { statusLabels, type Job } from '../model/types';
import { dateLabel, money } from '@/shared/lib/format';
import { EmptyState } from '@/shared/ui/primitives';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <Table className="table-scroll">
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
                <div className="device-cell">
                  <span className="device-icon">
                    <ApplianceIcon appliance={job.appliance} />
                  </span>
                  <div>
                    <strong>
                      {job.appliance} {job.brand}
                    </strong>
                    <small className="latin">{job.id}</small>
                  </div>
                  {job.priority === 'urgent' && <span className="urgent-dot" title="فوری" />}
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
                  <span className="muted">تخصیص داده نشده</span>
                )}
              </TableCell>
              <TableCell>
                {dateLabel(job.date)}
                <small className="latin">{job.time}</small>
              </TableCell>
              <TableCell>
                <Badge className={`badge status-${job.status}`}>
                  <i />
                  {statusLabels[job.status]}
                </Badge>
              </TableCell>
              <TableCell className="nowrap">{job.total ? money(job.total) : 'تعیین نشده'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="icon-button"
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
