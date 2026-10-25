import { useState, useEffect, useCallback } from 'react';
import { customWorkHourService } from '../services/custom-work-hour.service';
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import toast from 'react-hot-toast';

export const useCustomWorkHour = () => {
  const [data, setData] = useState<CustomWorkHour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCustomWorkHours = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const responseData = await customWorkHourService.getAll();
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setIsError(true);
      toast.error('Gagal memuat data custom jam kerja.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomWorkHours();
  }, [fetchCustomWorkHours]);

  const addCustomWorkHour = async (formData: Omit<CustomWorkHour, 'id'>) => {
    const result = await customWorkHourService.create(formData);
    await fetchCustomWorkHours();
    return result;
  };

  const editCustomWorkHour = async (id: string | number, formData: Partial<CustomWorkHour>) => {
    const result = await customWorkHourService.update(id, formData);
    await fetchCustomWorkHours();
    return result;
  };

  const removeCustomWorkHour = async (id: string | number) => {
    const result = await customWorkHourService.delete(id);
    await fetchCustomWorkHours();
    return result;
  };

  return {
    data,
    loading,
    isError,
    addCustomWorkHour,
    editCustomWorkHour,
    removeCustomWorkHour,
    refetch: fetchCustomWorkHours,
  };
};