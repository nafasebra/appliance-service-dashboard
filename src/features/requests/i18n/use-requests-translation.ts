import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useRequestsTranslation(): TFunction<'requests'> {
  return useTranslation('requests').t;
}
