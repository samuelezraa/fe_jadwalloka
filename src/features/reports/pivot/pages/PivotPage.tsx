import React, { useState, useEffect } from 'react';
import { usePivot } from '../hooks/usePivot';
import { PivotTable } from '../components/PivotTable';
import { pivotService } from '../services/pivot.service';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const PivotPage: React.FC = () => {
  const {
    data,
    loading,
    meta,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    periodeFilter,
    setPeriodeFilter,
    startDateFilter,
    endDateFilter,
    setStartDateFilter,
    setEndDateFilter,
    departemenFilter,
    setDepartemenFilter,
    subDepartemenFilter,
    setSubDepartemenFilter,
    posFilter,
    setPosFilter,
    gradeFilter,
    setGradeFilter,
    skemaFilter,
    setSkemaFilter,
    departemenList,
    subDepartemenList,
    posList,
    gradeList,
    skemaList,
  } = usePivot();

 // State untuk Master Data Periode Aktif
  const [periodeList, setPeriodeList] = useState<any[]>([]);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await api.get('/periods', { params: { status: 'true', per_page: 50 } });
        const rawPeriods = res.data?.data || res.data || [];
        // 🟢 Hanya ambil periode yang aktif
        setPeriodeList(rawPeriods.filter((p: any) => p.is_active !== false && p.is_active !== 0 && p.is_active !== '0'));
      } catch (err) {
        console.error('Gagal memuat master periode:', err);
      }
    };
    fetchPeriods();
  }, []);

  const handleExport = async () => {
    const toastId = toast.loading('Menyiapkan dan mengunduh file Excel...');

    try {
      const blob = await pivotService.exportPivotReport({
        search: searchQuery,
        periode: periodeFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
        departemen: departemenFilter,
        sub_departemen: subDepartemenFilter,
        pos: posFilter,
        grade: gradeFilter,
        skema: skemaFilter,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Laporan_Pivot_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('File export pivot berhasil diunduh!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengexport data pivot.', { id: toastId });
    }
  };

  if (loading && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Laporan Pivot...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PivotTable
        data={data}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        periodeFilter={periodeFilter}
        onPeriodeChange={setPeriodeFilter}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        onDateRangeChange={(start, end) => {
          setStartDateFilter(start);
          setEndDateFilter(end);
        }}
        departemenFilter={departemenFilter}
        onDepartemenChange={setDepartemenFilter}
        subDepartemenFilter={subDepartemenFilter}
        onSubDepartemenChange={setSubDepartemenFilter}
        posFilter={posFilter}
        onPosChange={setPosFilter}
        gradeFilter={gradeFilter}
        onGradeChange={setGradeFilter}
        skemaFilter={skemaFilter}
        onSkemaChange={setSkemaFilter}
        departemenList={departemenList}
        subDepartemenList={subDepartemenList}
        posList={posList}
        gradeList={gradeList}
        skemaList={skemaList}
        periodeList={periodeList} // 👈 Masukkan periodeList ke PivotTable
        onExport={handleExport}
      />
    </div>
  );
};

export default PivotPage;