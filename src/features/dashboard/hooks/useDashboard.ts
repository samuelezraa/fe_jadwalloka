import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats, DashboardFilter } from '../types/dashboard.type';

export const useDashboard = (filter?: DashboardFilter) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getStats(filter);
      setStats(data);
    } catch (error: any) {
      toast.error('Gagal memuat ringkasan data dashboard.');
    } finally {
      setLoading(false);
    }
  }, [filter?.start_date, filter?.end_date, filter?.period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};