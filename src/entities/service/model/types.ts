export enum JobStatus {
  New = 'new',
  Accepted = 'accepted',
  Scheduled = 'scheduled',
  Working = 'working',
  Completed = 'completed',
  Cancelled = 'cancelled',
}
export type Appliance = 'یخچال' | 'لباسشویی' | 'ظرفشویی' | 'کولر گازی' | 'اجاق گاز';
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}
export interface Technician {
  id: string;
  name: string;
  specialty: string;
  area: string;
  phone: string;
}
export interface Job {
  id: string;
  customerId: string;
  appliance: Appliance;
  brand: string;
  issue: string;
  status: JobStatus;
  priority: 'normal' | 'urgent';
  technicianId: string;
  date: string;
  time: string;
  total: number;
  commission: number;
}
export interface Transaction {
  method?: 'cash' | 'card' | 'bank';
  reference?: string;
  id: string;
  jobId: string;
  kind: 'receipt' | 'payout' | 'expense';
  amount: number;
  date: string;
  description: string;
}
export interface DemoData {
  customers: Customer[];
  technicians: Technician[];
  jobs: Job[];
  transactions: Transaction[];
}
export const statusLabels: Record<JobStatus, string> = {
  [JobStatus.New]: 'در انتظار بررسی',
  [JobStatus.Accepted]: 'تأییدشده، در انتظار تخصیص',
  [JobStatus.Scheduled]: 'برنامه‌ریزی شده',
  [JobStatus.Working]: 'در حال انجام',
  [JobStatus.Completed]: 'تکمیل شده',
  [JobStatus.Cancelled]: 'لغو شده',
};
export const appliances: Appliance[] = ['یخچال', 'لباسشویی', 'ظرفشویی', 'کولر گازی', 'اجاق گاز'];
