import i18next from 'i18next';
import { getLocale } from '../i18n/index.ts';
export const number = (value: number) => new Intl.NumberFormat(getLocale()).format(value);
export const money = (value: number) => i18next.t('ui.valueToman', { value: number(value) });
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat(`${getLocale()}-u-ca-persian`, {
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date(`${value}T12:00:00+03:30`));
