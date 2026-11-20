import { getLocale } from '../i18n/index';
const collators = new Map<string, Intl.Collator>();

export function compareTableValues(left: unknown, right: unknown): number {
  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  const locale = getLocale();
  const collator =
    collators.get(locale) ?? new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  collators.set(locale, collator);
  return collator.compare(String(left), String(right));
}
