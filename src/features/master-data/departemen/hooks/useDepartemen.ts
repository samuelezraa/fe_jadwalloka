import { useState, useEffect, useCallback, useRef } from 'react';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';
import { departemenService } from '../services/departemen.service';

export const useDepartemen = (
  searchQuery = '',
  statusQuery = '',
  enabled = true,
  withSub = true
) => {
  const [departemens, setDepartemens] = useState<Departemen[]>([]);

  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 25,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);
  const prevFiltersRef = useRef({ searchQuery, statusQuery });

  const fetchDepartemens = useCallback(
    async (
      search: string,
      status: string,
      currentPage: number,
      limit: number,
      showInitialLoading: boolean
    ) => {
      if (showInitialLoading) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }
      setError(null);

      try {
        const response = await departemenService.getAll(
          search,
          status,
          currentPage,
          limit,
          withSub
        );
        setDepartemens(response.data);
        setMeta(response.meta);
        hasLoadedRef.current = true;
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Gagal mengambil data departemen');
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [withSub]
  );

  useEffect(() => {
    if (!enabled) return;

    const filtersChanged =
      prevFiltersRef.current.searchQuery !== searchQuery ||
      prevFiltersRef.current.statusQuery !== statusQuery;

    prevFiltersRef.current = { searchQuery, statusQuery };

    const targetPage = filtersChanged && page !== 1 ? 1 : page;
    if (filtersChanged && page !== 1) {
      setPage(1);
    }

    fetchDepartemens(
      searchQuery,
      statusQuery,
      targetPage,
      pageSize,
      !hasLoadedRef.current
    );
  }, [enabled, searchQuery, statusQuery, page, pageSize, fetchDepartemens]);

  const addDepartemen = async (values: DepartemenFormValues) => {
    await departemenService.create(values);
    await fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
  };

  const editDepartemen = async (id: number, values: DepartemenFormValues) => {
    await departemenService.update(id, values);
    await fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
  };

  const deleteDepartemen = async (id: number) => {
    try {
      await departemenService.delete(id);
      await fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Gagal menghapus departemen');
    }
  };

  return {
    departemens,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    error,
    refetch: () => fetchDepartemens(searchQuery, statusQuery, page, pageSize, false),
    addDepartemen,
    editDepartemen,
    isFetching,
    deleteDepartemen,
  };
};