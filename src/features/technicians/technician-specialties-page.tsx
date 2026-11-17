import { translateLabel } from '@/shared/i18n';
import { useMemo, useState, type FormEvent } from 'react';
import { useDemo } from '@/shared/store/demo-store';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/select';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

import { useTranslation } from 'react-i18next';

export function TechnicianSpecialtiesPage() {
  const { t } = useTranslation();
  const technicians = useDemo((state) => state.technicians);
  const saveTechnician = useDemo((state) => state.saveTechnician);
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const specialties = useMemo(
    () =>
      [...new Set(technicians.map((tech) => tech.specialty))].filter((name) =>
        name.includes(query.trim()),
      ),
    [technicians, query, t],
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const tech = technicians.find((item) => item.id === form.get('technicianId'));
    if (!tech) return;
    const specialty = String(form.get('specialty') ?? '').trim();
    const failure = saveTechnician({ ...tech, specialty });
    setError(failure ?? '');
    setMessage(failure ? '' : t('ui.specialtyUpdatedForName', { name: tech.name }));
  }
  const specialtyRows = useMemo(
    () =>
      specialties.map((name) => {
        const members = technicians.filter((tech) => tech.specialty === name);
        return { name, members };
      }),
    [specialties, technicians, t],
  );
  const specialtyColumns = useMemo<DataTableColumn<(typeof specialtyRows)[number]>[]>(
    () => [
      {
        id: 'تخصص',
        header: 'تخصص',
        accessorFn: ({ name }) => name,
      },
      {
        id: 'تعداد تعمیرکار',
        header: 'تعداد تعمیرکار',
        accessorFn: ({ members }) => members.length,
        cell: ({
          row: {
            original: { members },
          },
        }) => members.length,
      },
      {
        id: 'اعضای تیم',
        header: 'اعضای تیم',
        accessorFn: ({ members }) => members.map((tech) => tech.name).join('، '),
      },
    ],
    [t],
  );
  return (
    <>
      <PageHeading
        title={t('ui.technicianSpecialties')}
        description={t('ui.viewTheTeamSExpertiseAndAssignEach')}
      />
      {error || message ? (
        <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
          <AlertDescription>{translateLabel(error || message)}</AlertDescription>
        </Alert>
      ) : null}
      <Panel title={t('ui.assignOrChangeSpecialty')}>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-4 p-6">
          <Label className="flex flex-col gap-2">
            {t('ui.technician')}
            <Select name="technicianId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('ui.selectTechnician')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {technicians.map((tech) => (
                    <SelectItem value={tech.id} key={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Label className="flex flex-col gap-2">
            {t('ui.specialtyTitle')}
            <Input
              name="specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              required
              maxLength={150}
              placeholder={t('ui.selectOrEnterANewSpecialty')}
            />
            <Select value={specialty || undefined} onValueChange={setSpecialty}>
              <SelectTrigger aria-label={t('ui.chooseAnExistingSpecialty')} className="w-full">
                <SelectValue placeholder={t('ui.existingSpecialties')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...new Set(technicians.map((tech) => tech.specialty))].map((name) => (
                    <SelectItem key={name} value={name}>
                      {translateLabel(name)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Button type="submit">{t('ui.saveSpecialty')}</Button>
        </form>
      </Panel>
      <Input
        aria-label={t('ui.searchSpecialties')}
        className="my-4 max-w-sm"
        placeholder={t('ui.searchSpecialties2')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel title={t('ui.teamExpertise')}>
        <DataTable
          data={specialtyRows}
          getRowId={({ name }) => String(name)}
          columns={specialtyColumns}
          emptyMessage={null}
        />
        {!specialties.length ? <EmptyState /> : null}
      </Panel>
    </>
  );
}
