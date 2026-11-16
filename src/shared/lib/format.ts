export const number = (value: number) => new Intl.NumberFormat('fa-IR').format(value);
export const money = (value: number) => `${number(value)} تومان`;
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date(`${value}T12:00:00+03:30`));
