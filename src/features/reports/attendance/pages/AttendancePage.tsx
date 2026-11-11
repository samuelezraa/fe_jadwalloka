import React from 'react';
import { useAttendance } from '@/features/reports/attendance/hooks/useAttendance';
import { AttendanceTable } from '../components/AttendanceTable';
import { attendanceService } from '../services/attendance.service';
import toast from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const {
    data,
    isLoading,
    meta,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    deptFilter,
    setDeptFilter,
    subDeptFilter,
    setSubDeptFilter,
    gradeFilter,
    setGradeFilter,
    departemenList,
    subDepartemenList,
    gradeList,
  } = useAttendance();

  const handleExport = async () => {
    const toastId = toast.loading('Menyiapkan dan mengunduh file Excel...');

    try {
      const blob = await attendanceService.exportAttendanceReport({
        search: searchQuery,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        dept: deptFilter,
        subDept: subDeptFilter,
        grade: gradeFilter,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Laporan_Absensi_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export berhasil diunduh!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengexport data absensi.', { id: toastId });
    }
  };

  if (isLoading && (!data || data.length === 0)) {
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
      <AttendanceTable
        data={data}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        subDeptFilter={subDeptFilter}
        onSubDeptFilterChange={setSubDeptFilter}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        departemenList={departemenList}
        subDepartemenList={subDepartemenList}
        gradeList={gradeList}
        onExport={handleExport}
      />
    </div>
  );
};

export default AttendancePage;