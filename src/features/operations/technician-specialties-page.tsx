import { useState, type FormEvent } from 'react';
import { useDemo } from './model/demo-store';
import { PageHeading, Panel, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { NativeSelect } from '@/shared/ui/native-select';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/shared/ui/table';
import { number } from '@/shared/lib/format';

export function TechnicianSpecialtiesPage() {
  const { technicians, saveTechnician } = useDemo();
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const specialties = [...new Set(technicians.map((tech) => tech.specialty))].filter((name) =>
    name.includes(query.trim()),
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
            <NativeSelect name="technicianId" required>
              <option value="">انتخاب تعمیرکار</option>
              {technicians.map((tech) => (
                <option value={tech.id} key={tech.id}>
                  {tech.name}
                </option>
              ))}
            </NativeSelect>
          </Label>
          <Label className="flex flex-col gap-2">
            عنوان تخصص
            <Input
              name="specialty"
              list="team-specialties"
              required
              maxLength={150}
              placeholder="انتخاب یا ورود تخصص جدید"
            />
            <datalist id="team-specialties">
              {[...new Set(technicians.map((tech) => tech.specialty))].map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تخصص</TableHead>
              <TableHead>تعداد تعمیرکار</TableHead>
              <TableHead>اعضای تیم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.map((name) => {
              const members = technicians.filter((tech) => tech.specialty === name);
              return (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{number(members.length)}</TableCell>
                  <TableCell>{members.map((tech) => tech.name).join('، ')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!specialties.length ? <EmptyState /> : null}
      </Panel>
    </>
  );
}
