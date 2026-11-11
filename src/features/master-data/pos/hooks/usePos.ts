import { useState, useEffect, useCallback } from 'react';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';
import { posService } from '../services/pos.service';

export const usePos = (
  searchQuery = '',
  deptQuery = '',
  subDeptQuery = '',
  statusQuery = ''
) => {
  const [data, setData] = useState<Pos[]>([]);
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, deptQuery, subDeptQuery, statusQuery]);

  const fetchPos = useCallback(
    async (
      search: string,
      dept: string,
      subDept: string,
      status: string,
      currentPage: number,
      limit: number
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await posService.getAll(
          search,
          dept,
          subDept,
          status,
          currentPage,
          limit
        );
        setData(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat data POS');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPos(searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize);
  }, [searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize, fetchPos]);

  const addPos = async (newData: PosFormValues) => {
    await posService.create(newData);
    fetchPos(searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize);
  };

  const editPos = async (id: number | string, updatedData: PosFormValues) => {
    await posService.update(id, updatedData);
    fetchPos(searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize);
  };

  const deletePos = async (id: number | string) => {
    await posService.delete(id);
    fetchPos(searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize);
  };

  return {
    data,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    error,
    addPos,
    editPos,
    deletePos,
    refetch: () => fetchPos(searchQuery, deptQuery, subDeptQuery, statusQuery, page, pageSize),
  };
};