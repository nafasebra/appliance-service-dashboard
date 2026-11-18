import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useOverviewTranslation(): TFunction<'overview'> {
  return useTranslation('overview').t;
}
