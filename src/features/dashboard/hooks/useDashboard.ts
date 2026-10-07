import { useState, useEffect } from 'react';
import type { DashboardStats } from '../types/dashboard.type';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulasi data dummy kehadiran
    setStats({
      masuk: 120,
      terlambat: 5,
      sakit: 2,
      alfa: 1,
    });
    setLoading(false);
  }, []);

  return { stats, loading };
};