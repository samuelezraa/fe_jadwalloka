import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputScheduleTable } from '../components/InputScheduleTable';
import { ImportScheduleDialog } from '../components/ImportScheduleDialog';
import { WeeklyWorkHourSettingDialog } from '../components/WeeklyWorkHourSettingDialog';
import { useInputSchedule } from '../hooks/useInputSchedule';
import { inputScheduleService, type WeeklyWorkHourPayload } from '../services/input-schedule.service';
import type { InputSchedulePeriodItem } from '../types/input-schedule.type';
import toast from 'react-hot-toast';

export const InputSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedPeriod,
    setSelectedPeriod,
    summary,
    data,
    isLoading,
    refetch,
  } = useInputSchedule();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const handleNavigateEdit = (item: InputSchedulePeriodItem) => {
    navigate(`/schedule/input-schedule/edit/${item.id}`);
  };

  // 🌟 Menghubungkan Import ke backend service
  const handleExecuteImport = async (file: File) => {
    if (!selectedPeriod) {
      toast.error('Silakan pilih periode terlebih dahulu!');
      return;
    }
    const toastId = toast.loading('Mengimport data jadwal...');
    try {
      await inputScheduleService.importSchedule(file, selectedPeriod);
      toast.success('Data jadwal berhasil diimport!', { id: toastId });
      setIsImportOpen(false);
      if (refetch) refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal mengimport jadwal.', { id: toastId });
    }
  };

  // 🌟 Menghubungkan Export ke backend service & download file
  const handleExport = async () => {
    if (!selectedPeriod) {
      toast.error('Silakan pilih periode terlebih dahulu!');
      return;
    }
    const toastId = toast.loading('Menyiapkan unduhan data jadwal...');
    try {
      const blob = await inputScheduleService.exportSchedule(selectedPeriod);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-period-${selectedPeriod}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Unduhan data jadwal dimulai...', { id: toastId });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal mengexport data jadwal.', { id: toastId });
    }
  };

  // 🌟 Menghubungkan Setting Jam Mingguan ke backend service
  const handleSaveWeeklyHours = async (payload: WeeklyWorkHourPayload) => {
    const toastId = toast.loading('Menyimpan pengaturan jam mingguan...');
    try {
      await inputScheduleService.setWeeklyWorkHours(payload);
      toast.success('Jam kerja mingguan berhasil diperbarui!', { id: toastId });
      setIsSettingOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan pengaturan.', { id: toastId });
    }
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
      <InputScheduleTable
        data={data}
        summary={summary}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onEdit={handleNavigateEdit}
        onSettingGlobal={() => setIsSettingOpen(true)}
        onImport={() => setIsImportOpen(true)}
        onExport={handleExport}
      />

      <ImportScheduleDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleExecuteImport}
      />

      <WeeklyWorkHourSettingDialog
        isOpen={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
        onSave={handleSaveWeeklyHours}
      />
    </div>
  );
};

export default InputSchedulePage;