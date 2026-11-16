import { useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { statusLabels, type Job } from './model/types';
import { JobEditor } from './components/job-editor';
import { JobTable } from './components/job-table';
import { PageHeading, Panel } from '@/shared/ui/primitives';
import { number } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';

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
          <Button className="button button-primary" onClick={() => setEditor('new')}>
            <Plus size={18} />
            ثبت درخواست
          </Button>
        }
      />
      <Panel title="لیست درخواست‌ها" subtitle={`${number(filtered.length)} درخواست در این نمایش`}>
        <div className="table-toolbar">
          <Label className="search-field">
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label="جستجوی درخواست"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی مشتری، دستگاه یا کد درخواست…"
            />
          </Label>
          <Label className="filter-field">
            <SlidersHorizontal size={17} />
            <NativeSelect
              aria-label="فیلتر وضعیت"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </Label>
        </div>
        <JobTable jobs={filtered} onSelect={setEditor} />
      </Panel>
      {editor && (
        <JobEditor job={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />
      )}
    </>
  );
}
