import { useState, useEffect, useCallback } from 'react';
import type { SubDepartemen } from '../types/sub-departemen.type';
import { subDepartemenService } from '../services/sub-departemen.service';

export const useSubDepartemen = () => {
  const [data, setData] = useState<SubDepartemen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubDepartemen = useCallback(async () => {
    try {
      setLoading(true);
      const result = await subDepartemenService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data sub departemen');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubDepartemen();
  }, [fetchSubDepartemen]);

  const addSubDepartemen = async (newData: SubDepartemen) => {
    await subDepartemenService.create(newData);
    await fetchSubDepartemen();
  };

  const editSubDepartemen = async (id: string, updatedData: Partial<SubDepartemen>) => {
    await subDepartemenService.update(id, updatedData);
    await fetchSubDepartemen();
  };

  return {
    data,
    loading,
    error,
    addSubDepartemen,
    editSubDepartemen,
    refetch: fetchSubDepartemen,
  };
};