import { useState, useEffect, useCallback } from 'react';
import { annualEventService } from '../services/annual-event.service';
import type { AnnualEvent } from '../types/annual-event.type';

export const useAnnualEvent = () => {
  const [data, setData] = useState<AnnualEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchAnnualEvents = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const responseData = await annualEventService.getAll();
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnualEvents();
  }, [fetchAnnualEvents]);

  const addAnnualEvent = async (formData: Omit<AnnualEvent, 'id'>) => {
    const result = await annualEventService.create(formData);
    await fetchAnnualEvents();
    return result;
  };

  const editAnnualEvent = async (id: string | number, formData: Partial<AnnualEvent>) => {
    const result = await annualEventService.update(id, formData);
    await fetchAnnualEvents();
    return result;
  };

  const removeAnnualEvent = async (id: string | number) => {
    const result = await annualEventService.delete(id);
    await fetchAnnualEvents();
    return result;
  };

  return {
    data,
    loading,
    isError,
    error,
    addAnnualEvent,
    editAnnualEvent,
    removeAnnualEvent,
    refetch: fetchAnnualEvents,
  };
};