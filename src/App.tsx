/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  loadWorkers, 
  saveWorkers, 
  loadAttendance, 
  saveAttendance, 
  loadPayments, 
  savePayments,
  loadAdvances,
  saveAdvances
} from './utils/storage';
import { Worker, AttendanceRecord, SalaryPayment, AttendanceStatus, AdvancePayment } from './types';
import { Navbar } from './components/Navbar';
import { AttendanceCalendarTab } from './components/AttendanceCalendarTab';
import { MonthlySalarySendTab } from './components/MonthlySalarySendTab';
import { WorkersTab } from './components/WorkersTab';
import { AddWorkerModal } from './components/AddWorkerModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('attendance');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);

  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);

  useEffect(() => {
    setWorkers(loadWorkers());
    setAttendanceRecords(loadAttendance());
    setPayments(loadPayments());
    setAdvances(loadAdvances());
  }, []);

  const handleAddWorker = (newWorkerData: Omit<Worker, 'id'>) => {
    const id = `w-${Date.now()}`;
    const newWorker: Worker = { ...newWorkerData, id };
    const updated = [...workers, newWorker];
    setWorkers(updated);
    saveWorkers(updated);
  };

  const handleDeleteWorker = (id: string) => {
    const updatedWorkers = workers.filter((w) => w.id !== id);
    setWorkers(updatedWorkers);
    saveWorkers(updatedWorkers);

    const updatedAtt = attendanceRecords.filter((a) => a.workerId !== id);
    setAttendanceRecords(updatedAtt);
    saveAttendance(updatedAtt);

    const updatedPay = payments.filter((p) => p.workerId !== id);
    setPayments(updatedPay);
    savePayments(updatedPay);
  };

  const handleMarkAttendance = (workerId: string, date: string, status: AttendanceStatus, reason: string) => {
    const existingIndex = attendanceRecords.findIndex(
      (a) => a.workerId === workerId && a.date === date
    );

    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = [...attendanceRecords];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status,
        reason
      };
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${workerId}-${date}-${Date.now()}`,
        workerId,
        date,
        status,
        reason
      };
      updated = [...attendanceRecords, newRecord];
    }

    setAttendanceRecords(updated);
    saveAttendance(updated);
  };

  const handleSavePayment = (paymentData: Omit<SalaryPayment, 'id'>) => {
    const newPayment: SalaryPayment = {
      ...paymentData,
      id: `pay-${Date.now()}`
    };
    const updated = [...payments, newPayment];
    setPayments(updated);
    savePayments(updated);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 font-sans antialiased pb-12">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddWorker={() => setIsAddWorkerOpen(true)}
        workers={workers}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'attendance' && (
          <AttendanceCalendarTab
            workers={workers}
            attendanceRecords={attendanceRecords}
            onMarkAttendance={handleMarkAttendance}
          />
        )}

        {activeTab === 'salary-send' && (
          <MonthlySalarySendTab
            workers={workers}
            attendanceRecords={attendanceRecords}
            payments={payments}
            onSavePayment={handleSavePayment}
          />
        )}

        {activeTab === 'workers' && (
          <WorkersTab
            workers={workers}
            onOpenAddWorker={() => setIsAddWorkerOpen(true)}
            onDeleteWorker={handleDeleteWorker}
          />
        )}
      </main>

      <AddWorkerModal
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
        onAddWorker={handleAddWorker}
      />
    </div>
  );
}
