export type JobStatus = 'new' | 'scheduled' | 'working' | 'completed' | 'cancelled';
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
  new: 'در انتظار اعزام',
  scheduled: 'برنامه‌ریزی شده',
  working: 'در حال انجام',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};
export const appliances: Appliance[] = ['یخچال', 'لباسشویی', 'ظرفشویی', 'کولر گازی', 'اجاق گاز'];
