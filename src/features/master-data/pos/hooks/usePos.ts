import { useState, useEffect, useCallback } from 'react';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';
import { posService } from '../services/pos.service';

export const usePos = () => {
  const [data, setData] = useState<Pos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await posService.getAll();
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data POS');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPos();
  }, [fetchPos]);

  const addPos = async (newData: PosFormValues) => {
    await posService.create(newData);
    await fetchPos();
  };

const editPos = async (id: number | string, updatedData: PosFormValues) => {
  await posService.update(id, updatedData);
  await fetchPos();
};

  const deletePos = async (id: number) => {
    await posService.delete(id);
    await fetchPos();
  };

  return {
    data,
    loading,
    error,
    addPos,
    editPos,
    deletePos,
    refetch: fetchPos,
  };
};