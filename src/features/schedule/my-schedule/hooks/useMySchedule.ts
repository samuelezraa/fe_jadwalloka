import { useState, useEffect, useCallback } from 'react';
import type { MySchedule } from '../types/my-schedule.type';
import { myScheduleService } from '../services/my-schedule.service';
import toast from 'react-hot-toast';

export const useMySchedule = (
  searchQuery: string,
  deptFilter: string,
  subDeptFilter: string,
  gradeFilter: string,
  period: string = '2026-10'
) => {
  const [data, setData] = useState<MySchedule[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reset ke halaman 1 saat filter, search, atau periode berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, deptFilter, subDeptFilter, gradeFilter, period]);

  const fetchMySchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await myScheduleService.getMyScheduleList(
        period,
        page,
        pageSize,
        searchQuery,
        deptFilter,
        subDeptFilter,
        gradeFilter
      );
      setData(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Gagal memuat data jadwal.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [period, page, pageSize, searchQuery, deptFilter, subDeptFilter, gradeFilter]);

  useEffect(() => {
    fetchMySchedule();
  }, [fetchMySchedule]);

  return {
    data,
    meta,
    setPage,
    setPageSize,
    isLoading,
    refetch: fetchMySchedule,
  };
};