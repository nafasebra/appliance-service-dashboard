import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/shared/ui/data-table-features';
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
import { DataTable } from '@/shared/ui/data-table';
import { number } from '@/shared/lib/format';

export function TechnicianSpecialtiesPage() {
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
    [technicians, query],
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const tech = technicians.find((item) => item.id === form.get('technicianId'));
    if (!tech) return;
    const specialty = String(form.get('specialty') ?? '').trim();
    const failure = saveTechnician({ ...tech, specialty });
    setError(failure ?? '');
    setMessage(failure ? '' : `تخصص ${tech.name} به‌روزرسانی شد.`);
  }
  const specialtyRows = useMemo(
    () =>
      specialties.map((name) => {
        const members = technicians.filter((tech) => tech.specialty === name);
        return { name, members };
      }),
    [specialties, technicians],
  );
  const specialtyColumns = useMemo<ColumnDef<DataTableFeatures, (typeof specialtyRows)[number]>[]>(
    () => [
      {
        id: 'تخصص',
        header: 'تخصص',
        accessorFn: ({ name }) => name,
        cell: ({
          row: {
            original: { name },
          },
        }) => name,
      },
      {
        id: 'تعداد تعمیرکار',
        header: 'تعداد تعمیرکار',
        accessorFn: ({ members }) => members.length,
        cell: ({
          row: {
            original: { members },
          },
        }) => number(members.length),
      },
      {
        id: 'اعضای تیم',
        header: 'اعضای تیم',
        accessorFn: ({ members }) => members.map((tech) => tech.name).join('، '),
        cell: ({
          row: {
            original: { members },
          },
        }) => members.map((tech) => tech.name).join('، '),
      },
    ],
    [],
  );
  return (
    <>
      <PageHeading
        title="تخصص‌های تعمیرکاران"
        description="مشاهده پوشش تخصصی تیم و تعیین حوزه تخصص هر تعمیرکار."
      />
      {error || message ? (
        <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
          <AlertDescription>{error || message}</AlertDescription>
        </Alert>
      ) : null}
      <Panel title="تعیین یا تغییر تخصص">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-4 p-6">
          <Label className="flex flex-col gap-2">
            تعمیرکار
            <Select dir="rtl" name="technicianId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب تعمیرکار" />
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
            عنوان تخصص
            <Input
              name="specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              required
              maxLength={150}
              placeholder="انتخاب یا ورود تخصص جدید"
            />
            <Select dir="rtl" value={specialty || undefined} onValueChange={setSpecialty}>
              <SelectTrigger aria-label="انتخاب از تخصص‌های موجود" className="w-full">
                <SelectValue placeholder="تخصص‌های موجود" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...new Set(technicians.map((tech) => tech.specialty))].map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Button type="submit">ثبت تخصص</Button>
        </form>
      </Panel>
      <Input
        aria-label="جستجوی تخصص"
        className="my-4 max-w-sm"
        placeholder="جستجوی تخصص…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel title="پوشش تخصصی تیم">
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
