import { useState, useEffect, useCallback } from 'react';
import type { Departemen } from '../types/departemen.type';
import { departemenService } from '../services/departemen.service';

// ... sisa kode di bawahnya tetap sama

export const useDepartemen = () => {
  const [data, setData] = useState<Departemen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartemen = useCallback(async () => {
  try {
    setLoading(true);
    // Tambahkan jeda buatan 500ms untuk tes
    await new Promise((resolve) => setTimeout(resolve, 200)); 
    
    const result = await departemenService.getAll();
    setData(result);
    setError(null);
  } catch (err) {
    setError('Gagal memuat data departemen');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchDepartemen();
  }, [fetchDepartemen]);

  const addDepartemen = async (newData: Departemen) => {
    await departemenService.create(newData);
    await fetchDepartemen();
  };

  const editDepartemen = async (id: string, updatedData: Partial<Departemen>) => {
    await departemenService.update(id, updatedData);
    await fetchDepartemen();
  };

  const removeDepartemen = async (id: string) => {
    await departemenService.delete(id);
    await fetchDepartemen();
  };

  return {
    data,
    loading,
    error,
    addDepartemen,
    editDepartemen,
    removeDepartemen,
    refetch: fetchDepartemen,
  };
};