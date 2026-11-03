import React, { useState } from 'react';
import { 
  Send, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  CreditCard,
  X,
  FileText
} from 'lucide-react';
import { Worker, AttendanceRecord, SalaryPayment } from '../types';
import { getCurrentMonthString, getTodayDateString } from '../utils/storage';

interface MonthlySalarySendTabProps {
  workers: Worker[];
  attendanceRecords: AttendanceRecord[];
  payments: SalaryPayment[];
  onSavePayment: (payment: Omit<SalaryPayment, 'id'>) => void;
}

export const MonthlySalarySendTab: React.FC<MonthlySalarySendTabProps> = ({
  workers,
  attendanceRecords,
  payments,
  onSavePayment
}) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetWorker, setTargetWorker] = useState<Worker | null>(null);
  const [bonus, setBonus] = useState('0');
  const [method, setMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [notes, setNotes] = useState('');

  const handleOpenSendModal = (worker: Worker) => {
    setTargetWorker(worker);
    setBonus('0');
    setNotes('Monthly salary paid successfully');
    setIsModalOpen(true);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWorker) return;

    const workerAtt = attendanceRecords.filter(
      (a) => a.workerId === targetWorker.id && a.date.startsWith(selectedMonth)
    );
    const presentDays = workerAtt.filter((a) => a.status === 'Present').length;
    
    const baseSalary = targetWorker.rate;
    const bonusNum = parseFloat(bonus) || 0;
    const netPaid = baseSalary + bonusNum;

    onSavePayment({
      workerId: targetWorker.id,
      month: selectedMonth,
      baseSalary,
      bonus: bonusNum,
      advanceDeducted: 0,
      netPaid,
      paymentDate: getTodayDateString(),
      paymentMethod: method,
      notes: notes.trim(),
      status: 'Sent'
    });

    setIsModalOpen(false);
    setTargetWorker(null);
  };

  if (workers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500 mb-3">No staff members found.</p>
        <p className="text-xs text-indigo-600 font-semibold">Tap 'Add Staff' above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Month Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase">Salary Month:</span>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Staff Salary Cards */}
      <div className="space-y-4">
        {workers.map((worker) => {
          const workerAtt = attendanceRecords.filter(
            (a) => a.workerId === worker.id && a.date.startsWith(selectedMonth)
          );
          const presentDays = workerAtt.filter((a) => a.status === 'Present').length;
          const absentDays = workerAtt.filter((a) => a.status === 'Absent').length;

          const existingPayment = payments.find(
            (p) => p.workerId === worker.id && p.month === selectedMonth
          );

          return (
            <div 
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md ${worker.avatarColor}`}>
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
                    <p className="text-xs text-slate-500">{worker.role} • <span className="text-indigo-600 font-medium">₹{worker.rate}/mo</span></p>
                  </div>
                </div>

                {existingPayment ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    Sent 💸
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 mr-1 text-amber-600" />
                    Pending
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Present:</span>
                  <span className="font-bold text-emerald-700 ml-1.5">{presentDays} days</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Absent:</span>
                  <span className="font-bold text-rose-700 ml-1.5">{absentDays} days</span>
                </div>
              </div>

              {existingPayment && (
                <div className="text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 text-indigo-900 flex justify-between items-center">
                  <span>Paid: <strong>₹{existingPayment.netPaid}</strong> ({existingPayment.paymentMethod})</span>
                  <span className="text-[10px] text-indigo-600">{existingPayment.paymentDate}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Monthly Salary</span>
                  <div className="text-sm font-extrabold text-slate-900">₹{worker.rate.toLocaleString()}</div>
                </div>

                <button
                  onClick={() => handleOpenSendModal(worker)}
                  className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {existingPayment ? 'Send Again' : 'Send Monthly Salary'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Send Payment Modal (Mobile Optimized Bottom Sheet) */}
      {isModalOpen && targetWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Send Salary: {targetWorker.name}</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Month:</span>
                  <span className="font-bold text-indigo-600">{selectedMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Salary:</span>
                  <span className="font-bold text-slate-900">₹{targetWorker.rate}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-medium">Bonus / Tip (+) :</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className="w-24 px-2 py-1.5 text-right text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-between font-bold text-xs text-indigo-900 pt-2 border-t border-slate-200">
                  <span>Net Total:</span>
                  <span className="text-indigo-700 text-sm">₹{targetWorker.rate + (parseFloat(bonus) || 0)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3.5 py-3 text-xs rounded-xl border border-slate-300 bg-white font-medium outline-none"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid successfully"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs rounded-xl border border-slate-300 bg-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200"
                >
                  Confirm Send 💸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
