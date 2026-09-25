import { useState, useEffect, useCallback } from 'react';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';
import { jamKerjaService } from '../services/jam-kerja.service';

export const useJamKerja = () => {
  const [data, setData] = useState<JamKerjaKaryawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJamKerja = useCallback(async () => {
    try {
      setLoading(true);
      const result = await jamKerjaService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data Jam Kerja');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJamKerja();
  }, [fetchJamKerja]);

  const updateJamKerja = async (id_karyawan: string, jadwalBaru: JamKerjaKaryawan['jadwal_mingguan']) => {
    await jamKerjaService.update(id_karyawan, jadwalBaru);
    await fetchJamKerja();
  };

  return {
    data,
    loading,
    error,
    updateJamKerja,
    refetch: fetchJamKerja,
  };
};