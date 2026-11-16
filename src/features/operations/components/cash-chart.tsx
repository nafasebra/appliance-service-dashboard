import { useDemo } from '../model/demo-store';
import { number, dateLabel } from '@/shared/lib/format';

export function CashChart() {
  const { transactions } = useDemo();
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
  const max = Math.max(...points.flatMap((item) => [item.incoming, item.outgoing]), 1);
  return (
    <div className="cash-chart">
      <div className="chart-legend">
        <span>
          <i className="legend-in" />
          دریافت
        </span>
        <span>
          <i className="legend-out" />
          پرداخت
        </span>
        <small>میلیون تومان · دادهٔ نمونه</small>
      </div>
      <div className="chart-plot">
        <div className="chart-axis">
          {[1, 0.75, 0.5, 0.25, 0].map((factor) => (
            <span key={factor}>{number(Math.round((max * factor) / 100000) / 10)}</span>
          ))}
        </div>
        <div className="chart-bars">
          {points.map((point) => (
            <div className="bar-column" key={point.date}>
              <div className="bar-pair">
                <div
                  className="bar incoming"
                  style={{ height: `${(point.incoming / max) * 100}%` }}
                  title={`دریافت ${number(point.incoming)} تومان`}
                />
                <div
                  className="bar outgoing"
                  style={{ height: `${(point.outgoing / max) * 100}%` }}
                  title={`پرداخت ${number(point.outgoing)} تومان`}
                />
              </div>
              <span>{dateLabel(point.date)}</span>
            </div>
          ))}
        </div>
      </div>
      <details className="chart-data">
        <summary>مشاهده اعداد نمودار</summary>
        {points.map((point) => (
          <p key={point.date}>
            {dateLabel(point.date)}: دریافت {number(point.incoming)}، پرداخت{' '}
            {number(point.outgoing)} تومان
          </p>
        ))}
      </details>
    </div>
  );
}
