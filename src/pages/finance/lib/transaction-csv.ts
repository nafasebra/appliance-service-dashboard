import type { Transaction } from '@/entities/service';
import { downloadCsv } from '@/shared/lib';
import { translateLabel } from '../../../shared/i18n/index';
import i18next from 'i18next';

export function downloadTransactionsCsv(
  transactions: Transaction[],
  labels: Record<Transaction['kind'], string>,
): void {
  const rows = [
    [
      i18next.t('fields.date'),
      i18next.t('finance-page:ledger.type'),
      i18next.t('fields.description'),
      i18next.t('finance-page:export.requests'),
      i18next.t('finance-page:register.amountToman'),
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
