export type StaffRole = 'Maid' | 'Cook' | 'Driver' | 'Nanny' | 'Cleaner' | 'Gardener' | 'Other';
export type SalaryType = 'Monthly' | 'Daily';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day' | 'Paid Leave';

export interface Worker {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  salaryType: SalaryType;
  rate: number; // Monthly salary or Daily wage
  shiftTiming: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  avatarColor: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  reason?: string; // Reason for present/absent
}

export interface AdvancePayment {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  reason: string;
  deductedFromSalaryMonth?: string; // YYYY-MM
}

export interface SalaryPayment {
  id: string;
  workerId: string;
  month: string; // YYYY-MM
  baseSalary: number;
  bonus: number;
  advanceDeducted: number;
  netPaid: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer';
  notes?: string;
  status: 'Sent' | 'Pending';
}
