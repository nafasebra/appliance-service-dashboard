import type { Transaction } from '@/entities/service/model/types';

export function getCashChartData(transactions: Transaction[]) {
  const dates = [...new Set(transactions.map((item) => item.date))].sort().slice(-7);
  const points = dates.map((date) => ({
    date,
    incoming: transactions
      .filter((item) => item.date === date && item.kind === 'receipt')
      .reduce((sum, item) => sum + item.amount, 0),
    outgoing: transactions
      .filter((item) => item.date === date && item.kind !== 'receipt')
      .reduce((sum, item) => sum + item.amount, 0),
  }));
  return {
    points,
    max: Math.max(...points.flatMap((point) => [point.incoming, point.outgoing]), 1),
  };
}
