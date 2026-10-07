import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { UserCheck, Clock, Stethoscope, UserX, LayoutDashboard } from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { DatePicker } from '../../../components/ui/DatePicker';


export const DashboardPage: React.FC = () => {
  const { stats, loading } = useDashboard();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Memuat ringkasan data kehadiran dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Judul Halaman & Filter Tanggal/Periode */}
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

        {/* Filter Tanggal */}
        <div className="w-full sm:w-56">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Pilih Tanggal..."
          />
        </div>
      </div>

      {/* Grid Kartu Statistik Utama (Masuk, Terlambat, Sakit, Alfa) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Masuk (Orang) */}
        <StatCard
          title="Masuk"
          value={stats?.masuk ?? 0}
          subtitle="Karyawan masuk pada tanggal ini"
          icon={UserCheck}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
          badgeColor="text-emerald-600 dark:text-emerald-400"
        />

        {/* 2. Terlambat (Orang) */}
        <StatCard
          title="Terlambat"
          value={stats?.terlambat ?? 0}
          subtitle="Karyawan terlambat hadir"
          icon={Clock}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
          badgeColor="text-amber-600 dark:text-amber-400"
        />

        {/* 3. Sakit (Orang) */}
        <StatCard
          title="Sakit"
          value={stats?.sakit ?? 0}
          subtitle="Berstatus sakit hari ini"
          icon={Stethoscope}
          iconBgColor="bg-blue-50 dark:bg-blue-950/50"
          iconColor="text-blue-600 dark:text-blue-400"
          badgeColor="text-blue-600 dark:text-blue-400"
        />

        {/* 4. Alfa (Orang) */}
        <StatCard
          title="Alfa"
          value={stats?.alfa ?? 0}
          subtitle="Tidak hadir tanpa keterangan"
          icon={UserX}
          iconBgColor="bg-red-50 dark:bg-red-950/50"
          iconColor="text-red-600 dark:text-red-400"
          badgeColor="text-red-600 dark:text-red-400"
        />

      </div>
    </div>
  );
};