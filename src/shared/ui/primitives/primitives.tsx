import { useSharedTranslation } from '@/shared/hooks';
import { translateLabel } from '../../i18n/index.ts';
import { cn } from '@/shared/lib';
import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import i18next from 'i18next';

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const t = useSharedTranslation();
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 max-mobile:items-start">
      <div className="min-w-0 flex-1 basis-64">
        <div className="text-muted-foreground text-caption mb-2.5">
          {t('layout.workspaceServiceManagement')}
        </div>
        <h1>{translateLabel(title)}</h1>
        <p className="mt-2 text-body leading-relaxed text-muted-foreground">
          {translateLabel(description)}
        </p>
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
  useSharedTranslation();
  return (
    <Card
      className={cn(
        'min-w-0 gap-0 overflow-hidden rounded-lg border border-border bg-card py-0 text-card-foreground',
        className,
      )}
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 px-6 py-5 max-mobile:p-4">
        <div className="min-w-0">
          <h2 className="text-section font-semibold">{translateLabel(title)}</h2>
          {subtitle && (
            <p className="mt-2 text-caption leading-relaxed text-muted-foreground">
              {translateLabel(subtitle)}
            </p>
          )}
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
  value: string | number;
  detail: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  useSharedTranslation();
  return (
    <Card
      className={cn(
        'gap-0 rounded-lg border border-border bg-card px-7 py-4 text-card-foreground max-desktop:p-3.75 max-compact:p-3',
        accent && 'border-primary/30 bg-accent/30',
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground text-body gap-2">
        <span>{translateLabel(title)}</span>
        <span className="text-primary bg-muted h-8.25 w-8.25 rounded-md grid place-items-center shrink-0 max-mobile:w-7.25 max-mobile:h-7.25 dark:bg-accent dark:text-primary">
          {icon}
        </span>
      </div>
      <div className="mt-4 text-metric font-semibold tracking-tight tabular-nums break-words max-mobile:text-page-title">
        {value}
      </div>
      <div className="flex items-center gap-1.25 text-caption mt-3.5 text-muted-foreground [&_svg]:text-primary">
        {translateLabel(detail)}
      </div>
    </Card>
  );
}
export function EmptyState({
  text = i18next.t('table.noResultsFoundTryDifferentFilters'),
}: {
  text?: string;
}) {
  useSharedTranslation();
  return (
    <div className="flex items-center justify-center flex-col gap-3.5 py-10 px-5 text-muted-foreground text-body leading-loose text-center">
      <Inbox size={30} />
      <p>{translateLabel(text)}</p>
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
  const t = useSharedTranslation();
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border border-border rounded-lg w-[min(680px,_calc(100vw_-_32px))] max-h-[88vh] overflow-y-auto p-0 shadow-xl m-auto text-primary [&::backdrop]:bg-foreground/40 [&::backdrop]:backdrop-blur-0.75 dark:bg-card dark:border-border dark:text-foreground dark:[&::backdrop]:bg-foreground/40 max-w-170 gap-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle id="modal-title">{translateLabel(title)}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('dialog.titleDialog', { title })}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
