import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';
import { Inbox, ArrowUpLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4.5 mb-7 [&_p]:text-[#8b948d] [&_p]:text-[11px] [&_p]:mt-[7px] [&_p]:leading-[1.8] flex items-center justify-between gap-4.5 mb-[26px] max-[761px]:items-start max-[761px]:[&_p]:max-w-[230px] max-[761px]:[&_>_.button]:text-[10px] max-[761px]:[&_>_.button]:p-[9px_10px] dark:[&_p]:text-[#98aaa0]">
      <div>
        <div className="text-[#8d9890] text-[9px] mb-2.5">فضای کاری / مدیریت خدمات</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Panel({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'min-w-0 gap-0 overflow-hidden rounded-[11px] border border-border bg-card py-0 text-card-foreground',
        className,
      )}
    >
      <CardHeader className="flex items-center justify-between gap-[15px] p-[21px_22px_18px] [&_h2]:text-[13px] [&_h2]:font-bold [&_p]:text-[9px] [&_p]:text-[#9aa29c] [&_p]:mt-[7px] [&_p]:leading-[1.8] max-[761px]:p-4.5 dark:[&_p]:text-[#98aaa0] flex-row">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="contents">{children}</CardContent>
    </Card>
  );
}
export function StatCard({
  title,
  value,
  detail,
  icon,
  accent = false,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-[11px] border border-border bg-card p-[19px_18px_16px] py-0 text-card-foreground max-[1201px]:p-[15px] max-[401px]:p-3',
        accent && 'border-primary/30 bg-accent/30',
      )}
    >
      <div className="flex items-center justify-between text-[#818b84] text-[10px] gap-2 max-[761px]:text-[9px] max-[401px]:text-[8px]">
        <span>{title}</span>
        <span className="text-[#6e8a78] bg-[#f2f6f2] h-[33px] w-[33px] rounded-[8px] grid place-items-center shrink-0 max-[761px]:w-[29px] max-[761px]:h-[29px] dark:bg-[#263b31] dark:text-[#8fc4a9]">
          {icon}
        </span>
      </div>
      <div className="mt-4.5 text-[21px] tracking-[-0.7px] font-bold whitespace-nowrap max-[1201px]:text-[18px] max-[761px]:text-[19px] max-[401px]:text-[15px]">
        {value}
      </div>
      <div className="flex items-center gap-[5px] text-[9px] mt-3.5 text-[#96a098] [&_svg]:text-[#6a9374] max-[761px]:text-[8px]">
        <ArrowUpLeft size={14} />
        {detail}
      </div>
    </Card>
  );
}
export function EmptyState({ text = 'موردی پیدا نشد. فیلترها را تغییر دهید.' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center flex-col gap-3.5 p-[40px_20px] text-[#a0ad99] text-[11px] leading-[2] text-center">
      <Inbox size={30} />
      <p>{text}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="border border-[#dce6d7] rounded-[14px] w-[min(680px,_calc(100vw_-_32px))] max-h-[88vh] overflow-y-auto p-0 shadow-[0_24px_90px_#2534212e] m-auto text-[#4d5e47] [&::backdrop]:bg-[#192b2159] [&::backdrop]:backdrop-blur-[3px] dark:bg-[#17211d] dark:border-border dark:text-foreground dark:[&::backdrop]:bg-[#050a08b8] max-w-[680px] gap-0 p-0"
        dir="rtl"
      >
        <DialogHeader className="flex items-center justify-between p-[19px_23px] border-b border-b-[#eaf0e5] [&_h2]:text-[15px] dark:border-[#27362f]">
          <DialogTitle id="modal-title">{title}</DialogTitle>
          <DialogDescription className="sr-only">پنجرهٔ {title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
