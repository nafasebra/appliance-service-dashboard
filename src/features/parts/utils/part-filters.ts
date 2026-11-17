import type { Customer, Job } from '@/entities/service/model/types';
import type { Part } from '../model/parts';

export function getPartJobLabel(id: string, jobs: Job[], customers: Customer[]): string {
  const job = jobs.find((item) => item.id === id);
  return job
    ? `${job.id} · ${customers.find((customer) => customer.id === job.customerId)?.name ?? ''} · ${job.appliance}`
    : `${id} · سفارش در دسترس نیست`;
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
    `${part.name} ${part.code} ${part.compatibility}`.toLowerCase().includes(search.toLowerCase()),
  );
}
