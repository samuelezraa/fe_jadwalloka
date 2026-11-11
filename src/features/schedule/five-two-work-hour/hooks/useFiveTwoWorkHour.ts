import { useState, useEffect, useCallback } from 'react';
import { fiveTwoWorkHourService } from '../services/five-two-work-hour.service';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';
import toast from 'react-hot-toast';

export const useFiveTwoWorkHour = (
  searchQuery = '',
  deptFilter = '',
  subDeptFilter = '',
  statusFilter = ''
) => {
  const [schedules, setSchedules] = useState<FiveTwoWorkHourEmployee[]>([]);
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
    per_page: 10,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fiveTwoWorkHourService.getAll(
        searchQuery,
        deptFilter,
        subDeptFilter,
        statusFilter,
        page,
        pageSize
      );
      setSchedules(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data jadwal jam kerja 5-2.');
      toast.error('Gagal memuat data jam kerja.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, deptFilter, subDeptFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, deptFilter, subDeptFilter, statusFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (payload: FiveTwoWorkHourFormValues) => {
    const created = await fiveTwoWorkHourService.create(payload);
    await fetchSchedules();
    return created;
  };

  const updateSchedule = async (id: number | string, payload: FiveTwoWorkHourFormValues) => {
    const updated = await fiveTwoWorkHourService.update(id, payload);
    await fetchSchedules();
    return updated;
  };

  const removeSchedule = async (id: number | string) => {
    await fiveTwoWorkHourService.delete(id);
    await fetchSchedules();
  };

  return {
    schedules,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    error,
    refetch: fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
  };
};