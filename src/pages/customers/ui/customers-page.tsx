import { useMemo, useState } from 'react';
import { Search, ArrowUpLeft } from 'lucide-react';
import { useDemo, type Job } from '@/entities/service';
import { JobTable, JobEditor } from '@/features/requests';

import { PageHeading, Panel, EmptyState, Modal } from '@/shared/ui/primitives';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { useCustomersTranslation } from '../hooks/use-customers-translation';
import { translateLabel } from '@/shared/i18n';
import { localizeDigits } from '@/shared/lib';

export function CustomersPage() {
  const t = useCustomersTranslation();
  const customers = useDemo((state) => state.customers);
  const jobs = useDemo((state) => state.jobs);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [editor, setEditor] = useState<Job | null>(null);
  const filtered = useMemo(
    () =>
      customers.filter((customer) =>
        `${translateLabel(customer.name)} ${localizeDigits(customer.phone)} ${translateLabel(customer.address)}`.includes(
          query.trim(),
        ),
      ),
    [customers, query],
  );
  const customerColumns = useMemo<DataTableColumn<(typeof filtered)[number]>[]>(
    () => [
      {
        id: 'نام مشتری',
        header: t('columns.name'),
        accessorFn: (customer) => translateLabel(customer.name),
        cell: ({ row: { original: customer } }) => <strong>{translateLabel(customer.name)}</strong>,
      },
      {
        id: 'تلفن',
        header: t('columns.phone'),
        accessorFn: (customer) => localizeDigits(customer.phone),
        cell: ({ row: { original: customer } }) => <bdi>{localizeDigits(customer.phone)}</bdi>,
      },
      {
        id: 'آدرس',
        header: t('columns.address'),
        accessorFn: (customer) => translateLabel(customer.address),
        cell: ({ row: { original: customer } }) => translateLabel(customer.address),
      },
      {
        id: 'تعداد درخواست',
        header: t('columns.requestCount'),
        accessorFn: (customer) => jobs.filter((job) => job.customerId === customer.id).length,
        cell: ({ row: { original: customer } }) =>
          jobs.filter((job) => job.customerId === customer.id).length,
      },
      {
        id: 'سوابق',
        header: t('columns.history'),
        enableSorting: false,
        cell: ({ row: { original: customer } }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            className="grid place-items-center h-7.75 w-7.75 border border-transparent rounded-md text-muted-foreground bg-transparent shrink-0 [&:hover]:bg-accent [&:hover]:border-border dark:[&:hover]:bg-accent dark:[&:hover]:border-border"
            onClick={() => setSelected(customer.id)}
            aria-label={t('history.open', { name: translateLabel(customer.name) })}
          >
            <ArrowUpLeft size={18} />
          </Button>
        ),
      },
    ],
    [jobs, setSelected, t],
  );
  return (
    <>
      <PageHeading title={t('title')} description={t('description')} />
      <Panel
        title={t('directory.title')}
        subtitle={t('directory.count', { count: customers.length })}
      >
        <div className="flex items-center gap-3 pt-0 px-5.5 pb-5 flex-wrap max-mobile:px-4.5">
          <Label className="flex w-85 max-w-full items-center gap-2.5 rounded-md border border-border py-0 px-2.75 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-2.75 [&_input]:px-0 [&_input]:outline-hidden dark:border-border dark:bg-muted dark:text-primary-foreground">
            <Search size={18} />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label={t('search.label')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search.placeholder')}
            />
          </Label>
        </div>
        {filtered.length ? (
          <DataTable
            data={filtered}
            getRowId={(customer) => String(customer.id)}
            columns={customerColumns}
            emptyMessage={null}
          />
        ) : (
          <EmptyState />
        )}
      </Panel>
      {selected && (
        <Modal
          title={t('history.title', {
            name: translateLabel(customers.find((item) => item.id === selected)?.name ?? ''),
          })}
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
