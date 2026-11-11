import { useState, useEffect, useCallback } from 'react';
import { customWorkHourService } from '../services/custom-work-hour.service';
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import toast from 'react-hot-toast';

export const useCustomWorkHour = (searchQuery = '', statusQuery = '') => {
  const [data, setData] = useState<CustomWorkHour[]>([]);
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCustomWorkHours = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const res = await customWorkHourService.getAll(searchQuery, statusQuery, page, pageSize);
      setData(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      setIsError(true);
      toast.error('Gagal memuat data custom jam kerja.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusQuery, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusQuery]);

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
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    isError,
    addCustomWorkHour,
    editCustomWorkHour,
    removeCustomWorkHour,
    refetch: fetchCustomWorkHours,
  };
};