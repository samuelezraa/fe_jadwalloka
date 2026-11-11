import { useState, useEffect, useCallback } from 'react';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import { subDepartemenService } from '../services/sub-departemen.service';

export const useSubDepartemen = (
  searchQuery = '',
  deptQuery = '',
  statusQuery = ''
) => {
  const [subDepartemens, setSubDepartemens] = useState<SubDepartemen[]>([]);
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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset ke halaman 1 setiap kali filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, deptQuery, statusQuery]);

  const fetchSubDepartemens = useCallback(
    async (
      search: string,
      dept: string,
      status: string,
      currentPage: number,
      limit: number,
      isInitial = false
    ) => {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }
      setError(null);
      try {
        const response = await subDepartemenService.getAll(
          search,
          dept,
          status,
          currentPage,
          limit
        );
        setSubDepartemens(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Gagal mengambil data Sub Departemen');
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSubDepartemens(
      searchQuery,
      deptQuery,
      statusQuery,
      page,
      pageSize,
      subDepartemens.length === 0
    );
  }, [searchQuery, deptQuery, statusQuery, page, pageSize, fetchSubDepartemens]);

  const addSubDepartemen = async (values: SubDepartemenFormValues) => {
    await subDepartemenService.create(values);
    fetchSubDepartemens(searchQuery, deptQuery, statusQuery, page, pageSize, false);
  };

  const editSubDepartemen = async (id: number, values: SubDepartemenFormValues) => {
    await subDepartemenService.update(id, values);
    fetchSubDepartemens(searchQuery, deptQuery, statusQuery, page, pageSize, false);
  };

  const deleteSubDepartemen = async (id: number) => {
    await subDepartemenService.delete(id);
    fetchSubDepartemens(searchQuery, deptQuery, statusQuery, page, pageSize, false);
  };

  return {
    subDepartemens,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    isFetching,
    error,
    refetch: () =>
      fetchSubDepartemens(searchQuery, deptQuery, statusQuery, page, pageSize, false),
    addSubDepartemen,
    editSubDepartemen,
    deleteSubDepartemen,
  };
};