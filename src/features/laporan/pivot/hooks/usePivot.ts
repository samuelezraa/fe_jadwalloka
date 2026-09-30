import { useState, useEffect } from 'react';
import type { PivotData } from '../types/pivot.type';
import { pivotService } from '../services/pivot.service';

export const usePivot = () => {
  const [data, setData] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await pivotService.getPivotData();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data pivot');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
  };
};