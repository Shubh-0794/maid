import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  Calendar, 
  Trash2, 
  UserPlus,
  FileText
} from 'lucide-react';
import { Worker, StaffRole } from '../types';

interface WorkersTabProps {
  workers: Worker[];
  onOpenAddWorker: () => void;
  onDeleteWorker: (id: string) => void;
}

export const WorkersTab: React.FC<WorkersTabProps> = ({
  workers,
  onOpenAddWorker,
  onDeleteWorker
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter((w) => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.phone.includes(searchTerm)
  );

  const getRoleTag = (role: StaffRole) => {
    switch (role) {
      case 'Maid': return { emoji: '🧹', label: 'Maid', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'Cook': return { emoji: '🍳', label: 'Cook', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'Nanny': return { emoji: '🍼', label: 'Nanny', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'Driver': return { emoji: '🚗', label: 'Driver', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'Cleaner': return { emoji: '✨', label: 'Cleaner', bg: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 'Gardener': return { emoji: '🌱', label: 'Gardener', bg: 'bg-lime-100 text-lime-800 border-lime-300' };
      default: return { emoji: '⭐', label: role, bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-0">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-slate-900/10 shadow-xs">
        <input
          type="text"
          placeholder="🔍 Search staff by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 text-xs rounded-2xl border-2 border-slate-200 bg-amber-50/30 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
        />
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        {filteredWorkers.map((worker) => {
          const tag = getRoleTag(worker.role);
          return (
            <div 
              key={worker.id}
              className="bg-white rounded-3xl border-2 border-slate-900/10 shadow-sm p-5 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner ${worker.avatarColor}`}>
                    {tag.emoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{worker.name}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tag.bg} mt-1`}>
                      <span>{tag.emoji}</span>
                      <span>{tag.label}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remove ${worker.name}?`)) {
                      onDeleteWorker(worker.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-2xl hover:bg-rose-50 transition-colors"
                  title="Remove Staff"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t-2 border-dashed border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-500">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> Phone
                  </span>
                  <span className="font-bold text-slate-900">{worker.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" /> Timing
                  </span>
                  <span className="font-bold text-amber-700">{worker.shiftTiming}</span>
                </div>

                {worker.notes && (
                  <div className="flex items-start pt-1">
                    <FileText className="w-3.5 h-3.5 mr-2 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-500 italic text-[11px]">{worker.notes}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Monthly Wage</span>
                <span className="text-sm font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl">
                  ₹{worker.rate.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
