import type { Transaction } from '@/entities/service/model/types';
import { downloadCsv } from '@/shared/utils/csv';

export function downloadTransactionsCsv(
  transactions: Transaction[],
  labels: Record<Transaction['kind'], string>,
): void {
  const rows = [
    ['تاریخ', 'نوع', 'شرح', 'درخواست', 'مبلغ تومان'],
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
