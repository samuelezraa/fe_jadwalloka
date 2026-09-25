import { useState, useEffect, useCallback } from 'react';
import type { DataKaryawan } from '../types/data-karyawan.type';
import { dataKaryawanService } from '../services/data-karyawan.service';

export const useDataKaryawan = () => {
  const [data, setData] = useState<DataKaryawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKaryawan = useCallback(async () => {
    try {
      setLoading(true);
      const result = await dataKaryawanService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data karyawan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  const addKaryawan = async (newData: Omit<DataKaryawan, 'id'>) => {
    await dataKaryawanService.create(newData);
    await fetchKaryawan();
  };

  const editKaryawan = async (id: string, updatedData: Partial<DataKaryawan>) => {
    await dataKaryawanService.update(id, updatedData);
    await fetchKaryawan();
  };

  const toggleStatusKaryawan = async (id: string) => {
    await dataKaryawanService.toggleStatus(id);
    await fetchKaryawan();
  };

  const resetPasswordKaryawan = async (id: string) => {
    await dataKaryawanService.resetPassword(id);
  };

  return {
    data,
    loading,
    error,
    addKaryawan,
    editKaryawan,
    toggleStatusKaryawan,
    resetPasswordKaryawan,
    refetch: fetchKaryawan,
  };
};