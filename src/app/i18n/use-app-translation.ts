import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useAppTranslation(): TFunction<'app'> {
  return useTranslation('app').t;
}
