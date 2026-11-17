import { useState, type FormEvent } from 'react';
import { getFormText } from '@/shared/utils/form';
import { Plus } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
import type { Technician } from '@/entities/service/model/types';
import { PageHeading, Panel, Modal, EmptyState } from '@/shared/ui/primitives';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/shared/ui/table';
import { number } from '@/shared/lib/format';

export function TechnicianManagementPage() {
  const { technicians, jobs, saveTechnician } = useDemo();
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<Technician | 'new' | null>(null);
  const [error, setError] = useState('');
  const filtered = technicians.filter((tech) =>
    `${tech.name} ${tech.phone} ${tech.specialty} ${tech.area}`.includes(query.trim()),
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

  return (
    <>
      <PageHeading
        title="مدیریت تعمیرکاران"
        description="اطلاعات تماس، تخصص و محدوده فعالیت اعضای تیم."
        action={
          <Button
            onClick={() => {
              setError('');
              setEditor('new');
            }}
          >
            <Plus />
            افزودن تعمیرکار
          </Button>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        aria-label="جستجوی تعمیرکار"
        placeholder="نام، تلفن، تخصص یا محدوده…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Panel title="اعضای تیم" subtitle={`${number(filtered.length)} تعمیرکار`}>
        <Table>
          <TableHeader>
            <TableRow>
              {['نام تعمیرکار', 'تلفن', 'تخصص', 'محدوده', 'سفارش باز', 'عملیات'].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tech) => (
              <TableRow key={tech.id}>
                <TableCell>{tech.name}</TableCell>
                <TableCell>
                  <bdi>{tech.phone}</bdi>
                </TableCell>
                <TableCell>{tech.specialty}</TableCell>
                <TableCell>{tech.area}</TableCell>
                <TableCell>
                  {number(
                    jobs.filter(
                      (job) =>
                        job.technicianId === tech.id &&
                        !['completed', 'cancelled'].includes(job.status),
                    ).length,
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setError('');
                      setEditor(tech);
                    }}
                  >
                    ویرایش
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!filtered.length ? <EmptyState /> : null}
      </Panel>
      {editor ? (
        <Modal
          title={editing ? 'ویرایش تعمیرکار' : 'افزودن تعمیرکار'}
          onClose={() => setEditor(null)}
        >
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            <Label className="flex flex-col gap-2">
              نام و نام خانوادگی
              <Input name="name" required maxLength={100} defaultValue={editing?.name} />
            </Label>
            <Label className="flex flex-col gap-2">
              تلفن
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
              تخصص
              <Input
                name="specialty"
                required
                maxLength={150}
                defaultValue={editing?.specialty}
                placeholder="مثلاً تعمیر یخچال و فریزر"
              />
            </Label>
            <Label className="flex flex-col gap-2">
              محدوده فعالیت
              <Input name="area" required maxLength={150} defaultValue={editing?.area} />
            </Label>
            {error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="col-span-full flex gap-2">
              <Button type="submit">ذخیره</Button>
              <Button type="button" variant="outline" onClick={() => setEditor(null)}>
                انصراف
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
