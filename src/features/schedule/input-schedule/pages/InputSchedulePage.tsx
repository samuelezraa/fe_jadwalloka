import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputScheduleTable } from '../components/InputScheduleTable';
import { ImportScheduleDialog } from '../components/ImportScheduleDialog';
import { WeeklyWorkHourSettingDialog } from '../components/WeeklyWorkHourSettingDialog';
import { useInputSchedule } from '../hooks/useInputSchedule';
import { inputScheduleService, type WeeklyWorkHourPayload } from '../services/input-schedule.service';
import type { InputSchedulePeriodItem } from '../types/input-schedule.type';
import { canAccessHrManagement, getStoredUser } from '@/utils/departmentAccess';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const InputSchedulePage: React.FC = () => {
  const navigate = useNavigate();

  const currentUser = useMemo(() => getStoredUser(), []);
  const isHrUser = useMemo(() => canAccessHrManagement(currentUser), [currentUser]);

  const initialLockedDeptId = useMemo(() => {
    if (isHrUser) return '';
    if (
      currentUser?.department_id !== undefined &&
      currentUser?.department_id !== null &&
      String(currentUser.department_id) !== ''
    ) {
      return String(currentUser.department_id);
    }
    const deptObj =
      typeof currentUser?.department === 'object' && currentUser?.department !== null
        ? currentUser.department
        : null;
    return deptObj?.id !== undefined && deptObj?.id !== null ? String(deptObj.id) : '';
  }, [isHrUser, currentUser]);

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState(initialLockedDeptId);
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [departemens, setDepartemens] = useState<any[]>([]);
  const [subDepartemens, setSubDepartemens] = useState<any[]>([]);

  const handleDeptFilterChange = (val: string) => {
    if (!isHrUser) {
      setDeptFilter(initialLockedDeptId);
      return;
    }
    setDeptFilter(val);
  };

  const {
    selectedPeriod,
    setSelectedPeriod,
    summary,
    data,
    meta,
    setPage,
    setPageSize,
    refetch,
  } = useInputSchedule(searchQuery, deptFilter, subDeptFilter, statusFilter);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, subDeptRes] = await Promise.all([
          api.get('/departments', { params: { per_page: 25 } }),
          api.get('/sub-departments', { params: { per_page: 25 } }),
        ]);
        const deptItems = deptRes.data?.data || deptRes.data || [];
        const subDeptItems = subDeptRes.data?.data || subDeptRes.data || [];

        setDepartemens(Array.isArray(deptItems) ? deptItems : []);
        setSubDepartemens(Array.isArray(subDeptItems) ? subDeptItems : []);

        if (!isHrUser && !initialLockedDeptId && Array.isArray(deptItems)) {
          const deptObj =
            typeof currentUser?.department === 'object' && currentUser?.department !== null
              ? currentUser.department
              : null;
          const targetCode = String(
            currentUser?.department_code ?? deptObj?.code ?? currentUser?.department_info?.code ?? ''
          )
            .trim()
            .toUpperCase();
          const targetName = String(
            typeof currentUser?.department === 'string'
              ? currentUser.department
              : deptObj?.name ?? currentUser?.department_info?.name ?? ''
          )
            .trim()
            .toLowerCase();

          const matched = deptItems.find((d: any) => {
            const dCode = String(d.code || '').trim().toUpperCase();
            const dName = String(d.name || d.departemen || '').trim().toLowerCase();
            return (targetCode !== '' && dCode === targetCode) || (targetName !== '' && dName === targetName);
          });

          if (matched?.id) {
            setDeptFilter(String(matched.id));
          }
        }
      } catch (err) {
        console.error('Gagal memuat master departemen:', err);
      }
    };
    fetchMasterData();
  }, [isHrUser, initialLockedDeptId, currentUser]);

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
      const blob = await inputScheduleService.exportSchedule(
        selectedPeriod,
        searchQuery,
        deptFilter,
        subDeptFilter,
        statusFilter
      );
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-period-${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('File berhasil diunduh.', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal mengekspor data jadwal.', { id: toastId });
    }
  };

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
        onDeptFilterChange={handleDeptFilterChange}
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
        selectedPeriod={selectedPeriod}
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