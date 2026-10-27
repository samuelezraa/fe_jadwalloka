import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inputScheduleService } from '../services/input-schedule.service';
import type { InputSchedulePeriodItem, SchedulePeriodSummary } from '../types/input-schedule.type';
import toast from 'react-hot-toast';

export const useInputSchedule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPeriod = searchParams.get('period') || '';

  const setSelectedPeriod = (period: string) => {
    if (period) {
      setSearchParams({ period }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const [data, setData] = useState<InputSchedulePeriodItem[]>([]);
  const [summary, setSummary] = useState<SchedulePeriodSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchScheduleData = useCallback(async () => {
    if (!selectedPeriod) {
      setData([]);
      setSummary(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await inputScheduleService.getScheduleByPeriod(selectedPeriod);
      setData(result.data || []);
      setSummary(result.summary || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal memuat data jadwal periode.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    data,
    summary,
    isLoading,
    refetch: fetchScheduleData,
  };
};