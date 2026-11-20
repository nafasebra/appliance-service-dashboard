import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { WorkflowFailure } from '@/entities/service';
import { translateLabel } from '../../../shared/i18n/index';
import type { WorkflowQueue } from '../model/workflow-queues';

export function useCartableTranslation(): TFunction<'cartable'> {
  return useTranslation('cartable').t;
}

export function useCartableQueueDescription(queue: WorkflowQueue): string {
  const t = useCartableTranslation();
  const descriptions = {
    inbox: t('queues.inbox.description'),
    assignment: t('queues.assignment.description'),
    active: t('queues.active.description'),
    collection: t('queues.collection.description'),
    settlement: t('queues.settlement.description'),
    archive: t('queues.archive.description'),
  };
  return descriptions[queue];
}

export function useWorkflowFailureMessage(failure: WorkflowFailure | null): string {
  const t = useCartableTranslation();
  const errors = {
    notFound: t('errors.notFound'),
    stale: t('errors.stale'),
    invalidTransition: t('errors.invalidTransition'),
    invalidAssignment: t('errors.invalidAssignment'),
    invalidAmount: t('errors.invalidAmount'),
    invalidData: t('errors.invalidData'),
  };
  return !failure
    ? ''
    : failure.code === 'financialGuard'
      ? translateLabel(failure.message)
      : errors[failure.code];
}
