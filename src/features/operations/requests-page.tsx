import { useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { statusLabels, type Job } from './model/types';
import { JobEditor } from './components/job-editor';
import { JobTable } from './components/job-table';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { number } from '@/shared/lib/format';
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
  const { jobs, customers } = useDemo();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editor, setEditor] = useState<Job | 'new' | null>(null);
  const filtered = jobs.filter(
    (job) =>
      (status === 'all' || job.status === status) &&
      `${job.id} ${job.appliance} ${job.brand} ${customers.find((customer) => customer.id === job.customerId)?.name}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title="درخواست‌های خدمات"
        description="از اولین تماس تا پایان تعمیر، جریان کار را دنبال کنید."
        action={
          <Button
            className="inline-flex justify-center items-center gap-2 bg-white border border-border rounded-md py-2.5 px-3.75 text-muted-foreground text-ui leading-relaxed whitespace-nowrap [&:hover]:bg-accent dark:bg-muted dark:border-border dark:text-primary-foreground bg-primary text-white border-primary shadow-xs [&:hover]:bg-(--primary-dark) dark:bg-primary dark:border-border dark:text-primary-foreground dark:[&:hover]:bg-primary"
            onClick={() => setEditor('new')}
          >
            <Plus size={18} />
            ثبت درخواست
          </Button>
        }
      />
      <Panel title="لیست درخواست‌ها" subtitle={`${number(filtered.length)} درخواست در این نمایش`}>
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <Label className="flex w-85 max-w-full items-center gap-2.5 rounded-md border border-border py-0 px-2.75 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-2.75 [&_input]:px-0 [&_input]:text-2xs [&_input]:outline-hidden dark:border-border dark:bg-muted dark:text-primary-foreground">
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label="جستجوی درخواست"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی مشتری، دستگاه یا کد درخواست…"
            />
          </Label>
          <div className="flex items-center gap-1.75 text-muted-foreground">
            <SlidersHorizontal aria-hidden="true" size={17} />
            <Select value={status} onValueChange={setStatus} dir="rtl">
              <SelectTrigger aria-label="فیلتر وضعیت" size="sm" className="min-w-36 text-2xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
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
