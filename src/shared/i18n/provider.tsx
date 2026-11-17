import type { ReactNode } from 'react';
import { Direction } from 'radix-ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { i18n } from './index';

function LocaleDirection({ children }: { children: ReactNode }) {
  const { i18n: instance } = useTranslation();
  return <Direction.Provider dir={instance.dir()}>{children}</Direction.Provider>;
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LocaleDirection>{children}</LocaleDirection>
    </I18nextProvider>
  );
}
