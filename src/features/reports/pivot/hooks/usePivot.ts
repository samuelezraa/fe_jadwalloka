import { useState, useEffect, useCallback } from 'react';
import type { PivotData } from '../types/pivot.type';
import { pivotService } from '../services/pivot.service';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const usePivot = () => {
  const [data, setData] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State Master Data List Filter (Hanya mengambil data aktif)
  const [departemenList, setDepartemenList] = useState<any[]>([]);
  const [subDepartemenList, setSubDepartemenList] = useState<any[]>([]);
  const [posList, setPosList] = useState<any[]>([]);
  const [gradeList, setGradeList] = useState<any[]>([]);
  const [skemaList, setSkemaList] = useState<any[]>([]);

  // State Server-Side Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
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

  // Fetch Master Data yang Aktif (is_active !== false)
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
       // Di usePivot.ts
      const [deptRes, subDeptRes, posRes, gradeRes, skemaRes] = await Promise.all([
        api.get('/departments?all=true'),
        api.get('/sub-departments?all=true'),
        api.get('/positions?all=true'), // 👈 Mengambil seluruh master data POS yang aktif
        api.get('/grades?all=true'),
        api.get('/work-schedule-schemes?all=true'),
      ]);

        const filterActive = (arr: any[]) =>
          (arr || []).filter((item: any) => item.is_active !== false);

        setDepartemenList(filterActive(deptRes.data?.data || deptRes.data));
        setSubDepartemenList(filterActive(subDeptRes.data?.data || subDeptRes.data));
        setPosList(filterActive(posRes.data?.data || posRes.data));
        setGradeList(filterActive(gradeRes.data?.data || gradeRes.data));
        setSkemaList(filterActive(skemaRes.data?.data || skemaRes.data));
      } catch (err) {
        console.error('Gagal memuat master data filter pivot:', err);
      }
    };

    fetchMasterData();
  }, []);

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
    departemenList,
    subDepartemenList,
    posList,
    gradeList,
    skemaList,
    refetch: fetchData,
  };
};