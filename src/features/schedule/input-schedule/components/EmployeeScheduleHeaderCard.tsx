import React from 'react';
import { 
  Calendar, 
  Clock, 
  Briefcase, 
  User, 
  CalendarDays, 
  UserCheck, 
  Palmtree, 
  XCircle, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';

interface EmployeeInfoProps {
  name: string;
  nip: string;
  period: string;
  dateRange: string;
  scheme: string;
  hoursPerDay: number;
  summary: {
    totalPeriodDays: number;
    totalWorkDays: number;
    totalOffDays: number;
    totalPhDays: number;
    totalPermitDays: number;
    totalAlphaDays: number;
    totalLeaveDays: number;
    totalLateDays: number;
  };
}

interface EmployeeScheduleHeaderCardProps {
  employeeInfo: EmployeeInfoProps;
}

export const EmployeeScheduleHeaderCard: React.FC<EmployeeScheduleHeaderCardProps> = ({
  employeeInfo,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-4">
      {/* Baris Atas: Profil Karyawan & Skema */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
        
        {/* Section 1: Profil Karyawan & Periode */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {employeeInfo.name}
              </h2>
              <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                {employeeInfo.nip}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{employeeInfo.period}</span>
              <span>•</span>
              <span>{employeeInfo.dateRange}</span>
            </p>
          </div>
        </div>

        {/* Section 2: Info Skema & Jam */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Skema</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{employeeInfo.scheme}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <Clock className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Jam/Hari</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{employeeInfo.hoursPerDay} Jam</p>
            </div>
          </div>
        </div>

      </div>

      {/* Baris Bawah: 8 Card Statistik Indikator Periode */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <CalendarDays className="w-3.5 h-3.5 mx-auto text-blue-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Hari</p>
          <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{employeeInfo.summary.totalPeriodDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <UserCheck className="w-3.5 h-3.5 mx-auto text-emerald-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Masuk</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{employeeInfo.summary.totalWorkDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <Palmtree className="w-3.5 h-3.5 mx-auto text-amber-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Libur</p>
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{employeeInfo.summary.totalOffDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <Clock className="w-3.5 h-3.5 mx-auto text-purple-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total PH</p>
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{employeeInfo.summary.totalPhDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <FileText className="w-3.5 h-3.5 mx-auto text-cyan-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Izin</p>
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{employeeInfo.summary.totalPermitDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <XCircle className="w-3.5 h-3.5 mx-auto text-red-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Alfa</p>
          <p className="text-xs font-bold text-red-600 dark:text-red-400">{employeeInfo.summary.totalAlphaDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <Palmtree className="w-3.5 h-3.5 mx-auto text-indigo-500" />
          <p className="text-[10px] text-gray-400 font-medium">Total Cuti</p>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{employeeInfo.summary.totalLeaveDays}</p>
        </div>

        <div className="bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
          <AlertTriangle className="w-3.5 h-3.5 mx-auto text-rose-500" />
          <p className="text-[10px] text-gray-400 font-medium">Terlambat</p>
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{employeeInfo.summary.totalLateDays}</p>
        </div>
      </div>
    </div>
  );
};