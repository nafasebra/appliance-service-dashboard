import { translateLabel } from '@/shared/i18n';
import { statusLabels, type JobStatus } from '../model/types';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

export function JobStatusBadge({
  status,
  showDot = false,
}: {
  status: JobStatus;
  showDot?: boolean;
}) {
  useTranslation();
  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs whitespace-nowrap',
        status === 'new' && 'bg-status-new text-status-new-foreground',
        status === 'scheduled' && 'bg-status-scheduled text-status-scheduled-foreground',
        status === 'working' && 'bg-status-working text-status-working-foreground',
        status === 'completed' && 'bg-status-completed text-status-completed-foreground',
        status === 'cancelled' && 'bg-status-cancelled text-status-cancelled-foreground',
      )}
    >
      {showDot ? <span aria-hidden="true" className="size-1 rounded-full bg-current" /> : null}
      {translateLabel(statusLabels[status])}
    </Badge>
  );
}
