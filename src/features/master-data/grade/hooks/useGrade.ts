import { useState, useEffect, useCallback } from 'react';
import type { Grade } from '../types/grade.type';
import { gradeService } from '../services/grade.service';

export const useGrade = () => {
  const [data, setData] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      const result = await gradeService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data Grade');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data pertama kali saat hook digunakan
  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const addGrade = async (newData: Omit<Grade, 'status'>) => {
    await gradeService.create(newData);
    await fetchGrades(); // Refresh data setelah menambah
  };

  const editGrade = async (id: string, updatedData: Partial<Grade>) => {
    await gradeService.update(id, updatedData);
    await fetchGrades(); // Refresh data setelah mengedit
  };

  const deleteGrade = async (id: string) => {
    await gradeService.delete(id);
    await fetchGrades(); // Refresh data setelah menghapus
  };

  return {
    data,
    loading,
    error,
    addGrade,
    editGrade,
    deleteGrade,
    refetch: fetchGrades,
  };
};