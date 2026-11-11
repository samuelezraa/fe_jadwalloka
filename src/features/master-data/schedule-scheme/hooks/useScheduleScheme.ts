import { useState, useEffect, useCallback } from 'react';
import { scheduleSchemeService } from '../services/schedule-scheme.service';
import type { ScheduleScheme } from '../types/schedule-scheme.type';

export const useScheduleScheme = (searchQuery = '', statusQuery = '') => {
  const [data, setData] = useState<ScheduleScheme[]>([]);
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusQuery]);

  const fetchSchemes = useCallback(
    async (search: string, status: string, currentPage: number, limit: number) => {
      setLoading(true);
      setIsError(false);
      try {
        const response = await scheduleSchemeService.getAll(search, status, currentPage, limit);
        setData(response.data);
        setMeta(response.meta);
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSchemes(searchQuery, statusQuery, page, pageSize);
  }, [searchQuery, statusQuery, page, pageSize, fetchSchemes]);

  const addScheduleScheme = async (formData: Omit<ScheduleScheme, 'id'>) => {
    const result = await scheduleSchemeService.create(formData);
    fetchSchemes(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  const editScheduleScheme = async (id: string | number, formData: Partial<ScheduleScheme>) => {
    const result = await scheduleSchemeService.update(id, formData);
    fetchSchemes(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  const removeScheduleScheme = async (id: string | number) => {
    const result = await scheduleSchemeService.delete(id);
    fetchSchemes(searchQuery, statusQuery, page, pageSize);
    return result;
  };

  return {
    data,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    isError,
    error,
    addScheduleScheme,
    editScheduleScheme,
    removeScheduleScheme,
    refetch: () => fetchSchemes(searchQuery, statusQuery, page, pageSize),
  };
};