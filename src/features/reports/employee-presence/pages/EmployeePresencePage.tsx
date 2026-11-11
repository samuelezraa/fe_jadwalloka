import React from 'react';
import { useEmployeePresence } from '../hooks/useEmployeePresence';
import { EmployeePresenceTable } from '../components/EmployeePresenceTable';
import { employeePresenceService } from '../services/employee-presence.service';
import toast from 'react-hot-toast';

export const EmployeePresencePage: React.FC = () => {
  const {
    data,
    grandTotalPax,
    loading,
    meta,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    selectedPeriode,
    setSelectedPeriode,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useEmployeePresence();

  const handleExport = async () => {
    const toastId = toast.loading('Menyiapkan dan mengunduh file Excel...');

    try {
      const blob = await employeePresenceService.exportEmployeePresenceReport({
        search: searchQuery,
        selectedPeriode,
        startDate,
        endDate,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Laporan_Kehadiran_Karyawan_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export kehadiran karyawan berhasil diunduh!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengexport data kehadiran karyawan.', { id: toastId });
    }
  };

  if (loading && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Kehadiran Karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeePresenceTable
        data={data}
        grandTotalPax={grandTotalPax}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPeriode={selectedPeriode}
        onPeriodeChange={setSelectedPeriode}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onExport={handleExport}
      />
    </div>
  );
};

export default EmployeePresencePage;