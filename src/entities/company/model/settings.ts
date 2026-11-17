export interface CompanySettings {
  companyName: string;
  brandName: string;
  branchName: string;
  phone: string;
  address: string;
  defaultVisitTime: string;
  defaultPriority: 'normal' | 'urgent';
}

export const defaultCompanySettings: CompanySettings = {
  companyName: 'همیار سرویس',
  brandName: 'HAMYAR SERVICE',
  branchName: 'شعبه تهران',
  phone: '',
  address: '',
  defaultVisitTime: '09:00',
  defaultPriority: 'normal',
};

export function isCompanySettings(value: unknown): value is CompanySettings {
  if (!value || typeof value !== 'object') return false;
  const settings = value as Record<string, unknown>;
  const text = (key: string, max: number, required = false) =>
    typeof settings[key] === 'string' &&
    settings[key].length <= max &&
    (!required || settings[key].trim().length > 0);
  return (
    text('companyName', 60, true) &&
    text('brandName', 40, true) &&
    text('branchName', 60, true) &&
    text('phone', 30) &&
    text('address', 300) &&
    typeof settings.defaultVisitTime === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.defaultVisitTime) &&
    (settings.defaultPriority === 'normal' || settings.defaultPriority === 'urgent')
  );
}
