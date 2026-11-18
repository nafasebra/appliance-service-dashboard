import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export function useSettingsTranslation(): TFunction<'settings'> {
  return useTranslation('settings').t;
}
