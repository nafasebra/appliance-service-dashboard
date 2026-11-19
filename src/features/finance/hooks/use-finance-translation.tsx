import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useFinanceTranslation(): TFunction<'finance'> {
  return useTranslation('finance').t;
}
