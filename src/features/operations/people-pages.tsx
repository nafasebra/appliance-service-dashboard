import { useState } from 'react';
import { Search, Phone, MapPin, Wrench, ArrowUpLeft } from 'lucide-react';
import { useDemo } from './model/demo-store';
import { summarizeFinance } from './model/finance';
import { JobTable } from './components/job-table';
import { JobEditor } from './components/job-editor';
import type { Job } from './model/types';
import { PageHeading, Panel, EmptyState, Modal } from '@/shared/ui/primitives';
import { money, number } from '@/shared/lib/format';

export function TechniciansPage() {
  const { jobs, transactions, technicians } = useDemo();
  return (
    <>
      <PageHeading title="تعمیرکاران" description="تخصص، محدوده فعالیت و حساب خدمات هر عضو تیم." />
      <div className="technician-grid">
        {technicians.map((tech, index) => {
          const assigned = jobs.filter((job) => job.technicianId === tech.id);
          const active = assigned.filter((job) => !['completed', 'cancelled'].includes(job.status));
          const finance = summarizeFinance(
            assigned,
            transactions.filter((item) => assigned.some((job) => job.id === item.jobId)),
          );
          return (
            <section className="technician-card" key={tech.id}>
              <div className="technician-top">
                <span className={`avatar avatar-${index % 4}`}>
                  {tech.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span className={`badge ${active.length ? 'status-working' : 'status-completed'}`}>
                  {active.length ? `${number(active.length)} درخواست باز` : 'بدون درخواست باز'}
                </span>
              </div>
              <h2>{tech.name}</h2>
              <p>
                <Wrench size={15} />
                {tech.specialty}
              </p>
              <p>
                <MapPin size={15} />
                {tech.area}
              </p>
              <a
                className="phone-link"
                href={`tel:${tech.phone.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))}`}
              >
                <Phone size={15} />
                <bdi>{tech.phone}</bdi>
              </a>
              <div className="technician-stats">
                <div>
                  <small>خدمات تکمیل‌شده</small>
                  <strong>
                    {number(assigned.filter((job) => job.status === 'completed').length)}
                  </strong>
                </div>
                <div>
                  <small>مانده قابل پرداخت</small>
                  <strong>{money(finance.payable)}</strong>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <p className="footnote">
        مانده تعمیرکار فقط از خدمات تکمیل‌شده و پرداخت‌های ثبت‌شده محاسبه می‌شود؛ این صفحه وضعیت
        زنده حضور یا موقعیت مکانی نیست.
      </p>
    </>
  );
}

export function CustomersPage() {
  const { customers, jobs } = useDemo();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [editor, setEditor] = useState<Job | null>(null);
  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.phone} ${customer.address}`.includes(query.trim()),
  );
  return (
    <>
      <PageHeading
        title="مشتریان"
        description="اطلاعات تماس، آدرس و سوابق خدمات مشتریان در یک جا."
      />
      <Panel title="دفتر مشتریان" subtitle={`${number(customers.length)} مشتری نمونه`}>
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label="جستجوی مشتری"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی نام، تلفن یا آدرس…"
            />
          </label>
        </div>
        {filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>نام مشتری</th>
                  <th>تلفن</th>
                  <th>آدرس</th>
                  <th>تعداد درخواست</th>
                  <th>سوابق</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>
                      <bdi>{customer.phone}</bdi>
                    </td>
                    <td>{customer.address}</td>
                    <td>{number(jobs.filter((job) => job.customerId === customer.id).length)}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => setSelected(customer.id)}
                        aria-label={`سوابق ${customer.name}`}
                      >
                        <ArrowUpLeft size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </Panel>
      {selected && (
        <Modal
          title={`سوابق ${customers.find((item) => item.id === selected)?.name}`}
          onClose={() => setSelected(null)}
        >
          <JobTable
            jobs={jobs.filter((job) => job.customerId === selected)}
            onSelect={(job) => {
              setSelected(null);
              setEditor(job);
            }}
          />
        </Modal>
      )}
      {editor && <JobEditor job={editor} onClose={() => setEditor(null)} />}
    </>
  );
}
