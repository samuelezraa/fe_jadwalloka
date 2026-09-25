import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Users, Building2, CalendarCheck, PieChart, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Memuat ringkasan dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Judul Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard HR
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ringkasan data kepegawaian dan departemen LokaHR.
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Kartu 1: Partisipasi Karyawan */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start justify-between transition-colors duration-200">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Partisipasi Karyawan
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {stats?.totalKaryawan}{' '}
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                Aktif
              </span>
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
              {stats?.karyawanBelumAbsen} belum berpartisipasi
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Kartu 2: Departemen & Sub Departemen */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start justify-between transition-colors duration-200">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Struktur Organisasi
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {stats?.totalDepartemen}{' '}
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                Departemen
              </span>
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
              {stats?.totalSubDepartemen} Sub Departemen terdaftar
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Kartu 3: Total Kehadiran Card Khusus */}
        <div className="bg-[#0f766e] dark:bg-teal-950 dark:border dark:border-teal-800/60 text-white p-5 rounded-xl shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1 transition-colors duration-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 dark:text-teal-300">
              Kehadiran Hari Ini
            </span>
            <h3 className="text-3xl font-extrabold mt-1">
              {stats?.kehadiranAktual}{' '}
              <span className="text-lg font-light">/ {stats?.kehadiranPotensial}</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-600/50 dark:border-teal-800 flex items-center justify-between text-xs text-emerald-100 dark:text-teal-200">
            <span>Aktual / Potensi Karyawan</span>
            <TrendingUp className="w-4 h-4 text-amber-300" />
          </div>
        </div>

      </div>

      {/* Bagian Grafik / Visualisasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Grafik 1: Proporsi Karyawan per Departemen */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Proporsi Karyawan per Departemen
            </h3>
          </div>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              [Visualisasi Chart Proporsi Departemen]
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              (Operasional, HR, IT, Marketing, dll.)
            </span>
          </div>
        </div>

        {/* Grafik 2: Status Kehadiran / Cuti */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Status Kehadiran & Cuti Minggu Ini
            </h3>
          </div>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              [Visualisasi Bar Chart Status Kehadiran]
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              (Hadir, Izin, Cuti, Alpha)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};