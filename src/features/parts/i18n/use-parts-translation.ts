import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function usePartsTranslation(): TFunction<'parts'> {
  return useTranslation('parts').t;
}
