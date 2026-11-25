import React, { useState, useEffect, useCallback } from 'react';
import {
  logHistoryService,
  initialLogHistoryData,
  type LogHistoryPaginationMeta,
} from '../services/log-history.service';
import type { LogHistory } from '../types/log-history.type';
import { LogHistoryTable } from '../components/LogHistoryTable';

export const LogHistoryPage: React.FC = () => {
  const [data, setData] = useState<LogHistory[]>(initialLogHistoryData);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [meta, setMeta] = useState<LogHistoryPaginationMeta>({
    current_page: 1,
    from: 1,
    last_page: 1,
    per_page: 25,
    to: initialLogHistoryData.length,
    total: initialLogHistoryData.length,
  });
  const [filters, setFilters] = useState<{
    search?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogHistories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await logHistoryService.getPaginated({
        page,
        per_page: pageSize,
        search: filters.search?.trim() || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      });
      setData(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error('Failed to fetch log histories:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchLogHistories();
  }, [fetchLogHistories]);

  const handleFilterChange = useCallback(
    (nextFilters: { search?: string; startDate?: string; endDate?: string }) => {
      setFilters((prev) => {
        if (
          prev.search === nextFilters.search &&
          prev.startDate === nextFilters.startDate &&
          prev.endDate === nextFilters.endDate
        ) {
          return prev;
        }
        setPage(1);
        return nextFilters;
      });
    },
    []
  );

  const handlePageSizeChange = useCallback((nextSize: number) => {
    setPageSize(nextSize);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <LogHistoryTable
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={meta.total}
        lastPage={meta.last_page}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};