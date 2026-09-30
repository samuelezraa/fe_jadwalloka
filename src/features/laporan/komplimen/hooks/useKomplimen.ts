import { useState, useEffect } from 'react';
import type { KomplimenData } from '../types/komplimen.type';
import { komplimenService } from '../services/komplimen.service';

export const useKomplimen = () => {
  const [data, setData] = useState<KomplimenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await komplimenService.getKomplimenData();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data komplimen');
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