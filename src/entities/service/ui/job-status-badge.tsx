import { useSharedTranslation } from '@/shared/hooks';
import { translateLabel } from '../../../shared/i18n/index.ts';
import { statusLabels, JobStatus } from '../model/types.ts';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib';

export function JobStatusBadge({
  status,
  showDot = false,
}: {
  status: JobStatus;
  showDot?: boolean;
}) {
  useSharedTranslation();
  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption whitespace-nowrap',
        status === JobStatus.New && 'bg-status-new text-status-new-foreground',
        status === JobStatus.Accepted && 'bg-accent text-accent-foreground',
        status === JobStatus.Scheduled && 'bg-status-scheduled text-status-scheduled-foreground',
        status === JobStatus.Working && 'bg-status-working text-status-working-foreground',
        status === JobStatus.Completed && 'bg-status-completed text-status-completed-foreground',
        status === JobStatus.Cancelled && 'bg-status-cancelled text-status-cancelled-foreground',
      )}
    >
      {showDot ? <span aria-hidden="true" className="size-1 rounded-full bg-current" /> : null}
      {translateLabel(statusLabels[status])}
    </Badge>
  );
}
