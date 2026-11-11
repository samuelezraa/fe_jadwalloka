import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inputScheduleService } from '../services/input-schedule.service';
import type { InputSchedulePeriodItem, SchedulePeriodSummary } from '../types/input-schedule.type';
import toast from 'react-hot-toast';

export const useInputSchedule = (
  searchQuery = '',
  deptFilter = '',
  subDeptFilter = '',
  statusFilter = ''
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPeriod = searchParams.get('period') || '2026-10';

  const setSelectedPeriod = (period: string) => {
    if (period) {
      setSearchParams({ period }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const [data, setData] = useState<InputSchedulePeriodItem[]>([]);
  const [summary, setSummary] = useState<SchedulePeriodSummary | null>(null);
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
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchScheduleData = useCallback(async () => {
    if (!selectedPeriod) {
      setData([]);
      setSummary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await inputScheduleService.getScheduleByPeriod(
        selectedPeriod,
        searchQuery,
        deptFilter,
        subDeptFilter,
        statusFilter,
        page,
        pageSize
      );
      setData(result.data || []);
      setSummary(result.summary || null);
      if (result.meta) {
        setMeta(result.meta);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data jadwal periode.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, searchQuery, deptFilter, subDeptFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [selectedPeriod, searchQuery, deptFilter, subDeptFilter, statusFilter]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    data,
    summary,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    refetch: fetchScheduleData,
  };
};