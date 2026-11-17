import { useState } from 'react';
import { Search, ArrowUpLeft } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
import { JobTable, JobEditor } from '@/features/requests/job-components';
import type { Job } from '@/entities/service/model/types';
import { PageHeading, Panel, EmptyState, Modal } from '@/shared/ui/primitives';
import { number } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

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
