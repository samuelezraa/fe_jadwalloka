import React, { useState } from 'react';
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
  const { stats, loading } = useDashboard();
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Memuat ringkasan data kehadiran dashboard...
        </p>
      </div>
    );
  }

  // Data Pie Chart 1: Status Kehadiran
  const attendancePieData: PieChartDataItem[] = [
    { name: 'Masuk', value: stats?.masuk ?? 0, color: '#10b981' },
    { name: 'Terlambat', value: stats?.terlambat ?? 0, color: '#f59e0b' },
    { name: 'Sakit', value: stats?.sakit ?? 0, color: '#3b82f6' },
    { name: 'Alfa', value: stats?.alfa ?? 0, color: '#ef4444' },
  ];

  // Data Pie Chart 2: Status Karyawan
  const employeeStatusPieData: PieChartDataItem[] = [
    { name: 'Karyawan Aktif', value: (stats as any)?.karyawanAktif ?? 120, color: '#10b981' },
    { name: 'Karyawan Tidak Aktif', value: (stats as any)?.karyawanNonAktif ?? 15, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Judul Halaman & Filter DateRangePicker */}
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

        {/* Filter DateRangePicker */}
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

      {/* Grid StatCard Simpel (6 Kartu Status Kehadiran & Karyawan) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Karyawan Aktif */}
        <StatCard
          title="Karyawan Aktif"
          value={(stats as any)?.karyawanAktif ?? 120}
          icon={Users}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        {/* 2. Karyawan Non Aktif */}
        <StatCard
          title="Non Aktif"
          value={(stats as any)?.karyawanNonAktif ?? 15}
          icon={UserMinus}
          iconBgColor="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-600 dark:text-gray-400"
        />

        {/* 3. Masuk */}
        <StatCard
          title="Masuk"
          value={stats?.masuk ?? 0}
          icon={UserCheck}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        {/* 4. Terlambat */}
        <StatCard
          title="Terlambat"
          value={stats?.terlambat ?? 0}
          icon={Clock}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
        />

        {/* 5. Sakit */}
        <StatCard
          title="Sakit"
          value={stats?.sakit ?? 0}
          icon={Stethoscope}
          iconBgColor="bg-blue-50 dark:bg-blue-950/50"
          iconColor="text-blue-600 dark:text-blue-400"
        />

        {/* 6. Alfa */}
        <StatCard
          title="Alfa"
          value={stats?.alfa ?? 0}
          icon={UserX}
          iconBgColor="bg-red-50 dark:bg-red-950/50"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Section Visualisasi Pie Chart */}
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