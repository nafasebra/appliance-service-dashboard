import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
export function useRequestsPageTranslation(): TFunction<'requests-page'> {
  return useTranslation('requests-page').t;
}
