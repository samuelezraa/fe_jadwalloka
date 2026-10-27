import { useState, useEffect, useCallback } from 'react';
import type { PivotData, PivotFilterParams } from '../types/pivot.type';
import { pivotService } from '../services/pivot.service';
import toast from 'react-hot-toast';

export const usePivot = (params?: PivotFilterParams) => {
  const [data, setData] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await pivotService.getPivotData(params);
      setData(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal memuat data pivot';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [params?.periode, params?.startDate, params?.endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};