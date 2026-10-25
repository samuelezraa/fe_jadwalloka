import { useState, useEffect, useCallback } from 'react';
import { scheduleSchemeService } from '../services/schedule-scheme.service';
import type { ScheduleScheme } from '../types/schedule-scheme.type';

export const useScheduleScheme = () => {
  const [data, setData] = useState<ScheduleScheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchScheduleSchemes = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const responseData = await scheduleSchemeService.getAll();
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScheduleSchemes();
  }, [fetchScheduleSchemes]);

  const addScheduleScheme = async (formData: Omit<ScheduleScheme, 'id'>) => {
    const result = await scheduleSchemeService.create(formData);
    await fetchScheduleSchemes();
    return result;
  };

  const editScheduleScheme = async (id: string | number, formData: Partial<ScheduleScheme>) => {
    const result = await scheduleSchemeService.update(id, formData);
    await fetchScheduleSchemes();
    return result;
  };

  const removeScheduleScheme = async (id: string | number) => {
    const result = await scheduleSchemeService.delete(id);
    await fetchScheduleSchemes();
    return result;
  };

  return {
    data,
    loading,
    isError,
    error,
    addScheduleScheme,
    editScheduleScheme,
    removeScheduleScheme,
    refetch: fetchScheduleSchemes,
  };
};