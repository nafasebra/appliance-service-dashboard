import { useFinanceTranslation } from '../i18n/use-finance-translation';
import { useDemo } from '@/shared/store/demo-store';
import { getCashChartData } from '../utils/cash-chart';
import { dateLabel } from '@/shared/lib/format';
import { useTranslation } from 'react-i18next';

export function CashChart() {
  const t = useFinanceTranslation();
  const { t: tShared } = useTranslation();
  const transactions = useDemo((state) => state.transactions);
  const { points, max } = getCashChartData(transactions);
  return (
    <div>
      <div className="flex gap-4 items-center pt-0 px-6 pb-3 text-3xs text-muted-foreground [&_>_span]:flex [&_>_span]:gap-1.25 [&_>_span]:items-center [&_i]:h-1.75 [&_i]:w-1.75 [&_i]:rounded-xs [&_small]:ms-auto [&_small]:text-4xs">
        <span>
          <i className="bg-primary" />
          {tShared('ui.received2')}
        </span>
        <span>
          <i className="bg-muted dark:bg-muted" />
          {t('chart.paid')}
        </span>
        <small>{t('chart.millionTomanSampleData')}</small>
      </div>
      <div className="flex gap-3.5 mt-1.25 mx-6 mb-0 direction-ltr h-42.5">
        <div className="flex flex-col justify-between text-muted-foreground text-3xs pb-6.25 w-3.75">
          {[1, 0.75, 0.5, 0.25, 0].map((factor) => (
            <span key={factor}>{Math.round((max * factor) / 100000) / 10}</span>
          ))}
        </div>
        <div className="bg-chart-grid flex flex-1 justify-around">
          {points.map((point) => (
            <div
              className="flex flex-col items-center flex-1 min-w-0 [&_>_span]:text-4xs [&_>_span]:text-muted-foreground [&_>_span]:mt-2.5 [&_>_span]:whitespace-nowrap"
              key={point.date}
            >
              <div className="flex items-end justify-center gap-1 h-36.25 w-full py-0 px-1.25">
                <div
                  className="w-4.25 rounded-t-sm min-h-0.25 bg-primary"
                  style={{ height: `${(point.incoming / max) * 100}%` }}
                  title={t('chart.receivedIncomingToman', { incoming: point.incoming })}
                />
                <div
                  className="w-4.25 rounded-t-sm min-h-0.25 bg-muted dark:bg-muted"
                  style={{ height: `${(point.outgoing / max) * 100}%` }}
                  title={t('chart.paidOutgoingToman', { outgoing: point.outgoing })}
                />
              </div>
              <span>{dateLabel(point.date)}</span>
            </div>
          ))}
        </div>
      </div>
      <details className="my-4.5 mx-6 text-3xs text-muted-foreground [&_summary]:cursor-pointer [&_p]:mt-1.75">
        <summary>{t('chart.viewChartValues')}</summary>
        {points.map((point) => (
          <p key={point.date}>
            {t('chart.point', {
              date: dateLabel(point.date),
              incoming: point.incoming,
              outgoing: point.outgoing,
            })}
          </p>
        ))}
      </details>
    </div>
  );
}
