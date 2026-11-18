import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useSharedTranslation(): TFunction<'common'> {
  return useTranslation('common').t;
}
