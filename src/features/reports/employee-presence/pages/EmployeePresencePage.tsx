import React from 'react';
import { useEmployeePresence } from '../hooks/useEmployeePresence';
import { EmployeePresenceTable } from '../components/EmployeePresenceTable';
import toast from 'react-hot-toast';

export const EmployeePresencePage: React.FC = () => {
  const { data, loading } = useEmployeePresence();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error('Tidak ada data kehadiran karyawan untuk diexport.');
      return;
    }

    const toastId = toast.loading('Menyiapkan dan mengunduh file export...');

    try {
      const headers = ['No', 'Departemen', 'Total Pax'];

      const csvRows = [
        headers.join(','),
        ...data.map((item, index) =>
          [
            index + 1,
            `"${item.department || '-'}"`,
            item.totalPax,
          ].join(',')
        ),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Kehadiran_Karyawan_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export kehadiran karyawan berhasil diunduh!', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengexport data kehadiran karyawan.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Kehadiran Karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeePresenceTable data={data} onExport={handleExport} />
    </div>
  );
};

export default EmployeePresencePage;