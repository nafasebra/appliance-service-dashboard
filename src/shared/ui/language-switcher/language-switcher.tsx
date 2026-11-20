import { useSharedTranslation } from '@/shared/hooks';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/shared/ui/select';

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
      <SelectTrigger
        size="sm"
        aria-label={tShared('language')}
        title={tShared('language')}
        className="h-9 w-9 justify-center p-0 [&>svg:last-child]:hidden"
      >
        <Languages aria-hidden="true" className="size-4" />
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
