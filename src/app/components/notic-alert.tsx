import { FlaskConical } from 'lucide-react';

export function NoticAlert() {
  return (
    <div className="flex justify-between gap-[15px] border-b border-[#e9eeeb] p-[10px_36px] text-[9px] text-[#8b938e] max-[981px]:[&_>_span:last-child]:hidden max-[761px]:p-[10px_18px] max-[761px]:text-[9px] dark:border-border dark:bg-[#131d19] dark:text-[#92a198] [&_>_span:first-child]:flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-1.5">
      <span>
        <FlaskConical size={14} />
        نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.
      </span>
      <span>دوشنبه، ۲۵ آبان ۱۴۰۵ · تاریخ مرجع نمونه</span>
    </div>
  );
}
