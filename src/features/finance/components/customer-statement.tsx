import { useDemo } from '@/entities/service/model/demo-store';
import {
  getCustomerAccount,
  getOrderAccount,
  paymentStatusLabels,
} from '@/entities/service/model/customer-account';
import { Modal, EmptyState } from '@/shared/ui/primitives';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { money, dateLabel } from '@/shared/lib/format';
import { downloadCsv } from '@/shared/utils/csv';

export function CustomerStatement({
  customerId,
  onClose,
  onReceipt,
}: {
  customerId: string;
  onClose: () => void;
  onReceipt: (jobId: string) => void;
}) {
  const customers = useDemo((state) => state.customers);
  const jobs = useDemo((state) => state.jobs);
  const transactions = useDemo((state) => state.transactions);
  const customer = customers.find((item) => item.id === customerId);
  const orders = jobs.filter((job) => job.customerId === customerId);
  const receipts = transactions.filter(
    (item) => item.kind === 'receipt' && orders.some((job) => job.id === item.jobId),
  );
  const account = getCustomerAccount(customerId, jobs, transactions);

  return (
    <Modal title={`صورت‌حساب ${customer?.name ?? ''}`} onClose={onClose}>
      <div className="flex flex-col gap-5 p-6">
        <p className="text-sm">
          خدمات قطعی: {money(account.charge)} · دریافت: {money(account.receipts)} · مطالبات:{' '}
          {money(account.outstanding)} · پیش‌دریافت / بستانکاری: {money(account.credit)}
        </p>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              [
                ['سفارش', 'تاریخ', 'خدمات قطعی', 'دریافت', 'مانده بدهی', 'پیش‌دریافت / بستانکاری'],
                ...orders.map((job) => {
                  const row = getOrderAccount(job, transactions);
                  return [
                    job.id,
                    job.date,
                    String(row.charge),
                    String(row.receipts),
                    String(row.outstanding),
                    String(row.credit),
                  ];
                }),
              ],
              `customer-${customerId}-statement.csv`,
            )
          }
        >
          خروجی صورت‌حساب CSV
        </Button>
        <h3 className="font-semibold">ریز حساب سفارش‌ها</h3>
        <Table>
          <TableHeader>
            <TableRow>
              {['سفارش', 'خدمات قطعی', 'دریافت', 'بدهی', 'وضعیت', 'عملیات'].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((job) => {
              const row = getOrderAccount(job, transactions);
              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <bdi>{job.id}</bdi>
                    <p>{job.appliance}</p>
                  </TableCell>
                  <TableCell>{money(row.charge)}</TableCell>
                  <TableCell>{money(row.receipts)}</TableCell>
                  <TableCell>{money(row.outstanding)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{paymentStatusLabels[row.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {job.status !== 'cancelled' && job.total > row.receipts ? (
                      <Button size="sm" variant="outline" onClick={() => onReceipt(job.id)}>
                        ثبت دریافت
                      </Button>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!orders.length ? <EmptyState text="سفارشی برای این مشتری ثبت نشده است." /> : null}
        <h3 className="font-semibold">رسیدهای دریافت وجه</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تاریخ</TableHead>
              <TableHead>سفارش</TableHead>
              <TableHead>شرح</TableHead>
              <TableHead>مبلغ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{dateLabel(item.date)}</TableCell>
                <TableCell>
                  <bdi>{item.jobId}</bdi>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{money(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!receipts.length ? <EmptyState text="دریافتی ثبت نشده است." /> : null}
      </div>
    </Modal>
  );
}
