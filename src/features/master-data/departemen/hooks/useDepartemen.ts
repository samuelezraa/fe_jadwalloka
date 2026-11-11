import { useState, useEffect, useCallback } from 'react';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';
import { departemenService } from '../services/departemen.service';

export const useDepartemen = (searchQuery = '', statusQuery = '') => {
  const [departemens, setDepartemens] = useState<Departemen[]>([]);
  
  // 🌟 Lengkapi default state meta dengan property 'from' dan 'to'
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
    per_page: 10,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ... (sisa logika hook tetap sama)

  // Reset ke halaman 1 setiap kali query pencarian atau status filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusQuery]);

  const fetchDepartemens = useCallback(async (search: string, status: string, currentPage: number, limit: number, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }
    setError(null);
    try {
      const response = await departemenService.getAll(search, status, currentPage, limit);
      setDepartemens(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengambil data departemen');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartemens(searchQuery, statusQuery, page, pageSize, departemens.length === 0);
  }, [searchQuery, statusQuery, page, pageSize, fetchDepartemens]);

  const addDepartemen = async (values: DepartemenFormValues) => {
    await departemenService.create(values);
    fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
  };

  const editDepartemen = async (id: number, values: DepartemenFormValues) => {
    await departemenService.update(id, values);
    fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
  };

  const deleteDepartemen = async (id: number) => {
    try {
      await departemenService.delete(id);
      fetchDepartemens(searchQuery, statusQuery, page, pageSize, false);
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