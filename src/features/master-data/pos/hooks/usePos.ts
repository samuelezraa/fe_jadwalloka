import { useState, useEffect, useCallback } from 'react';
import type { Pos } from '../types/pos.type';
import { posService } from '../services/pos.service';

export const usePos = () => {
  const [data, setData] = useState<Pos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await posService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data POS');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPos();
  }, [fetchPos]);

  const addPos = async (newData: Omit<Pos, 'status'>) => {
    await posService.create(newData);
    await fetchPos();
  };

  const editPos = async (id: string, updatedData: Partial<Pos>) => {
    await posService.update(id, updatedData);
    await fetchPos();
  };

  return {
    data,
    loading,
    error,
    addPos,
    editPos,
    refetch: fetchPos,
  };
};