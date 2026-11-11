import { useState, useEffect, useCallback } from 'react';
import { annualEventService } from '../services/annual-event.service';
import type { AnnualEvent } from '../types/annual-event.type';

export const useAnnualEvent = (
  searchQuery = '',
  statusQuery = '',
  categoryQuery = '',
  startDateQuery = '',
  endDateQuery = ''
) => {
  const [data, setData] = useState<AnnualEvent[]>([]);
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

  // Reset ke halaman 1 jika kriteria pencarian / filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusQuery, categoryQuery, startDateQuery, endDateQuery]);

  const fetchEvents = useCallback(
    async (
      search: string,
      status: string,
      category: string,
      startDate: string,
      endDate: string,
      currentPage: number,
      limit: number
    ) => {
      setLoading(true);
      setIsError(false);
      try {
        const response = await annualEventService.getAll(
          search,
          status,
          category,
          startDate,
          endDate,
          currentPage,
          limit
        );
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
    fetchEvents(
      searchQuery,
      statusQuery,
      categoryQuery,
      startDateQuery,
      endDateQuery,
      page,
      pageSize
    );
  }, [
    searchQuery,
    statusQuery,
    categoryQuery,
    startDateQuery,
    endDateQuery,
    page,
    pageSize,
    fetchEvents,
  ]);

  const addAnnualEvent = async (formData: Omit<AnnualEvent, 'id'>) => {
    const result = await annualEventService.create(formData);
    fetchEvents(searchQuery, statusQuery, categoryQuery, startDateQuery, endDateQuery, page, pageSize);
    return result;
  };

  const editAnnualEvent = async (id: string | number, formData: Partial<AnnualEvent>) => {
    const result = await annualEventService.update(id, formData);
    fetchEvents(searchQuery, statusQuery, categoryQuery, startDateQuery, endDateQuery, page, pageSize);
    return result;
  };

  const removeAnnualEvent = async (id: string | number) => {
    const result = await annualEventService.delete(id);
    fetchEvents(searchQuery, statusQuery, categoryQuery, startDateQuery, endDateQuery, page, pageSize);
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
    addAnnualEvent,
    editAnnualEvent,
    removeAnnualEvent,
    refetch: () =>
      fetchEvents(
        searchQuery,
        statusQuery,
        categoryQuery,
        startDateQuery,
        endDateQuery,
        page,
        pageSize
      ),
  };
};