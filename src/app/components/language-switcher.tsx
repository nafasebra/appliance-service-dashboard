import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  
  return (
    <Select value={i18n.resolvedLanguage} dir={i18n.dir()} onValueChange={(language) => { void i18n.changeLanguage(language); }}>
      <SelectTrigger size="sm" aria-label={t('language')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="fa"><span lang="fa" dir="rtl">{t('key282', 'فارسی')}</span></SelectItem>
          <SelectItem value="en"><span lang="en" dir="ltr">English</span></SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
