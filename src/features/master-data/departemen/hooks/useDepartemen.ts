import { useState, useEffect, useCallback } from 'react';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';
import { departemenService } from '../services/departemen.service';

export const useDepartemen = () => {
  const [departemens, setDepartemens] = useState<Departemen[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartemens = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departemenService.getAll(forceRefresh);
      setDepartemens(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengambil data departemen');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartemens();
  }, [fetchDepartemens]);

 // src/features/master-data/departemen/hooks/useDepartemen.ts

const addDepartemen = async (values: DepartemenFormValues) => {
  // Response API membawa data baru
  const newDepartment = await departemenService.create(values);
  // Langsung update state lokal tanpa HTTP GET ulang
  setDepartemens((prev) => [newDepartment, ...prev]);
};

const editDepartemen = async (id: number, values: DepartemenFormValues) => {
  // Response API membawa data ter-update
  const updatedDepartment = await departemenService.update(id, values);
  // Langsung update state lokal tanpa HTTP GET ulang
  setDepartemens((prev) =>
    prev.map((item) => (item.id === id ? updatedDepartment : item))
  );
};

  const deleteDepartemen = async (id: number) => {
    try {
      await departemenService.delete(id);
      await fetchDepartemens(true);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Gagal menghapus departemen');
    }
  };

  return {
    departemens,
    isLoading,
    error,
    refetch: () => fetchDepartemens(true),
    addDepartemen,
    editDepartemen,
    deleteDepartemen,
  };
};