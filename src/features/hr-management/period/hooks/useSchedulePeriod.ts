import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { schedulePeriodService } from '../services/schedule-period.service';
import type { PeriodeJadwal, PeriodeJadwalFormData } from '../types/schedule-period.type';

export const useSchedulePeriod = () => {
  const [data, setData] = useState<PeriodeJadwal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pagination Server-Side & Search State
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchPeriods = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await schedulePeriodService.getAll({
        page,
        perPage: pageSize,
        search: searchQuery,
      });
      setData(result.data);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error('Gagal memuat data periode jadwal.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleCreate = async (formData: PeriodeJadwalFormData) => {
    setIsSubmitting(true);
    try {
      await schedulePeriodService.create(formData);
      fetchPeriods();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    isLoading,
    isSubmitting,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    handleCreate,
    refetch: fetchPeriods,
  };
};