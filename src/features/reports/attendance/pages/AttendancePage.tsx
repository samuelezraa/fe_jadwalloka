import React from 'react';
import { useAttendance } from '@/features/reports/attendance/hooks/useAttendance';
import { AttendanceTable } from '../components/AttendanceTable';
import toast from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const { data, isLoading } = useAttendance();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error('Tidak ada data absensi untuk diexport.');
      return;
    }

    const toastId = toast.loading('Menyiapkan dan mengunduh file export...');

    try {
      const headers = [
        'NIP',
        'Nama',
        'Departemen',
        'Sub Dept',
        'POS',
        'Grade',
        'ID Absen',
        'Jam Absen',
        'Tanggal Absen',
        'ID Mesin',
        'IP Mesin',
      ];

      const csvRows = [
        headers.join(','),
        ...data.map((item) =>
          [
            `"${item.nip || '-'}"`,
            `"${item.name || '-'}"`,
            `"${item.dept || '-'}"`,
            `"${item.subDept || '-'}"`,
            `"${item.pos || '-'}"`,
            `"${item.grade || '-'}"`,
            `"${item.attendanceEnrollId || '-'}"`,
            `"${item.attendanceTime || '-'}"`,
            `"${item.attendanceDate || '-'}"`,
            `"${item.machineId || '-'}"`,
            `"${item.machineIp || '-'}"`,
          ].join(',')
        ),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Absensi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export berhasil diunduh!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengexport data absensi.', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-xs animate-pulse">
          Memuat data Laporan Absensi...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttendanceTable data={data} onExport={handleExport} />
    </div>
  );
};

export default AttendancePage;