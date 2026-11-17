import type { Transaction } from '@/entities/service/model/types';
import { downloadCsv } from '@/shared/utils/csv';
import i18next from 'i18next'

export function downloadTransactionsCsv(
  transactions: Transaction[],
  labels: Record<Transaction['kind'], string>,
): void {
  const rows = [
    [i18next.t('key324', 'تاریخ'), i18next.t('key325', 'نوع'), i18next.t('key85', 'شرح'), i18next.t('key172', 'درخواست'), i18next.t('key213', 'مبلغ تومان')],
    ...transactions.map((item) => [
      item.date,
      labels[item.kind],
      item.description,
      item.jobId,
      String(item.amount),
    ]),
  ];
  downloadCsv(rows, 'demo-transactions.csv');
}
