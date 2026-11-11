import { useState, useEffect, useCallback } from 'react';
import type { Grade } from '../types/grade.type';
import { gradeService } from '../services/grade.service';

export const useGrade = (searchQuery = '', statusQuery = '') => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusQuery]);

  const fetchGrades = useCallback(
    async (search: string, status: string, currentPage: number, limit: number) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await gradeService.getAll(search, status, currentPage, limit);
        setGrades(response.data);
        setMeta(response.meta);
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchGrades(searchQuery, statusQuery, page, pageSize);
  }, [searchQuery, statusQuery, page, pageSize, fetchGrades]);

  const createGrade = async (data: Omit<Grade, 'id'>) => {
    const result = await gradeService.create(data);
    fetchGrades(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  const updateGrade = async ({ id, data }: { id: string | number; data: Partial<Grade> }) => {
    const result = await gradeService.update(id, data);
    fetchGrades(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  const deleteGrade = async (id: string | number) => {
    const result = await gradeService.delete(id);
    fetchGrades(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  return {
    grades,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    isError,
    error,
    createGrade,
    updateGrade,
    deleteGrade,
    refetch: () => fetchGrades(searchQuery, statusQuery, page, pageSize),
  };
};