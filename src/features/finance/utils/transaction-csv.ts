import type { Transaction } from '@/entities/service/model/types';
import { downloadCsv } from '@/shared/utils/csv';
import { translateLabel } from '@/shared/i18n';
import i18next from 'i18next';

export function downloadTransactionsCsv(
  transactions: Transaction[],
  labels: Record<Transaction['kind'], string>,
): void {
  const rows = [
    [
      i18next.t('ui.date'),
      i18next.t('ui.type'),
      i18next.t('ui.description'),
      i18next.t('ui.requests'),
      i18next.t('ui.amountToman'),
    ],
    ...transactions.map((item) => [
      item.date,
      translateLabel(labels[item.kind]),
      item.description,
      item.jobId,
      String(item.amount),
    ]),
  ];
  downloadCsv(rows, 'demo-transactions.csv');
}
