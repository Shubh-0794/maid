import { Worker, AttendanceRecord, AdvancePayment, SalaryPayment } from '../types';

const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w-1',
    name: 'Sunita Sharma',
    role: 'Maid',
    phone: '+91 98765 43210',
    salaryType: 'Monthly',
    rate: 6500,
    shiftTiming: '08:00 AM - 11:00 AM',
    joiningDate: '2024-01-15',
    status: 'Active',
    notes: 'Sweeping, mopping, dusting.',
    avatarColor: 'bg-emerald-500 text-white'
  },
  {
    id: 'w-2',
    name: 'Ramesh Kumar',
    role: 'Cook',
    phone: '+91 91234 56789',
    salaryType: 'Monthly',
    rate: 9000,
    shiftTiming: '09:00 AM - 01:00 PM',
    joiningDate: '2024-03-01',
    status: 'Active',
    notes: 'Lunch & breakfast.',
    avatarColor: 'bg-blue-500 text-white'
  }
];

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getCurrentMonthString(): string {
  const d = new Date();
  return d.toISOString().slice(0, 7);
}

function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();

  INITIAL_WORKERS.forEach((worker) => {
    for (let day = 1; day <= Math.min(currentDay, daysInMonth); day++) {
      const dayStr = String(day).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const rand = Math.random();
      let status: AttendanceRecord['status'] = 'Present';
      let reason = 'Regular duty';
      if (rand < 0.1) {
        status = 'Absent';
        reason = 'Personal work / Sick leave';
      }

      records.push({
        id: `att-${worker.id}-${dateStr}`,
        workerId: worker.id,
        date: dateStr,
        status,
        reason
      });
    }
  });

  return records;
}

const INITIAL_PAYMENTS: SalaryPayment[] = [];

export function loadWorkers(): Worker[] {
  const data = localStorage.getItem('maidease_workers');
  if (!data) {
    localStorage.setItem('maidease_workers', JSON.stringify(INITIAL_WORKERS));
    return INITIAL_WORKERS;
  }
  try { return JSON.parse(data); } catch { return INITIAL_WORKERS; }
}

export function saveWorkers(workers: Worker[]) {
  localStorage.setItem('maidease_workers', JSON.stringify(workers));
}

export function loadAttendance(): AttendanceRecord[] {
  const data = localStorage.getItem('maidease_attendance');
  if (!data) {
    const generated = generateInitialAttendance();
    localStorage.setItem('maidease_attendance', JSON.stringify(generated));
    return generated;
  }
  try { return JSON.parse(data); } catch { return []; }
}

export function saveAttendance(records: AttendanceRecord[]) {
  localStorage.setItem('maidease_attendance', JSON.stringify(records));
}

export function loadAdvances(): AdvancePayment[] {
  const data = localStorage.getItem('maidease_advances');
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

export function saveAdvances(advances: AdvancePayment[]) {
  localStorage.setItem('maidease_advances', JSON.stringify(advances));
}

export function loadPayments(): SalaryPayment[] {
  const data = localStorage.getItem('maidease_payments');
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

export function savePayments(payments: SalaryPayment[]) {
  localStorage.setItem('maidease_payments', JSON.stringify(payments));
}
