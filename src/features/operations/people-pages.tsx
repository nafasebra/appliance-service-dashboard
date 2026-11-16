import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { Search, Phone, MapPin, Wrench, ArrowUpLeft } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import { JobTable } from './components/job-table';
import { JobEditor } from './components/job-editor';
import type { Job } from './model/types';
import { PageHeading, Panel, EmptyState, Modal } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function TechniciansPage() {
  const { jobs, transactions, technicians } = useDemo();
  return (
    <>
      <PageHeading title="تعمیرکاران" description="تخصص، محدوده فعالیت و حساب خدمات هر عضو تیم." />
      <div className="grid grid-cols-3 gap-5 max-desktop:grid-cols-2 max-mobile:grid-cols-1">
        {technicians.map((tech, index) => {
          const assigned = jobs.filter((job) => job.technicianId === tech.id);
          const active = assigned.filter((job) => !['completed', 'cancelled'].includes(job.status));
          const finance = summarizeFinance(
            assigned,
            transactions.filter((item) => assigned.some((job) => job.id === item.jobId)),
          );
          return (
            <Card
              className="bg-white border border-border rounded-lg p-6.25 dark:bg-card dark:border-border dark:text-foreground gap-0 py-0"
              key={tech.id}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-full bg-secondary text-base text-secondary-foreground',
                    index % 4 === 1 && 'bg-accent text-accent-foreground',
                    index % 4 === 2 && 'bg-muted text-muted-foreground',
                    index % 4 === 3 && 'bg-primary/15 text-primary',
                  )}
                >
                  {tech.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <Badge
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
                    active.length
                      ? 'bg-status-working text-status-working-foreground'
                      : 'bg-status-completed text-status-completed-foreground',
                  )}
                >
                  {active.length ? `${number(active.length)} درخواست باز` : 'بدون درخواست باز'}
                </Badge>
              </div>
              <h2>{tech.name}</h2>
              <p>
                <Wrench size={15} />
                {tech.specialty}
              </p>
              <p>
                <MapPin size={15} />
                {tech.area}
              </p>
              <a
                className="my-3 flex items-center gap-2 text-muted-foreground"
                href={`tel:${tech.phone.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))}`}
              >
                <Phone size={15} />
                <bdi>{tech.phone}</bdi>
              </a>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 [&_small]:text-2xs [&_small]:text-muted-foreground [&_strong]:mt-2 [&_strong]:block [&_strong]:text-sm [&_strong]:text-primary">
                <div>
                  <small>خدمات تکمیل‌شده</small>
                  <strong>
                    {number(assigned.filter((job) => job.status === 'completed').length)}
                  </strong>
                </div>
                <div>
                  <small>مانده قابل پرداخت</small>
                  <strong>{money(finance.payable)}</strong>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-5 text-2xs leading-8 text-muted-foreground">
        مانده تعمیرکار فقط از خدمات تکمیل‌شده و پرداخت‌های ثبت‌شده محاسبه می‌شود؛ این صفحه وضعیت
        زنده حضور یا موقعیت مکانی نیست.
      </p>
    </>
  );
}

export function CustomersPage() {
  const { customers, jobs } = useDemo();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [editor, setEditor] = useState<Job | null>(null);
  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.phone} ${customer.address}`.includes(query.trim()),
  );
  return (
    <>
      <PageHeading
        title="مشتریان"
        description="اطلاعات تماس، آدرس و سوابق خدمات مشتریان در یک جا."
      />
      <Panel title="دفتر مشتریان" subtitle={`${number(customers.length)} مشتری نمونه`}>
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <Label className="flex w-85 max-w-full items-center gap-2.5 rounded-md border border-border py-0 px-2.75 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-2.75 [&_input]:px-0 [&_input]:text-2xs [&_input]:outline-hidden dark:border-border dark:bg-muted dark:text-primary-foreground">
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label="جستجوی مشتری"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی نام، تلفن یا آدرس…"
            />
          </Label>
        </div>
        {filtered.length ? (
          <Table className="overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead>نام مشتری</TableHead>
                <TableHead>تلفن</TableHead>
                <TableHead>آدرس</TableHead>
                <TableHead>تعداد درخواست</TableHead>
                <TableHead>سوابق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <strong>{customer.name}</strong>
                  </TableCell>
                  <TableCell>
                    <bdi>{customer.phone}</bdi>
                  </TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    {number(jobs.filter((job) => job.customerId === customer.id).length)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="grid place-items-center h-7.75 w-7.75 border border-transparent rounded-md text-muted-foreground bg-transparent shrink-0 [&:hover]:bg-accent [&:hover]:border-border dark:[&:hover]:bg-accent dark:[&:hover]:border-border"
                      onClick={() => setSelected(customer.id)}
                      aria-label={`سوابق ${customer.name}`}
                    >
                      <ArrowUpLeft size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState />
        )}
      </Panel>
      {selected && (
        <Modal
          title={`سوابق ${customers.find((item) => item.id === selected)?.name}`}
          onClose={() => setSelected(null)}
        >
          <JobTable
            jobs={jobs.filter((job) => job.customerId === selected)}
            onSelect={(job) => {
              setSelected(null);
              setEditor(job);
            }}
          />
        </Modal>
      )}
      {editor && <JobEditor job={editor} onClose={() => setEditor(null)} />}
    </>
  );
}
