import React, { useState } from 'react';
import { MyScheduleTable } from '../components/MyScheduleTable';
import { useMySchedule } from '../hooks/useMySchedule';
import { myScheduleService } from '../services/my-schedule.service';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import toast from 'react-hot-toast';

export const MySchedulePage: React.FC = () => {
  // State untuk periode aktif
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-10');

  // State untuk Alert Dialog Sukses Export
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'primary' | 'danger';
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'primary',
  });

  const { 
    data,
    isLoading
  } = useMySchedule(selectedPeriod);

  // Menerima period dan selectedIds dari MyScheduleTable
  const handleExport = async (period: string, selectedIds: string[]) => {
    const toastId = toast.loading('Menyiapkan dan mengunduh file export...');
    try {
      // Mengirim 2 argumen: period dan selectedIds ke service
      const blob = await myScheduleService.exportMySchedule(period, selectedIds);

      // Membuat objek URL untuk mendownload file di browser
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rekap-jadwalku-${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export berhasil diunduh!', { id: toastId });

      // Menampilkan dialog sukses
      setAlertConfig({
        isOpen: true,
        title: 'Export Berhasil!',
        description: `Data rekapitulasi jadwal untuk ${selectedIds.length > 0 ? selectedIds.length : 'semua'} karyawan pada periode ${period} berhasil diexport.`,
        variant: 'primary',
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal mengexport data jadwal.', { id: toastId });
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-xs animate-pulse">
          Memuat data Jadwal...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel My Schedule */}
      <MyScheduleTable 
        data={data}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onExport={handleExport} 
      />

      {/* Alert Hasil Export Sukses */}
      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={handleCloseAlert}
        onConfirm={handleCloseAlert}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText="OK"
        cancelText=""
        showCancelButton={false}
      />
    </div>
  );
};

export default MySchedulePage;