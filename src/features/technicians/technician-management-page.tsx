import { translateLabel } from '@/shared/i18n';
import { useMemo, useState, type FormEvent } from 'react';
import { getFormText } from '@/shared/utils/form';
import { Plus } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import type { Technician } from '@/entities/service/model/types';
import { PageHeading, Panel, Modal, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

import { useTranslation } from 'react-i18next';

export function TechnicianManagementPage() {
  const { t } = useTranslation();
  const technicians = useDemo((state) => state.technicians);
  const jobs = useDemo((state) => state.jobs);
  const saveTechnician = useDemo((state) => state.saveTechnician);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<Technician | 'new' | null>(null);
  const [error, setError] = useState('');
  const filtered = useMemo(
    () =>
      technicians.filter((tech) =>
        `${tech.name} ${tech.phone} ${tech.specialty} ${tech.area}`.includes(query.trim()),
      ),
    [technicians, query, t],
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
        header: 'نام تعمیرکار',
        accessorFn: (tech) => tech.name,
      },
      {
        id: 'تلفن',
        header: 'تلفن',
        accessorFn: (tech) => tech.phone,
        cell: ({ row: { original: tech } }) => <bdi>{tech.phone}</bdi>,
      },
      {
        id: 'تخصص',
        header: 'تخصص',
        accessorFn: (tech) => tech.specialty,
      },
      {
        id: 'محدوده',
        header: 'محدوده',
        accessorFn: (tech) => tech.area,
      },
      {
        id: 'سفارش باز',
        header: 'سفارش باز',
        accessorFn: (tech) =>
          jobs.filter(
            (job) =>
              job.technicianId === tech.id && !['completed', 'cancelled'].includes(job.status),
          ).length,
        cell: ({ row: { original: tech } }) =>
          jobs.filter(
            (job) =>
              job.technicianId === tech.id && !['completed', 'cancelled'].includes(job.status),
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
            {t('ui.edit')}
          </Button>
        ),
      },
    ],
    [jobs, setError, setEditor, t],
  );
  return (
    <>
      <PageHeading
        title={t('ui.technicianManagement')}
        description={t('ui.teamContactDetailsSpecialtiesAndServiceAreas')}
        action={
          <Button
            onClick={() => {
              setError('');
              setEditor('new');
            }}
          >
            <Plus />
            {t('ui.addTechnician')}
          </Button>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        aria-label={t('ui.searchTechnicians')}
        placeholder={t('ui.namePhoneSpecialtyOrServiceArea')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel
        title={t('ui.teamMembers')}
        subtitle={t('ui.lengthTechnicians', { length: filtered.length })}
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
          title={editing ? t('ui.editTechnician') : t('ui.addTechnician')}
          onClose={() => setEditor(null)}
        >
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            <Label className="flex flex-col gap-2">
              {t('ui.fullName')}
              <Input name="name" required maxLength={100} defaultValue={editing?.name} />
            </Label>
            <Label className="flex flex-col gap-2">
              {t('ui.phone')}
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
              {t('ui.specialty')}
              <Input
                name="specialty"
                required
                maxLength={150}
                defaultValue={editing?.specialty}
                placeholder={t('ui.forExampleRefrigeratorAndFreezerRepairs')}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              {t('ui.serviceArea')}
              <Input name="area" required maxLength={150} defaultValue={editing?.area} />
            </Label>
            {error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertDescription>{translateLabel(error)}</AlertDescription>
              </Alert>
            ) : null}
            <div className="col-span-full flex gap-2">
              <Button type="submit">{t('ui.save')}</Button>
              <Button type="button" variant="outline" onClick={() => setEditor(null)}>
                {t('ui.cancel2')}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
