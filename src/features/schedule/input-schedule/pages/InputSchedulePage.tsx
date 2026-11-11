import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputScheduleTable } from '../components/InputScheduleTable';
import { ImportScheduleDialog } from '../components/ImportScheduleDialog';
import { WeeklyWorkHourSettingDialog } from '../components/WeeklyWorkHourSettingDialog';
import { useInputSchedule } from '../hooks/useInputSchedule';
import { inputScheduleService, type WeeklyWorkHourPayload } from '../services/input-schedule.service';
import type { InputSchedulePeriodItem } from '../types/input-schedule.type';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast'; // 👈 Tambahkan Toast Alert

export const InputSchedulePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [departemens, setDepartemens] = useState<any[]>([]);
  const [subDepartemens, setSubDepartemens] = useState<any[]>([]);

  const {
    selectedPeriod,
    setSelectedPeriod,
    summary,
    data,
    meta,
    setPage,
    setPageSize,
    isLoading,
    refetch,
  } = useInputSchedule(searchQuery, deptFilter, subDeptFilter, statusFilter);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, subDeptRes] = await Promise.all([
          api.get('/departments'),
          api.get('/sub-departments'),
        ]);
        setDepartemens(deptRes.data.data || deptRes.data || []);
        setSubDepartemens(subDeptRes.data.data || subDeptRes.data || []);
      } catch (err) {
        console.error('Gagal memuat master departemen:', err);
      }
    };
    fetchMasterData();
  }, []);

  const handleNavigateEdit = (item: InputSchedulePeriodItem) => {
    navigate(`/schedule/input-schedule/edit/${item.id}`);
  };

  const handleExecuteImport = async (file: File) => {
    if (!selectedPeriod) return;
    const toastId = toast.loading('Mengimpor data jadwal...');
    try {
      await inputScheduleService.importSchedule(file, selectedPeriod);
      toast.success('Data jadwal berhasil diimpor!', { id: toastId });
      setIsImportOpen(false);
      if (refetch) refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengimpor jadwal.', { id: toastId });
    }
  };

  const handleExport = async () => {
    if (!selectedPeriod) return;
    const toastId = toast.loading('Menyiapkan file ekspor...');
    try {
      const blob = await inputScheduleService.exportSchedule(selectedPeriod);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-period-${selectedPeriod}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('File berhasil diunduh.', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal mengekspor data jadwal.', { id: toastId });
    }
  };

  // 💡 Pembaruan Jam Kerja Mingguan dengan Alert & Refetch
  const handleSaveWeeklyHours = async (payload: WeeklyWorkHourPayload) => {
    const toastId = toast.loading('Menyimpan jam kerja mingguan...');
    try {
      await inputScheduleService.setWeeklyWorkHours(payload);
      toast.success('Jam kerja mingguan berhasil diperbarui untuk seluruh karyawan!', { id: toastId });
      setIsSettingOpen(false);
      if (refetch) refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan jam kerja mingguan.', { id: toastId });
    }
  };

  if (isLoading && (!data || data.length === 0)) {
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
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onEdit={handleNavigateEdit}
        onSettingGlobal={() => setIsSettingOpen(true)}
        onImport={() => setIsImportOpen(true)}
        onExport={handleExport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        subDeptFilter={subDeptFilter}
        onSubDeptFilterChange={setSubDeptFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departemenList={departemens}
        subDepartemenList={subDepartemens}
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