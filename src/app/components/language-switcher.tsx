import { useSharedTranslation } from '@/shared/i18n/use-shared-translation';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export function LanguageSwitcher() {
  const tShared = useSharedTranslation();
  const { i18n } = useTranslation();

  return (
    <Select
      value={i18n.resolvedLanguage}
      dir={i18n.dir()}
      onValueChange={(language) => {
        void i18n.changeLanguage(language);
      }}
    >
      <SelectTrigger size="sm" aria-label={tShared('language')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="fa">
            <span lang="fa" dir="rtl">
              {tShared('languages.persian')}
            </span>
          </SelectItem>
          <SelectItem value="en">
            <span lang="en" dir="ltr">
              {tShared('languages.english')}
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
