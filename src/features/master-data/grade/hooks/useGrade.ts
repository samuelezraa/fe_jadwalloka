import { useState, useEffect, useCallback } from 'react';
import { gradeService } from '../services/grade.service';
import type { Grade } from '../types/grade.type';

export const useGrade = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchGrades = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await gradeService.getAll();
      setGrades(Array.isArray(data) ? data : []);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const createGrade = async (data: Omit<Grade, 'id'>) => {
    const result = await gradeService.create(data);
    await fetchGrades();
    return result;
  };

  const updateGrade = async ({ id, data }: { id: string | number; data: Partial<Grade> }) => {
    const result = await gradeService.update(id, data);
    await fetchGrades();
    return result;
  };

  const deleteGrade = async (id: string | number) => {
    const result = await gradeService.delete(id);
    await fetchGrades();
    return result;
  };

  return {
    grades,
    isLoading,
    isError,
    error,
    createGrade,
    updateGrade,
    deleteGrade,
    refetch: fetchGrades,
  };
};