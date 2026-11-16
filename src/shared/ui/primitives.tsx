import type { ReactNode } from 'react';
import { Inbox, ArrowUpLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
    <div className="page-heading">
      <div>
        <div className="eyebrow">فضای کاری / مدیریت خدمات</div>
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
    <Card className={`panel gap-0 py-0 ${className}`}>
      <CardHeader className="panel-heading flex-row">
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
    <Card className={`stat-card gap-0 py-0 ${accent ? 'stat-accent' : ''}`}>
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">
        <ArrowUpLeft size={14} />
        {detail}
      </div>
    </Card>
  );
}
export function EmptyState({ text = 'موردی پیدا نشد. فیلترها را تغییر دهید.' }: { text?: string }) {
  return (
    <div className="empty-state">
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
      <DialogContent className="modal max-w-[680px] gap-0 p-0" dir="rtl">
        <DialogHeader className="modal-heading">
          <DialogTitle id="modal-title">{title}</DialogTitle>
          <DialogDescription className="sr-only">پنجرهٔ {title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
