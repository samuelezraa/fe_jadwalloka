import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { 
  UserCheck, 
  Clock, 
  Stethoscope, 
  UserX, 
  LayoutDashboard, 
  UserMinus, 
  Users 
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { PieChartCard, type PieChartDataItem } from '../../../components/ui/PieChartCard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { stats, loading } = useDashboard({
    start_date: startDate,
    end_date: endDate,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Memuat ringkasan data kehadiran dashboard...
        </p>
      </div>
    );
  }

  const attendancePieData: PieChartDataItem[] = [
    { name: 'Masuk', value: stats?.present ?? 0, color: '#10b981' },
    { name: 'Terlambat', value: stats?.late ?? 0, color: '#f59e0b' },
    { name: 'Sakit', value: stats?.sick ?? 0, color: '#3b82f6' },
    { name: 'Alfa', value: stats?.alpha ?? 0, color: '#ef4444' },
  ];

  const employeeStatusPieData: PieChartDataItem[] = [
    { name: 'Karyawan Aktif', value: stats?.active_employees ?? 0, color: '#10b981' },
    { name: 'Karyawan Tidak Aktif', value: stats?.inactive_employees ?? 0, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400 rounded-xl">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard Kehadiran
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ringkasan data kehadiran karyawan berdasarkan periode/tanggal tertentu.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            placeholder="Pilih Rentang Tanggal..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KARYAWAN AKTIF -> Ke Master Data Employee */}
        <div 
          onClick={() => navigate('/master-data/employee')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Karyawan Aktif"
            value={stats?.active_employees ?? 0}
            icon={Users}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* NON AKTIF -> Ke Master Data Employee */}
        <div 
          onClick={() => navigate('/master-data/employee')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Non Aktif"
            value={stats?.inactive_employees ?? 0}
            icon={UserMinus}
            iconBgColor="bg-gray-100 dark:bg-gray-800"
            iconColor="text-gray-600 dark:text-gray-400"
          />
        </div>

        {/* MASUK -> Ke Reports Attendance */}
        <div 
          onClick={() => navigate('/reports/attendance')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Masuk"
            value={stats?.present ?? 0}
            icon={UserCheck}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* TERLAMBAT -> Ke Reports Attendance */}
        <div 
          onClick={() => navigate('/reports/attendance')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Terlambat"
            value={stats?.late ?? 0}
            icon={Clock}
            iconBgColor="bg-amber-50 dark:bg-amber-950/50"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* SAKIT -> Ke Reports Attendance */}
        <div 
          onClick={() => navigate('/reports/attendance')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Sakit"
            value={stats?.sick ?? 0}
            icon={Stethoscope}
            iconBgColor="bg-blue-50 dark:bg-blue-950/50"
            iconColor="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* ALFA -> Ke Reports Attendance */}
        <div 
          onClick={() => navigate('/reports/attendance')} 
          className="cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
        >
          <StatCard
            title="Alfa"
            value={stats?.alpha ?? 0}
            icon={UserX}
            iconBgColor="bg-red-50 dark:bg-red-950/50"
            iconColor="text-red-600 dark:text-red-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard
          title="Visualisasi Kehadiran"
          subtitle="Perbandingan Masuk, Terlambat, Sakit, dan Alfa"
          data={attendancePieData}
          totalLabel="Total Presensi"
        />

        <PieChartCard
          title="Status Karyawan"
          subtitle="Perbandingan Karyawan Aktif dan Tidak Aktif"
          data={employeeStatusPieData}
          totalLabel="Total Karyawan"
        />
      </div>
    </div>
  );
};