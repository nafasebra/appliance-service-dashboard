import { useSharedTranslation } from '@/shared/hooks';
import {
  PurchaseStatus,
  availableQuantity,
  needLabels,
  purchaseLabels,
  transitionNeed,
  receivePurchase,
  NeedStatus,
  type Part,
  useParts,
} from '@/entities/inventory';
import { JobStatus, appliances, useDemo } from '@/entities/service';
import { usePartsTranslation } from '../hooks/use-parts-translation.tsx';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { usePartsColumns } from '../hooks/use-parts-columns.tsx';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { getPartJobLabel, matchesPart } from '../lib/part-filters.ts';
import { getFormText } from '@/shared/lib';
import { Package, Plus } from 'lucide-react';

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
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { DataTable } from '@/shared/ui/data-table';

type Section = 'inventory' | 'needs' | 'purchases' | 'allocations';
const sections = [
  { to: '/parts', label: 'قطعات و موجودی', section: 'inventory' },
  { to: '/part-needs', label: 'نیاز قطعه و استعلام', section: 'needs' },
  { to: '/part-purchases', label: 'تأمین و خرید', section: 'purchases' },
  { to: '/part-allocations', label: 'تخصیص و تحویل', section: 'allocations' },
] as const;

export function PartsPage({ section }: { section: Section }) {
  const t = usePartsTranslation();
  const tShared = useSharedTranslation();
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
  const act = useCallback(
    (operation: Parameters<typeof change>[0]) => {
      const failure = change(operation);
      setError(failure ?? '');
      setMessage(failure ? '' : t('inventory.changesSavedSuccessfully'));
      return !failure;
    },
    [change, t, tShared],
  );
  const inventory = useMemo(
    () =>
      data.parts.filter(
        (part) =>
          matchesPart(part.id, data.parts, appliance, search) &&
          (status === 'all' ||
            (status === 'inactive'
              ? !part.active
              : status === 'empty'
                ? availableQuantity(data, part.id) === 0
                : availableQuantity(data, part.id) <= part.minimum)),
      ),
    [data, appliance, search, status, t, tShared],
  );
  const needs = useMemo(
    () =>
      data.needs.filter(
        (need) =>
          matchesPart(need.partId, data.parts, appliance, search) &&
          (status === 'all' || need.status === status) &&
          (section !== 'allocations' ||
            [
              NeedStatus.Reserved,
              NeedStatus.Delivered,
              NeedStatus.Used,
              NeedStatus.Returned,
            ].includes(need.status)),
      ),
    [data, appliance, search, status, section, t, tShared],
  );
  const purchases = useMemo(
    () =>
      data.purchases.filter(
        (purchase) =>
          matchesPart(purchase.partId, data.parts, appliance, search) &&
          (status === 'all' || purchase.status === status),
      ),
    [data, appliance, search, status, t, tShared],
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
      setError('parts:inventory.quantityMustBeAPositiveWholeNumber');
      return;
    }
    const partId = getFormText(fields, 'partId');
    if (form === 'need') {
      const job = jobs.find((item) => item.id === getFormText(fields, 'jobId'));
      const part = data.parts.find((item) => item.id === partId);
      if (
        !job ||
        job.status === JobStatus.Cancelled ||
        job.status === JobStatus.Completed ||
        job.appliance !== part?.appliance
      ) {
        setError('parts:inventory.thePartMustMatchTheApplianceTypeOf');
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
              status: NeedStatus.Pending,
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
              status: PurchaseStatus.Pending,
            },
          ],
        }))
      )
        setForm(null);
    }
  }
  const needAction = useCallback(
    (id: string, next: NeedStatus) => {
      const need = data.needs.find((item) => item.id === id);
      if (!need) {
        setError('parts:validation.partRequestNotFound');
        return;
      }
      const job = jobs.find((item) => item.id === need.jobId);
      if (
        next === NeedStatus.Reserved &&
        (!job || [JobStatus.Cancelled, JobStatus.Completed].includes(job.status))
      ) {
        setError('parts:inventory.partsCanOnlyBeReservedForOpenOrders');
        return;
      }
      act((current) => transitionNeed(current, id, next));
    },
    [data.needs, jobs, act, t, tShared],
  );
  const { inventoryColumns, purchaseColumns, needColumns } = usePartsColumns({
    data,
    jobs,
    customers,
    technicians,
    act,
    setEditing,
    setForm,
    setReceiving,
    needAction,
    setDelivery,
  });

  return (
    <>
      <PageHeading
        title={title}
        description={t('inventory.managePartsFromAvailabilityChecksThroughProcurementDelivery')}
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
                ? t('inventory.addPart')
                : section === 'needs'
                  ? t('inventory.requestPart')
                  : t('inventory.requestPurchase')}
            </Button>
          ) : undefined
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t('inventory.partTypes')}
          value={data.parts.length}
          detail={t('inventory.byApplianceTypeAndCompatibleModel')}
          icon={<Package />}
        />
        <StatCard
          title={t('inventory.availableStock')}
          value={data.parts.reduce((sum, p) => sum + availableQuantity(data, p.id), 0)}
          detail={t('inventory.physicalStockMinusReservations')}
          icon={<Package />}
        />
        <StatCard
          title={t('inventory.lowOrOutOfStock')}
          value={
            data.parts.filter((p) => p.active && availableQuantity(data, p.id) <= p.minimum).length
          }
          detail={t('inventory.procurementReviewNeeded')}
          icon={<Package />}
        />
        <StatCard
          title={t('inventory.onTheWay')}
          value={data.purchases.reduce(
            (sum, p) => sum + (p.status === PurchaseStatus.Ordered ? p.quantity - p.received : 0),
            0,
          )}
          detail={t('inventory.orderedPurchasesNotYetReceived')}
          icon={<Package />}
        />
      </div>
      {storageError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {t('inventory.browserStorageIsUnavailableCurrentChangesWillNot')}
          </AlertDescription>
        </Alert>
      ) : null}
      {error || message ? (
        <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
          <AlertDescription>{translateLabel(error || message)}</AlertDescription>
        </Alert>
      ) : null}
      <div className="mb-4 flex flex-row gap-3">
        <Input
          aria-label={t('inventory.searchParts')}
          placeholder={t('inventory.nameCodeOrCompatibleModel')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <Select value={appliance} onValueChange={(value) => setAppliance(value)}>
          <SelectTrigger className="w-full" aria-label={t('common.applianceType')}>
            <SelectValue placeholder={tShared('select.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('inventory.allAppliances')}</SelectItem>
              {appliances.map((item) => (
                <SelectItem key={item} value={item}>
                  {translateLabel(item)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full" aria-label={tShared('fields.status')}>
            <SelectValue placeholder={tShared('select.selectAnOption')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{tShared('filters.allStatuses')}</SelectItem>
              {section === 'inventory' ? (
                <>
                  <SelectItem value="low">{t('tables.lowStock')}</SelectItem>
                  <SelectItem value="empty">{t('tables.outOfStock')}</SelectItem>
                  <SelectItem value="inactive">{t('tables.inactive')}</SelectItem>
                </>
              ) : (
                Object.entries(section === 'purchases' ? purchaseLabels : needLabels).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {translateLabel(label)}
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
        subtitle={t('inventory.sampleDataInventoryOperationsAreRecordedSeparatelyFrom')}
      >
        {section === 'inventory' ? (
          <DataTable
            data={inventory}
            key="inventory"
            getRowId={(part) => String(part.id)}
            columns={inventoryColumns}
            emptyMessage={null}
          />
        ) : section === 'purchases' ? (
          <DataTable
            data={purchases}
            key="purchases"
            getRowId={(purchase) => String(purchase.id)}
            columns={purchaseColumns}
            emptyMessage={null}
          />
        ) : (
          <DataTable
            data={needs}
            key="needs"
            getRowId={(need) => String(need.id)}
            columns={needColumns}
            emptyMessage={null}
          />
        )}
        {(section === 'inventory'
          ? inventory.length
          : section === 'purchases'
            ? purchases.length
            : needs.length) === 0 ? (
          <EmptyState text={t('inventory.noRecordsToDisplayCreateARequestOr')} />
        ) : null}
      </Panel>
      {form ? (
        <Modal
          title={
            form === 'part'
              ? editing
                ? t('inventory.editPart')
                : t('inventory.addPart')
              : form === 'need'
                ? t('inventory.partRequestAndAvailabilityCheck')
                : t('inventory.requestStockReplenishment')
          }
          onClose={() => setForm(null)}
        >
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            {form === 'part' ? (
              <>
                <Label className="flex flex-col gap-2">
                  {t('inventory.partName')}
                  <Input name="name" defaultValue={editing?.name} required maxLength={100} />
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('inventory.uniqueCode')}
                  <Input name="code" defaultValue={editing?.code} required maxLength={50} />
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('common.applianceType')}
                  <Select name="appliance" defaultValue={editing?.appliance ?? appliances[0]}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={tShared('select.selectAnOption')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {appliances.map((item) => (
                          <SelectItem key={item} value={item}>
                            {translateLabel(item)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('inventory.compatibleBrandsAndModels')}
                  <Input name="compatibility" defaultValue={editing?.compatibility} required />
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('inventory.storageLocation')}
                  <Input name="location" defaultValue={editing?.location} required />
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('inventory.minimumStock')}
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
                    {t('inventory.openingStock')}
                    <Input name="stock" type="number" min="0" step="1" defaultValue="0" required />
                  </Label>
                ) : null}
              </>
            ) : (
              <>
                <Label className="flex flex-col gap-2">
                  {t('tables.part')}
                  <Select name="partId" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={tShared('select.selectAnOption')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {data.parts
                          .filter((p) => p.active)
                          .map((part) => (
                            <SelectItem key={part.id} value={part.id}>
                              {part.name} · {translateLabel(part.appliance)}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
                <Label className="flex flex-col gap-2">
                  {t('tables.quantity')}
                  <Input name="quantity" type="number" min="1" step="1" defaultValue="1" required />
                </Label>
                {form === 'need' ? (
                  <Label className="col-span-full flex flex-col gap-2">
                    {t('common.customerOrder')}
                    <Select name="jobId" required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('inventory.selectAnOpenOrder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {jobs
                            .filter(
                              (job) =>
                                ![JobStatus.Completed, JobStatus.Cancelled].includes(job.status),
                            )
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
                    {t('inventory.suggestedSupplier')}
                    <Input name="supplier" />
                  </Label>
                )}
              </>
            )}
            {error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertDescription>{translateLabel(error)}</AlertDescription>
              </Alert>
            ) : null}
            <div className="col-span-full flex gap-2">
              <Button type="submit">{tShared('actions.save')}</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                {tShared('actions.cancel2')}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
      {delivery ? (
        <Modal title={t('inventory.deliverPartToTechnician')} onClose={() => setDelivery('')}>
          <form
            className="flex flex-col gap-4 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const technicianId = String(new FormData(event.currentTarget).get('technicianId'));
              if (
                act((current) =>
                  transitionNeed(current, delivery, NeedStatus.Delivered, technicianId),
                )
              )
                setDelivery('');
            }}
          >
            <Label className="flex flex-col gap-2">
              {t('inventory.recipient')}
              <Select name="technicianId" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('common.selectTechnician')} />
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
            {error ? <p role="alert">{translateLabel(error)}</p> : null}
            <Button type="submit">{t('inventory.recordDelivery')}</Button>
          </form>
        </Modal>
      ) : null}
      {receiving ? (
        <Modal title={t('inventory.recordPurchaseGoodsReceipt')} onClose={() => setReceiving('')}>
          <form
            className="flex flex-col gap-4 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const fields = new FormData(event.currentTarget);
              const purchase = data.purchases.find((p) => p.id === receiving)!;
              const ok =
                purchase.status === PurchaseStatus.Approved
                  ? act((current) => ({
                      ...current,
                      purchases: current.purchases.map((p) =>
                        p.id === receiving
                          ? {
                              ...p,
                              status: PurchaseStatus.Ordered,
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
            {data.purchases.find((p) => p.id === receiving)?.status === PurchaseStatus.Approved ? (
              <Label className="flex flex-col gap-2">
                {t('tables.supplier')}
                <Input
                  name="supplier"
                  required
                  defaultValue={data.purchases.find((p) => p.id === receiving)?.supplier}
                />
              </Label>
            ) : (
              <Label className="flex flex-col gap-2">
                {t('inventory.quantityReceivedInThisDelivery')}
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
            {error ? <p role="alert">{translateLabel(error)}</p> : null}
            <Button type="submit">{t('inventory.submit')}</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
