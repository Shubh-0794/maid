import React from 'react';
import { 
  Calendar, 
  Send, 
  Users, 
  Home, 
  Plus
} from 'lucide-react';
import { Worker } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddWorker: () => void;
  workers: Worker[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddWorker,
  workers
}) => {
  const navItems = [
    { id: 'attendance', label: 'Calendar', icon: Calendar },
    { id: 'salary-send', label: 'Salary Send', icon: Send },
    { id: 'workers', label: 'Staff', icon: Users },
  ];

  return (
    <>
      {/* Top Doodle Header */}
      <header className="bg-amber-400 text-slate-900 sticky top-0 z-40 border-b-2 border-slate-900 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-xl shadow-xs">
              🏡
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900">MaidEase Doodle</h1>
              <p className="text-[10px] font-bold text-slate-800 opacity-90">Staff Attendance & Salary</p>
            </div>
          </div>

          <button
            onClick={onOpenAddWorker}
            className="inline-flex items-center px-3.5 py-2 bg-white text-slate-900 rounded-2xl text-xs font-black border-2 border-slate-900 hover:bg-amber-50 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1 stroke-[3]" />
            Add Staff
          </button>
        </div>
      </header>

      {/* Doodle Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-900 z-50 px-6 py-2 shadow-xl flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-900 font-black border-2 border-slate-900 shadow-xs scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-bold'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
