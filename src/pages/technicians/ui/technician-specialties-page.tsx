import { useTechniciansTranslation } from '../hooks/use-technicians-translation';
import { translateLabel } from '../../../shared/i18n/index';
import { useMemo, useState, type FormEvent } from 'react';
import { useDemo } from '@/entities/service';
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

export function TechnicianSpecialtiesPage() {
  const t = useTechniciansTranslation();

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
    setMessage(
      failure ? '' : t('specialties.specialtyUpdatedForName', { name: translateLabel(tech.name) }),
    );
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
        header: t('management.specialty'),
        accessorFn: ({ name }) => translateLabel(name),
        cell: ({
          row: {
            original: { name },
          },
        }) => translateLabel(name),
      },
      {
        id: 'تعداد تعمیرکار',
        header: t('specialties.technicianCount'),
        accessorFn: ({ members }) => members.length,
        cell: ({
          row: {
            original: { members },
          },
        }) => members.length,
      },
      {
        id: 'اعضای تیم',
        header: t('management.teamMembers'),
        accessorFn: ({ members }) => members.map((tech) => translateLabel(tech.name)).join(', '),
        cell: ({
          row: {
            original: { members },
          },
        }) => members.map((tech) => translateLabel(tech.name)).join(', '),
      },
    ],
    [t],
  );
  return (
    <>
      <PageHeading
        title={t('navigation.technicianSpecialties')}
        description={t('specialties.viewTheTeamSExpertiseAndAssignEach')}
      />
      {error || message ? (
        <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
          <AlertDescription>{translateLabel(error || message)}</AlertDescription>
        </Alert>
      ) : null}
      <Panel title={t('specialties.assignOrChangeSpecialty')}>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-4 p-6">
          <Label className="flex flex-col gap-2">
            {t('common.technician')}
            <Select name="technicianId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.selectTechnician')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {technicians.map((tech) => (
                    <SelectItem value={tech.id} key={tech.id}>
                      {translateLabel(tech.name)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Label className="flex flex-col gap-2">
            {t('specialties.specialtyTitle')}
            <Input
              name="specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              required
              maxLength={150}
              placeholder={t('specialties.selectOrEnterANewSpecialty')}
            />
            <Select value={specialty || undefined} onValueChange={setSpecialty}>
              <SelectTrigger
                aria-label={t('specialties.chooseAnExistingSpecialty')}
                className="w-full"
              >
                <SelectValue placeholder={t('specialties.existingSpecialties')} />
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
          <Button type="submit">{t('specialties.saveSpecialty')}</Button>
        </form>
      </Panel>
      <Input
        aria-label={t('specialties.searchSpecialties')}
        className="my-4 max-w-sm"
        placeholder={t('specialties.searchSpecialties2')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel title={t('specialties.teamExpertise')}>
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
