import { useState, type FormEvent } from 'react';
import { getPartJobLabel, matchesPart } from './utils/part-filters';
import { getFormText } from '@/shared/utils/form';
import { Package, Plus } from 'lucide-react';
import { useDemo } from '@/shared/store/demo-store';
import { useParts } from '@/shared/store/parts-store';
import { appliances } from '@/entities/service/model/types';
import {
  availableQuantity,
  reservedQuantity,
  needLabels,
  purchaseLabels,
  transitionNeed,
  receivePurchase,
  type NeedStatus,
  type Part,
} from '@/features/parts/model/parts';
import { PageHeading, Panel, EmptyState, Modal, StatCard } from '@/shared/ui/primitives';
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
import { Badge } from '@/shared/ui/badge';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { number } from '@/shared/lib/format';

type Section = 'inventory' | 'needs' | 'purchases' | 'allocations';
const sections = [
  { to: '/parts', label: 'قطعات و موجودی', section: 'inventory' },
  { to: '/part-needs', label: 'نیاز قطعه و استعلام', section: 'needs' },
  { to: '/part-purchases', label: 'تأمین و خرید', section: 'purchases' },
  { to: '/part-allocations', label: 'تخصیص و تحویل', section: 'allocations' },
] as const;

export function PartsPage({ section }: { section: Section }) {
  const data = useParts((state) => state.data);
  const change = useParts((state) => state.change);
  const storageError = useParts((state) => state.storageError);
  const jobs = useDemo((state) => state.jobs);
  const customers = useDemo((state) => state.customers);
  const technicians = useDemo((state) => state.technicians);
  const [search, setSearch] = useState('');
  const [appliance, setAppliance] = useState('all');
  const [status, setStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<'part' | 'need' | 'purchase' | null>(null);
  const [editing, setEditing] = useState<Part | undefined>();
  const [delivery, setDelivery] = useState('');
  const [receiving, setReceiving] = useState('');

  const title = sections.find((item) => item.section === section)!.label;
  function act(operation: Parameters<typeof change>[0]) {
    const failure = change(operation);
    setError(failure ?? '');
    setMessage(failure ? '' : 'اطلاعات با موفقیت ثبت شد.');
    return !failure;
  }
  const inventory = data.parts.filter(
    (part) =>
      matchesPart(part.id, data.parts, appliance, search) &&
      (status === 'all' ||
        (status === 'inactive'
          ? !part.active
          : status === 'empty'
            ? availableQuantity(data, part.id) === 0
            : availableQuantity(data, part.id) <= part.minimum)),
  );
  const needs = data.needs.filter(
    (need) =>
      matchesPart(need.partId, data.parts, appliance, search) &&
      (status === 'all' || need.status === status) &&
      (section !== 'allocations' ||
        ['reserved', 'delivered', 'used', 'returned'].includes(need.status)),
  );
  const purchases = data.purchases.filter(
    (purchase) =>
      matchesPart(purchase.partId, data.parts, appliance, search) &&
      (status === 'all' || purchase.status === status),
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const quantity = Number(fields.get('quantity'));
    if (form === 'part') {
      const part: Part = {
        id: editing?.id ?? crypto.randomUUID(),
        code: getFormText(fields, 'code'),
        name: getFormText(fields, 'name'),
        appliance: getFormText(fields, 'appliance') as Part['appliance'],
        compatibility: getFormText(fields, 'compatibility'),
        location: getFormText(fields, 'location'),
        stock: editing?.stock ?? Number(fields.get('stock')),
        minimum: Number(fields.get('minimum')),
        active: editing?.active ?? true,
      };
      if (
        act((current) => ({
          ...current,
          parts: editing
            ? current.parts.map((p) => (p.id === editing.id ? part : p))
            : [...current.parts, part],
        }))
      )
        setForm(null);
      return;
    }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      setError('تعداد باید عدد صحیح مثبت باشد.');
      return;
    }
    const partId = getFormText(fields, 'partId');
    if (form === 'need') {
      const job = jobs.find((item) => item.id === getFormText(fields, 'jobId'));
      const part = data.parts.find((item) => item.id === partId);
      if (
        !job ||
        job.status === 'cancelled' ||
        job.status === 'completed' ||
        job.appliance !== part?.appliance
      ) {
        setError('قطعه باید با نوع دستگاه یک سفارش باز سازگار باشد.');
        return;
      }
      if (
        act((current) => ({
          ...current,
          needs: [
            ...current.needs,
            {
              id: crypto.randomUUID(),
              partId,
              jobId: job.id,
              quantity,
              status: 'pending',
              technicianId: '',
            },
          ],
        }))
      )
        setForm(null);
    } else if (form === 'purchase') {
      if (
        act((current) => ({
          ...current,
          purchases: [
            ...current.purchases,
            {
              id: crypto.randomUUID(),
              partId,
              needId: '',
              quantity,
              received: 0,
              supplier: getFormText(fields, 'supplier'),
              status: 'pending',
            },
          ],
        }))
      )
        setForm(null);
    }
  }
  function needAction(id: string, next: NeedStatus) {
    const need = data.needs.find((item) => item.id === id)!;
    const job = jobs.find((item) => item.id === need.jobId);
    if (next === 'reserved' && (!job || ['cancelled', 'completed'].includes(job.status))) {
      setError('رزرو فقط برای سفارش باز مجاز است.');
      return;
    }
    act((current) => transitionNeed(current, id, next));
  }
  return (
    <>
      <PageHeading
        title={title}
        description="مدیریت قطعه از استعلام انبار تا تأمین، تحویل و مصرف در سفارش مشتری"
        action={
          section !== 'allocations' ? (
            <Button
              onClick={() => {
                setEditing(undefined);
                setError('');
                setForm(
                  section === 'inventory' ? 'part' : section === 'needs' ? 'need' : 'purchase',
                );
              }}
            >
              <Plus />
              {section === 'inventory'
                ? 'تعریف قطعه'
                : section === 'needs'
                  ? 'درخواست قطعه'
                  : 'درخواست خرید'}
            </Button>
          ) : undefined
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="انواع قطعه"
          value={number(data.parts.length)}
          detail="به تفکیک دستگاه و مدل سازگار"
          icon={<Package />}
        />
        <StatCard
          title="موجودی قابل تخصیص"
          value={number(data.parts.reduce((sum, p) => sum + availableQuantity(data, p.id), 0))}
          detail="موجودی فیزیکی منهای رزرو"
          icon={<Package />}
        />
        <StatCard
          title="کم‌موجود یا ناموجود"
          value={number(
            data.parts.filter((p) => p.active && availableQuantity(data, p.id) <= p.minimum).length,
          )}
          detail="نیازمند بررسی تأمین"
          icon={<Package />}
        />
        <StatCard
          title="در راه"
          value={number(
            data.purchases.reduce(
              (sum, p) => sum + (p.status === 'ordered' ? p.quantity - p.received : 0),
              0,
            ),
          )}
          detail="سفارش خرید ثبت‌شده و دریافت‌نشده"
          icon={<Package />}
        />
      </div>
      {storageError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            ذخیره مرورگر در دسترس نیست؛ تغییرات فعلی پس از خروج حفظ نمی‌شوند.
          </AlertDescription>
        </Alert>
      ) : null}
      {error || message ? (
        <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
          <AlertDescription>{error || message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="mb-4 flex flex-row gap-3">
        <Input
          aria-label="جستجوی قطعه"
          placeholder="نام، کد یا مدل سازگار…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <Select dir="rtl" value={appliance} onValueChange={(value) => setAppliance(value)}>
          <SelectTrigger className="w-full" aria-label="نوع دستگاه">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه دستگاه‌ها</SelectItem>
              {appliances.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select dir="rtl" value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label="وضعیت">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              {section === 'inventory' ? (
                <>
                  <SelectItem value="low">کم‌موجود</SelectItem>
                  <SelectItem value="empty">ناموجود</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                </>
              ) : (
                Object.entries(section === 'purchases' ? purchaseLabels : needLabels).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ),
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Panel
        title={title}
        subtitle="اطلاعات نمونه؛ عملیات انبار به‌صورت مستقل از پرداخت‌های مالی ثبت می‌شود."
      >
        <Table>
          <TableHeader>
            <TableRow>
              {(section === 'inventory'
                ? [
                    'قطعه / کد',
                    'دستگاه و سازگاری',
                    'محل',
                    'فیزیکی',
                    'رزرو',
                    'قابل تخصیص',
                    'وضعیت',
                    'عملیات',
                  ]
                : section === 'purchases'
                  ? [
                      'قطعه',
                      'مرتبط با درخواست',
                      'تأمین‌کننده',
                      'تعداد خرید',
                      'دریافت',
                      'وضعیت',
                      'عملیات',
                    ]
                  : [
                      'قطعه',
                      'سفارش مشتری',
                      'تعداد',
                      'قابل تخصیص',
                      'وضعیت',
                      'تحویل‌گیرنده',
                      'عملیات',
                    ]
              ).map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {section === 'inventory'
              ? inventory.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <strong>{part.name}</strong>
                      <div>
                        <bdi>{part.code}</bdi>
                      </div>
                    </TableCell>
                    <TableCell>
                      {part.appliance}
                      <p className="text-xs text-muted-foreground">{part.compatibility}</p>
                    </TableCell>
                    <TableCell>{part.location}</TableCell>
                    <TableCell>{number(part.stock)}</TableCell>
                    <TableCell>{number(reservedQuantity(data, part.id))}</TableCell>
                    <TableCell>{number(availableQuantity(data, part.id))}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {!part.active
                          ? 'غیرفعال'
                          : availableQuantity(data, part.id) === 0
                            ? 'ناموجود'
                            : availableQuantity(data, part.id) <= part.minimum
                              ? 'کم‌موجود'
                              : 'موجود'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(part);
                            setForm('part');
                          }}
                        >
                          ویرایش
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            act((current) => ({
                              ...current,
                              parts: current.parts.map((p) =>
                                p.id === part.id ? { ...p, active: !p.active } : p,
                              ),
                            }))
                          }
                        >
                          {part.active ? 'غیرفعال' : 'فعال'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {section === 'needs' || section === 'allocations'
              ? needs.map((need) => (
                  <TableRow key={need.id}>
                    <TableCell>{data.parts.find((p) => p.id === need.partId)?.name}</TableCell>
                    <TableCell>{getPartJobLabel(need.jobId, jobs, customers)}</TableCell>
                    <TableCell>{number(need.quantity)}</TableCell>
                    <TableCell>{number(availableQuantity(data, need.partId))}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{needLabels[need.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      {technicians.find((t) => t.id === need.technicianId)?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {['pending', 'unavailable', 'available'].includes(need.status) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              needAction(
                                need.id,
                                availableQuantity(data, need.partId) >= need.quantity &&
                                  data.parts.find((p) => p.id === need.partId)?.active
                                  ? 'available'
                                  : 'unavailable',
                              )
                            }
                            disabled={need.status === 'available'}
                          >
                            استعلام موجودی
                          </Button>
                        ) : null}
                        {need.status === 'available' ? (
                          <Button size="sm" onClick={() => needAction(need.id, 'reserved')}>
                            رزرو برای سفارش
                          </Button>
                        ) : null}
                        {need.status === 'unavailable' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={data.purchases.some(
                              (p) =>
                                p.needId === need.id &&
                                p.status !== 'cancelled' &&
                                p.status !== 'received',
                            )}
                            onClick={() =>
                              act((current) => ({
                                ...current,
                                purchases: [
                                  ...current.purchases,
                                  {
                                    id: crypto.randomUUID(),
                                    partId: need.partId,
                                    needId: need.id,
                                    quantity: Math.max(
                                      1,
                                      need.quantity - availableQuantity(current, need.partId),
                                    ),
                                    received: 0,
                                    supplier: '',
                                    status: 'pending',
                                  },
                                ],
                              }))
                            }
                          >
                            ارجاع به تأمین
                          </Button>
                        ) : null}
                        {need.status === 'reserved' ? (
                          <Button size="sm" onClick={() => setDelivery(need.id)}>
                            تحویل به تعمیرکار
                          </Button>
                        ) : null}
                        {need.status === 'delivered' ? (
                          <>
                            <Button size="sm" onClick={() => needAction(need.id, 'used')}>
                              ثبت مصرف
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => needAction(need.id, 'returned')}
                            >
                              برگشت سالم به انبار
                            </Button>
                          </>
                        ) : null}
                        {['pending', 'available', 'unavailable', 'reserved'].includes(
                          need.status,
                        ) ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => needAction(need.id, 'cancelled')}
                          >
                            لغو
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {section === 'purchases'
              ? purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{data.parts.find((p) => p.id === purchase.partId)?.name}</TableCell>
                    <TableCell>
                      {purchase.needId
                        ? getPartJobLabel(
                            data.needs.find((n) => n.id === purchase.needId)?.jobId ?? '',
                            jobs,
                            customers,
                          )
                        : 'تکمیل موجودی انبار'}
                    </TableCell>
                    <TableCell>{purchase.supplier || 'تعیین نشده'}</TableCell>
                    <TableCell>{number(purchase.quantity)}</TableCell>
                    <TableCell>{number(purchase.received)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {purchase.received > 0 && purchase.status === 'ordered'
                          ? 'دریافت جزئی'
                          : purchaseLabels[purchase.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {purchase.status === 'pending' ? (
                          <Button
                            size="sm"
                            onClick={() =>
                              act((current) => ({
                                ...current,
                                purchases: current.purchases.map((p) =>
                                  p.id === purchase.id ? { ...p, status: 'approved' } : p,
                                ),
                              }))
                            }
                          >
                            تأیید خرید
                          </Button>
                        ) : null}
                        {purchase.status === 'approved' ? (
                          <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                            ثبت سفارش خرید
                          </Button>
                        ) : null}
                        {purchase.status === 'ordered' ? (
                          <Button size="sm" onClick={() => setReceiving(purchase.id)}>
                            دریافت کالا
                          </Button>
                        ) : null}
                        {['pending', 'approved'].includes(purchase.status) ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              act((current) => ({
                                ...current,
                                purchases: current.purchases.map((p) =>
                                  p.id === purchase.id ? { ...p, status: 'cancelled' } : p,
                                ),
                              }))
                            }
                          >
                            لغو
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        {(section === 'inventory'
          ? inventory.length
          : section === 'purchases'
            ? purchases.length
            : needs.length) === 0 ? (
          <EmptyState text="موردی برای نمایش وجود ندارد. درخواست جدید ثبت کنید یا فیلترها را تغییر دهید." />
        ) : null}
      </Panel>
      {form ? (
        <Modal
          title={
            form === 'part'
              ? editing
                ? 'ویرایش قطعه'
                : 'تعریف قطعه'
              : form === 'need'
                ? 'درخواست قطعه و استعلام'
                : 'درخواست تأمین موجودی'
          }
          onClose={() => setForm(null)}
        >
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            {form === 'part' ? (
              <>
                <Label className="flex flex-col gap-2">
                  نام قطعه
                  <Input name="name" defaultValue={editing?.name} required maxLength={100} />
                </Label>
                <Label className="flex flex-col gap-2">
                  کد یکتا
                  <Input name="code" defaultValue={editing?.code} required maxLength={50} />
                </Label>
                <Label className="flex flex-col gap-2">
                  نوع دستگاه
                  <Select
                    dir="rtl"
                    name="appliance"
                    defaultValue={editing?.appliance ?? appliances[0]}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {appliances.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
                <Label className="flex flex-col gap-2">
                  برند و مدل سازگار
                  <Input name="compatibility" defaultValue={editing?.compatibility} required />
                </Label>
                <Label className="flex flex-col gap-2">
                  محل نگهداری
                  <Input name="location" defaultValue={editing?.location} required />
                </Label>
                <Label className="flex flex-col gap-2">
                  حداقل موجودی
                  <Input
                    name="minimum"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={editing?.minimum ?? 2}
                    required
                  />
                </Label>
                {!editing ? (
                  <Label className="flex flex-col gap-2">
                    موجودی اولیه
                    <Input name="stock" type="number" min="0" step="1" defaultValue="0" required />
                  </Label>
                ) : null}
              </>
            ) : (
              <>
                <Label className="flex flex-col gap-2">
                  قطعه
                  <Select dir="rtl" name="partId" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {data.parts
                          .filter((p) => p.active)
                          .map((part) => (
                            <SelectItem key={part.id} value={part.id}>
                              {part.name} · {part.appliance}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
                <Label className="flex flex-col gap-2">
                  تعداد
                  <Input name="quantity" type="number" min="1" step="1" defaultValue="1" required />
                </Label>
                {form === 'need' ? (
                  <Label className="col-span-full flex flex-col gap-2">
                    سفارش مشتری
                    <Select dir="rtl" name="jobId" required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب سفارش باز" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {jobs
                            .filter((job) => !['completed', 'cancelled'].includes(job.status))
                            .map((job) => (
                              <SelectItem key={job.id} value={job.id}>
                                {getPartJobLabel(job.id, jobs, customers)}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Label>
                ) : (
                  <Label className="flex flex-col gap-2">
                    تأمین‌کننده پیشنهادی
                    <Input name="supplier" />
                  </Label>
                )}
              </>
            )}
            {error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="col-span-full flex gap-2">
              <Button type="submit">ذخیره</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                انصراف
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
      {delivery ? (
        <Modal title="تحویل قطعه به تعمیرکار" onClose={() => setDelivery('')}>
          <form
            className="flex flex-col gap-4 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const technicianId = String(new FormData(event.currentTarget).get('technicianId'));
              if (act((current) => transitionNeed(current, delivery, 'delivered', technicianId)))
                setDelivery('');
            }}
          >
            <Label className="flex flex-col gap-2">
              دریافت‌کننده
              <Select dir="rtl" name="technicianId" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب تعمیرکار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {technicians.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
            {error ? <p role="alert">{error}</p> : null}
            <Button type="submit">ثبت تحویل</Button>
          </form>
        </Modal>
      ) : null}
      {receiving ? (
        <Modal title="ثبت خرید / دریافت کالا" onClose={() => setReceiving('')}>
          <form
            className="flex flex-col gap-4 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const fields = new FormData(event.currentTarget);
              const purchase = data.purchases.find((p) => p.id === receiving)!;
              const ok =
                purchase.status === 'approved'
                  ? act((current) => ({
                      ...current,
                      purchases: current.purchases.map((p) =>
                        p.id === receiving
                          ? {
                              ...p,
                              status: 'ordered',
                              supplier: String(fields.get('supplier')).trim(),
                            }
                          : p,
                      ),
                    }))
                  : act((current) =>
                      receivePurchase(current, receiving, Number(fields.get('quantity'))),
                    );
              if (ok) setReceiving('');
            }}
          >
            {data.purchases.find((p) => p.id === receiving)?.status === 'approved' ? (
              <Label className="flex flex-col gap-2">
                تأمین‌کننده
                <Input
                  name="supplier"
                  required
                  defaultValue={data.purchases.find((p) => p.id === receiving)?.supplier}
                />
              </Label>
            ) : (
              <Label className="flex flex-col gap-2">
                تعداد دریافت این مرحله
                <Input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  required
                  max={
                    data.purchases.find((p) => p.id === receiving)!.quantity -
                    data.purchases.find((p) => p.id === receiving)!.received
                  }
                  defaultValue="1"
                />
              </Label>
            )}
            {error ? <p role="alert">{error}</p> : null}
            <Button type="submit">ثبت</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
