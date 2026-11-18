import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useDispatchTranslation(): TFunction<'dispatch'> {
  return useTranslation('dispatch').t;
}
