import { lazy, Suspense } from 'react';

const CashChartContent = lazy(() =>
  import('./cash-chart.tsx').then((module) => ({ default: module.CashChart })),
);

export function CashChart() {
  return (
    <Suspense fallback={<div aria-hidden="true" className="min-h-48" />}>
      <CashChartContent />
    </Suspense>
  );
}
