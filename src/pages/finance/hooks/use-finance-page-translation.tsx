import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
export function useFinancePageTranslation(): TFunction<'finance-page'> {
  return useTranslation('finance-page').t;
}
