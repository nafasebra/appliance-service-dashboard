import { FlaskConical } from 'lucide-react';

export function NoticAlert() {
  return (
    <div className="flex justify-between gap-3.75 border-b border-border py-2.5 px-9 text-3xs text-muted-foreground max-tablet:[&_>_span:last-child]:hidden max-mobile:py-2.5 px-4.5 max-mobile:text-3xs dark:border-border dark:bg-muted dark:text-muted-foreground [&_>_span:first-child]:flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-1.5">
      <span>
        <FlaskConical size={14} />
        نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.
      </span>
    </div>
  );
}
