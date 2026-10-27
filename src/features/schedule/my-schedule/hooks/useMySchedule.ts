import { useState, useEffect, useCallback } from 'react';
import type { MySchedule } from '../types/my-schedule.type';
import { myScheduleService } from '../services/my-schedule.service';
import toast from 'react-hot-toast';

export const useMySchedule = (period: string = '2026-10') => {
  const [data, setData] = useState<MySchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMySchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await myScheduleService.getMyScheduleList(period);
      setData(result);
      setError(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to load schedule data.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchMySchedule();
  }, [fetchMySchedule]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMySchedule,
  };
};