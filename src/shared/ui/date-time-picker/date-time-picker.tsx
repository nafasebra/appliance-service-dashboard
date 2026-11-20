import { useSharedTranslation } from '@/shared/hooks';
import { lazy, Suspense, useState, type ComponentProps } from 'react';
import { CalendarIcon } from 'lucide-react';
import { formatJalaliDate, parseIsoDate, toIsoDate } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import i18next from 'i18next';

const JalaliCalendar = lazy(() =>
  import('@/shared/ui/calendar').then((module) => ({ default: module.Calendar })),
);

type DatePickerProps = {
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  'aria-label'?: string;
};

function DatePicker({
  name,
  value,
  onValueChange,
  required,
  'aria-label': ariaLabel = i18next.t('select.selectDate'),
}: DatePickerProps) {
  const t = useSharedTranslation();
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);
  const isEnglish = i18next.resolvedLanguage?.startsWith('en') ?? true;

  if (isEnglish) {
    return (
      <Input
        type="date"
        name={name}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        required={required}
        aria-label={ariaLabel}
        dir="ltr"
        lang="en-US"
        className="direction-ltr font-latin"
      />
    );
  }

  return (
    <>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-label={ariaLabel}
            aria-required={required}
            data-empty={!selected}
            className="w-full justify-start border-input bg-background px-3 text-start font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {formatJalaliDate(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Suspense
            fallback={
              <div className="grid h-75 w-70 place-items-center text-caption text-muted-foreground">
                {t('select.loadingCalendar')}
              </div>
            }
          >
            <JalaliCalendar
              mode="single"
              selected={selected}
              defaultMonth={selected}
              onSelect={(date) => {
                if (!date) return;
                onValueChange(toIsoDate(date));
                setOpen(false);
              }}
            />
          </Suspense>
        </PopoverContent>
      </Popover>
    </>
  );
}

function TimePicker(props: Omit<ComponentProps<typeof Input>, 'type'>) {
  return <Input type="time" dir="ltr" {...props} />;
}

export { DatePicker, TimePicker };
