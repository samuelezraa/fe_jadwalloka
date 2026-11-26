import { useState, useEffect, useCallback } from 'react';
import type { PivotData } from '../types/pivot.type';
import { pivotService } from '../services/pivot.service';
import toast from 'react-hot-toast';

export const usePivot = () => {
  const [data, setData] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State Server-Side Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 25,
    from: null,
    to: null,
  });

  // State Server-Side Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [periodeFilter, setPeriodeFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [departemenFilter, setDepartemenFilter] = useState<string>('');
  const [subDepartemenFilter, setSubDepartemenFilter] = useState<string>('');
  const [posFilter, setPosFilter] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [skemaFilter, setSkemaFilter] = useState<string>('');

  // Reset ke halaman 1 setiap kali parameter pencarian/filter berubah (seperti usePos.ts)
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    periodeFilter,
    startDateFilter,
    endDateFilter,
    departemenFilter,
    subDepartemenFilter,
    posFilter,
    gradeFilter,
    skemaFilter,
  ]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await pivotService.getPivotData({
        page,
        perPage: pageSize,
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

      setData(result.data);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error('Gagal memuat data laporan pivot.');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    searchQuery,
    periodeFilter,
    startDateFilter,
    endDateFilter,
    departemenFilter,
    subDepartemenFilter,
    posFilter,
    gradeFilter,
    skemaFilter,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    periodeFilter,
    setPeriodeFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
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
    refetch: fetchData,
  };
};