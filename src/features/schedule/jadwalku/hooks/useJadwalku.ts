import { useState, useEffect, useCallback } from 'react';
import type { Jadwalku } from '../types/jadwalku.type';
import { jadwalkuService } from '../services/jadwalku.service';

export const useJadwalku = () => {
  const [data, setData] = useState<Jadwalku[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await jadwalkuService.getJadwalkuList();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    isLoading,
    refreshData: fetchList,
  };
};