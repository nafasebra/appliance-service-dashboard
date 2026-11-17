import { Link } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { useDemo } from '@/entities/service/model/demo-store';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

const persianNumber = new Intl.NumberFormat('fa');

export function NotificationButton() {
  const { jobs } = useDemo();
  const newJobs = jobs.filter((job) => job.status === 'new');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="relative grid h-7.75 w-7.75 shrink-0 place-items-center rounded-md border-border bg-background text-primary hover:bg-accent"
          aria-label="مشاهده اعلان‌ها"
        >
          <Bell size={18} />
          {newJobs.length > 0 ? (
            <span className="absolute -end-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-3xs leading-none text-white">
              {persianNumber.format(newJobs.length)}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-85 p-0 max-narrow:w-[calc(100vw-32px)]"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">اعلان‌ها</h2>
          <p className="mt-1 text-2xs text-muted-foreground">آخرین درخواست‌های نیازمند بررسی</p>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {newJobs.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              اعلان جدیدی ندارید.
            </p>
          ) : (
            newJobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                to="/requests"
                className="flex gap-3 rounded-md px-3 py-3 hover:bg-accent"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="min-w-0">
                  <strong className="block truncate text-xs">درخواست جدید {job.appliance}</strong>
                  <span className="mt-1 block truncate text-2xs text-muted-foreground">
                    {job.issue}
                  </span>
                  <span className="mt-1.5 block text-3xs text-muted-foreground">
                    {job.date} · {job.time}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
