import type { Customer, Job } from '@/entities/service';
import type { Part } from '@/entities/inventory';
import i18next from 'i18next';
import { translateLabel } from '../../../shared/i18n/index';

export function getPartJobLabel(id: string, jobs: Job[], customers: Customer[]): string {
  const job = jobs.find((item) => item.id === id);
  return job
    ? `${job.id} · ${translateLabel(customers.find((customer) => customer.id === job.customerId)?.name ?? '')} · ${translateLabel(job.appliance)}`
    : i18next.t('parts:orders.idOrderUnavailable', { id });
}

export function matchesPart(
  partId: string,
  parts: Part[],
  appliance: string,
  search: string,
): boolean {
  const part = parts.find((item) => item.id === partId);
  return Boolean(
    part &&
    (appliance === 'all' || part.appliance === appliance) &&
    `${translateLabel(part.name)} ${part.code} ${translateLabel(part.compatibility)} ${part.appliance} ${translateLabel(part.appliance)}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
}
