import { useState, useEffect, useCallback } from 'react';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';
import { skemaHariKerjaService } from '../services/skema-hari-kerja.service';

export const useSkemaHariKerja = () => {
  const [data, setData] = useState<SkemaHariKerja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkema = useCallback(async () => {
    try {
      setLoading(true);
      const result = await skemaHariKerjaService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data Skema Hari Kerja');
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data pertama kali saat halaman dimuat
  useEffect(() => {
    fetchSkema();
  }, [fetchSkema]);

  const addSkema = async (newData: SkemaHariKerja) => {
    await skemaHariKerjaService.create(newData);
    await fetchSkema(); // Refresh data setelah menambah
  };

  const editSkema = async (id: string, updatedData: Partial<SkemaHariKerja>) => {
    await skemaHariKerjaService.update(id, updatedData);
    await fetchSkema(); // Refresh data setelah mengedit
  };

  const deleteSkema = async (id: string) => {
    await skemaHariKerjaService.delete(id);
    await fetchSkema(); // Refresh data setelah menghapus
  };

  return {
    data,
    loading,
    error,
    addSkema,
    editSkema,
    deleteSkema,
    refetch: fetchSkema,
  };
};