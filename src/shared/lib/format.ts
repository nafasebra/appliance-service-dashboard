import i18next from 'i18next';
import { getLocale } from '../i18n/index.ts';
export const number = (value: number) => new Intl.NumberFormat(getLocale()).format(value);
export const localizeDigits = (value: string) => {
  const formatter = new Intl.NumberFormat(getLocale(), { useGrouping: false });
  return value.replace(/[0-9٠-٩۰-۹]/g, (digit) => {
    const code = digit.codePointAt(0)!;
    const latinDigit =
      code >= 0x06f0 && code <= 0x06f9
        ? code - 0x06f0
        : code >= 0x0660 && code <= 0x0669
          ? code - 0x0660
          : Number(digit);
    return formatter.format(latinDigit);
  });
};
export const money = (value: number) =>
  getLocale() === 'en'
    ? `$${new Intl.NumberFormat('en-US').format(value)}`
    : i18next.t('format.valueToman', { value: number(value) });
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat(getLocale() === 'en-US' ? 'en-US' : 'fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date(`${value}T12:00:00+03:30`));
