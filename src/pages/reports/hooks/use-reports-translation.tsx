import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useReportsTranslation(): TFunction<'reports'> {
  return useTranslation('reports').t;
}
