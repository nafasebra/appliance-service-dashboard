import { useSharedTranslation } from '@/shared/hooks';
import { JobStatus, type Technician, useDemo } from '@/entities/service';
import { useTechniciansTranslation } from '../hooks/use-technicians-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { useMemo, useState, type FormEvent } from 'react';
import { getFormText, localizeDigits } from '@/shared/lib';
import { Plus } from 'lucide-react';

import { PageHeading, Panel, Modal, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

export function TechnicianManagementPage() {
  const t = useTechniciansTranslation();
  const tShared = useSharedTranslation();
  const technicians = useDemo((state) => state.technicians);
  const jobs = useDemo((state) => state.jobs);
  const saveTechnician = useDemo((state) => state.saveTechnician);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<Technician | 'new' | null>(null);
  const [error, setError] = useState('');
  const filtered = useMemo(
    () =>
      technicians.filter((tech) =>
        `${translateLabel(tech.name)} ${localizeDigits(tech.phone)} ${translateLabel(tech.specialty)} ${translateLabel(tech.area)}`.includes(
          query.trim(),
        ),
      ),
    [technicians, query, t, tShared],
  );
  const editing = editor && editor !== 'new' ? editor : undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const failure = saveTechnician({
      id: editing?.id ?? crypto.randomUUID(),
      name: getFormText(form, 'name'),
      phone: getFormText(form, 'phone'),
      specialty: getFormText(form, 'specialty'),
      area: getFormText(form, 'area'),
    });
    setError(failure ?? '');
    if (!failure) setEditor(null);
  }

  const technicianColumns = useMemo<DataTableColumn<(typeof filtered)[number]>[]>(
    () => [
      {
        id: 'نام تعمیرکار',
        header: t('management.technicianName'),
        accessorFn: (tech) => translateLabel(tech.name),
        cell: ({ row: { original: tech } }) => translateLabel(tech.name),
      },
      {
        id: 'تلفن',
        header: 'تلفن',
        accessorFn: (tech) => tech.phone,
        cell: ({ row: { original: tech } }) => <bdi>{localizeDigits(tech.phone)}</bdi>,
      },
      {
        id: 'تخصص',
        header: t('management.specialty'),
        accessorFn: (tech) => translateLabel(tech.specialty),
        cell: ({ row: { original: tech } }) => translateLabel(tech.specialty),
      },
      {
        id: 'محدوده',
        header: t('management.serviceArea'),
        accessorFn: (tech) => translateLabel(tech.area),
        cell: ({ row: { original: tech } }) => translateLabel(tech.area),
      },
      {
        id: 'سفارش باز',
        header: t('management.openOrders'),
        accessorFn: (tech) =>
          jobs.filter(
            (job) =>
              job.technicianId === tech.id &&
              ![JobStatus.Completed, JobStatus.Cancelled].includes(job.status),
          ).length,
        cell: ({ row: { original: tech } }) =>
          jobs.filter(
            (job) =>
              job.technicianId === tech.id &&
              ![JobStatus.Completed, JobStatus.Cancelled].includes(job.status),
          ).length,
      },
      {
        id: 'عملیات',
        header: 'عملیات',
        enableSorting: false,
        cell: ({ row: { original: tech } }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError('');
              setEditor(tech);
            }}
          >
            {tShared('actions.edit')}
          </Button>
        ),
      },
    ],
    [jobs, setError, setEditor, t, tShared],
  );
  return (
    <>
      <PageHeading
        title={t('navigation.technicianManagement')}
        description={t('management.teamContactDetailsSpecialtiesAndServiceAreas')}
        action={
          <Button
            onClick={() => {
              setError('');
              setEditor('new');
            }}
          >
            <Plus />
            {t('management.addTechnician')}
          </Button>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        aria-label={t('management.searchTechnicians')}
        placeholder={t('management.namePhoneSpecialtyOrServiceArea')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel
        title={t('management.teamMembers')}
        subtitle={t('management.lengthTechnicians', { length: filtered.length })}
      >
        <DataTable
          data={filtered}
          getRowId={(tech) => String(tech.id)}
          columns={technicianColumns}
          emptyMessage={null}
        />
        {!filtered.length ? <EmptyState /> : null}
      </Panel>
      {editor ? (
        <Modal
          title={editing ? t('management.editTechnician') : t('management.addTechnician')}
          onClose={() => setEditor(null)}
        >
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            <Label className="flex flex-col gap-2">
              {t('management.fullName')}
              <Input
                name="name"
                required
                maxLength={100}
                defaultValue={editing ? translateLabel(editing.name) : undefined}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              {tShared('fields.phone')}
              <Input
                name="phone"
                type="tel"
                dir="ltr"
                required
                maxLength={20}
                defaultValue={editing?.phone}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              {t('management.specialty')}
              <Input
                name="specialty"
                required
                maxLength={150}
                defaultValue={editing ? translateLabel(editing.specialty) : undefined}
                placeholder={t('management.forExampleRefrigeratorAndFreezerRepairs')}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              {t('management.serviceArea')}
              <Input
                name="area"
                required
                maxLength={150}
                defaultValue={editing ? translateLabel(editing.area) : undefined}
              />
            </Label>
            {error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertDescription>{translateLabel(error)}</AlertDescription>
              </Alert>
            ) : null}
            <div className="col-span-full flex gap-2">
              <Button type="submit">{tShared('actions.save')}</Button>
              <Button type="button" variant="outline" onClick={() => setEditor(null)}>
                {tShared('actions.cancel2')}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
