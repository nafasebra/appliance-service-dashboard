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
import { NativeSelect } from '@/shared/ui/native-select';

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
            className="inline-flex justify-center items-center gap-2 bg-white border border-[#dfe6e1] rounded-[7px] p-[10px_15px] text-[#56625a] text-[11px] leading-[1.7] whitespace-nowrap [&:hover]:bg-[#f0f4f1] dark:bg-[#1c2823] dark:border-[#33453d] dark:text-[#dce7e1] bg-primary text-white border-primary shadow-[0_3px_5px_#246b5510] [&:hover]:bg-(--primary-dark) dark:bg-[#3d8c6d] dark:border-[#3d8c6d] dark:text-[#ffffff] dark:[&:hover]:bg-[#4c9d7d]"
            onClick={() => setEditor('new')}
          >
            <Plus size={18} />
            ثبت درخواست
          </Button>
        }
      />
      <Panel title="لیست درخواست‌ها" subtitle={`${number(filtered.length)} درخواست در این نمایش`}>
        <div className="flex items-center gap-3 p-[0_22px_20px] flex-wrap max-[761px]:px-4.5">
          <Label
            className="flex w-[340px] max-w-full items-center gap-2.5 rounded-[7px] border border-[#e5eae3] p-[0_11px] text-[#99a295] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#73977b] [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-[11px_0] [&_input]:text-[10px] [&_input]:outline-hidden dark:border-[#33453d] dark:bg-[#1c2823] dark:text-[#dce7e1]"
          >
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label="جستجوی درخواست"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی مشتری، دستگاه یا کد درخواست…"
            />
          </Label>
          <Label
            className="flex items-center gap-[7px] text-[#81917d] [&_select]:p-2 [&_select]:text-[10px]"
          >
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
