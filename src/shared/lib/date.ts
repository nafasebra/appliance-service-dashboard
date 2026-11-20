import i18next from 'i18next';
import { getLocale } from '../i18n/index';

export function parseIsoDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  )
    return undefined;

  return date;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatJalaliDate(value: string): string {
  const date = parseIsoDate(value);
  return date
    ? new Intl.DateTimeFormat(`${getLocale()}-u-ca-persian`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    : i18next.t('select.selectDate');
}
