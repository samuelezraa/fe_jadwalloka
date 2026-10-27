import { useState, useEffect, useCallback } from 'react';
import type { EmployeePresence, EmployeePresenceFilterParams } from '../types/employee-presence.type';
import { employeePresenceService } from '../services/employee-presence.service';
import toast from 'react-hot-toast';

export const useEmployeePresence = (params?: EmployeePresenceFilterParams) => {
  const [data, setData] = useState<EmployeePresence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await employeePresenceService.getPresenceData(params);
      setData(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal memuat data kehadiran karyawan';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [params?.selectedPeriode, params?.startDate, params?.endDate]);

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