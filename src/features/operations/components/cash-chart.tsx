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
    <div>
      <div className="flex gap-4 items-center p-[0_24px_12px] text-[9px] text-[#87938b] [&_>_span]:flex [&_>_span]:gap-[5px] [&_>_span]:items-center [&_i]:h-[7px] [&_i]:w-[7px] [&_i]:rounded-[2px] [&_small]:ms-auto [&_small]:text-[8px]">
        <span>
          <i className="bg-[#60927b]" />
          دریافت
        </span>
        <span>
          <i className="bg-[#dbe6dd] dark:bg-[#3a4c43]" />
          پرداخت
        </span>
        <small>میلیون تومان · دادهٔ نمونه</small>
      </div>
      <div className="flex gap-3.5 m-[5px_24px_0] direction-ltr h-[170px]">
        <div className="flex flex-col justify-between text-[#a5aca7] text-[9px] pb-[25px] w-[15px]">
          {[1, 0.75, 0.5, 0.25, 0].map((factor) => (
            <span key={factor}>{number(Math.round((max * factor) / 100000) / 10)}</span>
          ))}
        </div>
        <div className="flex-1 flex justify-around bg-[repeating-linear-gradient(_to_top,_transparent_0,_transparent_35px,_#f1f4f1_35px,_#f1f4f1_36px_)] dark:bg-[repeating-linear-gradient(_to_top,_transparent_0,_transparent_35px,_#25342e_35px,_#25342e_36px_)]">
          {points.map((point) => (
            <div
              className="flex flex-col items-center flex-1 min-w-0 [&_>_span]:text-[8px] [&_>_span]:text-[#a0aaa1] [&_>_span]:mt-2.5 [&_>_span]:whitespace-nowrap"
              key={point.date}
            >
              <div className="flex items-end justify-center gap-1 h-[145px] w-full p-[0_5px]">
                <div
                  className="w-[17px] rounded-[4px_4px_0_0] min-h-[1px] bg-[#699a80]"
                  style={{ height: `${(point.incoming / max) * 100}%` }}
                  title={`دریافت ${number(point.incoming)} تومان`}
                />
                <div
                  className="w-[17px] rounded-[4px_4px_0_0] min-h-[1px] bg-[#dce7dd] dark:bg-[#3a4c43]"
                  style={{ height: `${(point.outgoing / max) * 100}%` }}
                  title={`پرداخت ${number(point.outgoing)} تومان`}
                />
              </div>
              <span>{dateLabel(point.date)}</span>
            </div>
          ))}
        </div>
      </div>
      <details className="m-[18px_24px] text-[9px] text-[#8b998e] [&_summary]:cursor-pointer [&_p]:mt-[7px]">
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
