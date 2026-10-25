import { useState, useEffect, useCallback } from 'react';
import { fiveTwoWorkHourService } from '../services/five-two-work-hour.service';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';

export const useFiveTwoWorkHour = () => {
  const [schedules, setSchedules] = useState<FiveTwoWorkHourEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fiveTwoWorkHourService.getAll();
      setSchedules(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data jadwal jam kerja 5-2.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    isLoading,
    error,
    refetch: fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
  };
};