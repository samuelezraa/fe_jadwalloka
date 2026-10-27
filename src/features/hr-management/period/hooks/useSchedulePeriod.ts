import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { schedulePeriodService } from '../services/schedule-period.service';
import type { PeriodeJadwal, PeriodeJadwalFormData } from '../types/schedule-period.type';

export const useSchedulePeriod = () => {
  const [data, setData] = useState<PeriodeJadwal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchPeriods = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await schedulePeriodService.getAll();
      setData(result);
    } catch (error: any) {
      toast.error('Gagal memuat data periode jadwal.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleCreate = async (formData: PeriodeJadwalFormData) => {
    setIsSubmitting(true);
    try {
      await schedulePeriodService.create(formData);
      toast.success('Periode jadwal berhasil ditambahkan.');
      setIsDialogOpen(false);
      fetchPeriods();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan periode jadwal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    isLoading,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleCreate,
    refetch: fetchPeriods,
  };
};