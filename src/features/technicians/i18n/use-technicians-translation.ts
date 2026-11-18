import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useTechniciansTranslation(): TFunction<'technicians'> {
  return useTranslation('technicians').t;
}
