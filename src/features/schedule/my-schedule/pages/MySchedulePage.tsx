import React, { useState, useEffect } from 'react';
import { MyScheduleTable } from '../components/MyScheduleTable';
import { useMySchedule } from '../hooks/useMySchedule';
import { myScheduleService } from '../services/my-schedule.service';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const MySchedulePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [subDeptFilter, setSubDeptFilter] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');

  const [departemens, setDepartemens] = useState<any[]>([]);
  const [subDepartemens, setSubDepartemens] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);

  // Fetch Master Data Aktif untuk Filter Popover
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const activeParams = { params: { status: 'true', per_page: 25 } };
        const [deptRes, subDeptRes, gradeRes] = await Promise.all([
          api.get('/departments', activeParams),
          api.get('/sub-departments', activeParams),
          api.get('/grades', activeParams),
        ]);
        setDepartemens(deptRes.data.data || deptRes.data || []);
        setSubDepartemens(subDeptRes.data.data || subDeptRes.data || []);
        setGrades(gradeRes.data.data || gradeRes.data || []);
      } catch (err) {
        console.error('Gagal memuat master data filter:', err);
      }
    };
    fetchMasters();
  }, []);

  const { 
    data,
    meta,
    setPage,
    setPageSize,
  
  } = useMySchedule(searchQuery, deptFilter, subDeptFilter, gradeFilter, selectedPeriod);

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

  const handleExport = async (period: string, selectedIds: string[]) => {
    const toastId = toast.loading('Menyiapkan dan mengunduh file export...');
    try {
      const blob = await myScheduleService.exportMySchedule(period, selectedIds, {
        search: searchQuery,
        department_id: deptFilter,
        sub_department: subDeptFilter,
        grade: gradeFilter,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rekap-jadwalku-${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File export berhasil diunduh!', { id: toastId });
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

 

  return (
    <div className="space-y-6">
      <MyScheduleTable 
        data={data}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onExport={handleExport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        subDeptFilter={subDeptFilter}
        onSubDeptFilterChange={setSubDeptFilter}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        departemenList={departemens}
        subDepartemenList={subDepartemens}
        gradeList={grades}
      />

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