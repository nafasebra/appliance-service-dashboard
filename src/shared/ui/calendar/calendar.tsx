import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayButton, getDefaultClassNames } from 'react-day-picker';
import { DayPicker, enUS, faIR } from 'react-day-picker/persian';
import { useTranslation } from 'react-i18next';
import { toIsoDate, cn } from '@/shared/lib';
import { Button, buttonVariants } from '@/shared/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();
  const { i18n } = useTranslation();
  const english = i18n.resolvedLanguage === 'en';

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      dir={i18n.dir()}
      numerals={english ? 'latn' : 'arabext'}
      locale={english ? enUS : faIR}
      className={cn('group/calendar bg-background p-3 [--cell-size:--spacing(8)]', className)}
      captionLayout={captionLayout}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        caption_label: cn('text-sm font-medium select-none', defaultClassNames.caption_label),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-md text-body font-normal text-muted-foreground select-none',
          defaultClassNames.weekday,
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        day: cn('relative aspect-square h-full w-full p-0 text-center', defaultClassNames.day),
        today: cn('rounded-md bg-accent text-accent-foreground', defaultClassNames.today),
        outside: cn('text-muted-foreground opacity-50', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...iconProps }) => {
          if (orientation === 'left')
            return <ChevronLeftIcon className={cn('size-4', className)} {...iconProps} />;
          if (orientation === 'right')
            return <ChevronRightIcon className={cn('size-4', className)} {...iconProps} />;
          return <ChevronDownIcon className={cn('size-4', className)} {...iconProps} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={toIsoDate(day.date)}
      data-selected={modifiers.selected}
      className={cn(
        'size-(--cell-size) rounded-md p-0 font-normal data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
