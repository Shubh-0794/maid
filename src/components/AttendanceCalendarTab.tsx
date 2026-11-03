import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Worker, AttendanceRecord, AttendanceStatus } from '../types';
import { getTodayDateString } from '../utils/storage';

interface AttendanceCalendarTabProps {
  workers: Worker[];
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (workerId: string, date: string, status: AttendanceStatus, reason: string) => void;
}

export const AttendanceCalendarTab: React.FC<AttendanceCalendarTabProps> = ({
  workers,
  attendanceRecords,
  onMarkAttendance
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '');

  React.useEffect(() => {
    if (workers.length > 0 && !workers.some(w => w.id === selectedWorkerId)) {
      setSelectedWorkerId(workers[0].id);
    }
  }, [workers, selectedWorkerId]);

  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [activeDayModal, setActiveDayModal] = useState<string | null>(null); // YYYY-MM-DD
  const [statusInput, setStatusInput] = useState<AttendanceStatus>('Present');
  const [reasonInput, setReasonInput] = useState<string>('Regular Duty');

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const openDayModal = (dayNum: number) => {
    const dayStr = String(dayNum).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const existing = attendanceRecords.find(
      (a) => a.workerId === selectedWorker?.id && a.date === dateStr
    );

    setActiveDayModal(dateStr);
    setStatusInput(existing ? existing.status : 'Present');
    setReasonInput(existing ? (existing.reason || '') : 'Regular Duty');
  };

  const handleSaveDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDayModal || !selectedWorker) return;

    onMarkAttendance(selectedWorker.id, activeDayModal, statusInput, reasonInput.trim());
    setActiveDayModal(null);
  };

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const workerMonthRecs = attendanceRecords.filter(
    (a) => a.workerId === selectedWorker?.id && a.date.startsWith(monthPrefix)
  );

  const presentCount = workerMonthRecs.filter((a) => a.status === 'Present').length;
  const absentCount = workerMonthRecs.filter((a) => a.status === 'Absent').length;

  const quickReasons = ['Regular Duty', 'Sick Leave', 'Personal Work', 'Family Function', 'Half Day'];
  const todayStr = getTodayDateString();

  if (workers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 mx-4">
        <p className="text-sm text-slate-500 mb-3">No staff members found.</p>
        <p className="text-xs text-indigo-600 font-semibold">Tap 'Add Staff' above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24 px-3 sm:px-0">
      {/* Staff Selector Pills (Touch Friendly) */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {workers.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkerId(w.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedWorkerId === w.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${w.avatarColor}`}>
                {w.name.charAt(0)}
              </div>
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Month Navigation & Summary */}
      {selectedWorker && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 text-sm tracking-wide">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-center">
              <div className="text-lg font-extrabold text-emerald-700">{presentCount}</div>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Present Days</div>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-center">
              <div className="text-lg font-extrabold text-rose-700">{absentCount}</div>
              <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide">Absent Days</div>
            </div>
          </div>
        </div>
      )}

      {/* Ultra-Responsive Mobile Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-2 text-[11px] font-bold text-slate-600">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-200 p-px">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/60 min-h-[76px]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = String(dayNum).padStart(2, '0');
            const monthStr = String(month + 1).padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;

            const record = workerMonthRecs.find((a) => a.date === dateStr);
            const status = record ? record.status : null;
            const isToday = dateStr === todayStr;

            let badgeBg = 'bg-slate-50 text-slate-400';
            let symbol = '';
            if (status === 'Present') {
              badgeBg = 'bg-emerald-500 text-white font-bold shadow-xs';
              symbol = 'P';
            } else if (status === 'Absent') {
              badgeBg = 'bg-rose-500 text-white font-bold shadow-xs';
              symbol = 'A';
            }

            return (
              <div
                key={dateStr}
                onClick={() => openDayModal(dayNum)}
                className={`p-1.5 min-h-[76px] flex flex-col justify-between cursor-pointer transition-colors relative ${
                  isToday 
                    ? 'bg-indigo-50/80 ring-2 ring-indigo-600 ring-inset z-10 font-bold' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] ${isToday ? 'text-indigo-700 font-extrabold bg-indigo-100 px-1.5 py-0.5 rounded-md' : 'font-bold text-slate-800'}`}>
                    {dayNum}
                  </span>
                  {status && (
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${badgeBg}`}>
                      {symbol}
                    </span>
                  )}
                </div>

                {status ? (
                  <div className="mt-1 text-[9px] leading-tight text-slate-600 font-medium truncate bg-white/80 px-1 py-0.5 rounded-md border border-slate-100" title={record?.reason}>
                    {record?.reason || status}
                  </div>
                ) : (
                  <div className={`text-[9px] font-semibold text-center py-1 ${isToday ? 'text-indigo-600 font-bold' : 'text-slate-400 opacity-70'}`}>
                    {isToday ? 'Today' : '+ Tap'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {activeDayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="bg-white rounded-t-3xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Mark Attendance
                </h3>
                <p className="text-xs text-indigo-600 font-medium">
                  {activeDayModal} {activeDayModal === todayStr ? '(Today)' : ''}
                </p>
              </div>
              <button 
                onClick={() => setActiveDayModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatusInput('Present')}
                    className={`py-3.5 rounded-2xl text-xs font-bold border flex items-center justify-center space-x-2 transition-all ${
                      statusInput === 'Present'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusInput('Absent')}
                    className={`py-3.5 rounded-2xl text-xs font-bold border flex items-center justify-center space-x-2 transition-all ${
                      statusInput === 'Absent'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Absent</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Reason / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sick leave, Family function"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                />
                
                {/* Quick reason pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickReasons.map((qr) => (
                    <button
                      key={qr}
                      type="button"
                      onClick={() => setReasonInput(qr)}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors font-medium"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDayModal(null)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
