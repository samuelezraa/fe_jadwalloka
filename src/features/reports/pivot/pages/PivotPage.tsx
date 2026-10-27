import React from 'react';
import { usePivot } from '../hooks/usePivot';
import { PivotTable } from '../components/PivotTable';
import toast from 'react-hot-toast';

export const PivotPage: React.FC = () => {
  const { data, loading } = usePivot();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error('Tidak ada data pivot untuk diexport.');
      return;
    }

    const toastId = toast.loading('Menyiapkan dan mengunduh file export...');

    try {
      const headers = [
        'NIP',
        'Nama',
        'Departemen',
        'Sub Departemen',
        'POS',
        'Grade',
        'Skema',
        'Masuk',
        'Libur',
        'PH',
        'Izin',
        'Alfa',
        'Sakit',
        'Cuti',
        'Terlambat',
      ];

      const csvRows = [
        headers.join(','),
        ...data.map((item) =>
          [
            `"${item.nip || '-'}"`,
            `"${item.nama || '-'}"`,
            `"${item.departemen || '-'}"`,
            `"${item.sub_departemen || '-'}"`,
            `"${item.pos || '-'}"`,
            `"${item.grade || '-'}"`,
            `"${item.skema || '-'}"`,
            item.masuk,
            item.libur,
            item.ph,
            item.izin,
            item.alfa,
            item.sakit,
            item.cuti,
            item.terlambat,
          ].join(',')
        ),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Pivot_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export pivot berhasil diunduh!', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengexport data pivot.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Laporan Pivot...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PivotTable data={data} onExport={handleExport} />
    </div>
  );
};

export default PivotPage;