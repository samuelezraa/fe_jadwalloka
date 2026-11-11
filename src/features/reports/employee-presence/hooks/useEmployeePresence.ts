import { useState, useEffect, useCallback } from 'react';
import type { EmployeePresence } from '../types/employee-presence.type';
import { employeePresenceService } from '../services/employee-presence.service';
import toast from 'react-hot-toast';

export const useEmployeePresence = () => {
  const [data, setData] = useState<EmployeePresence[]>([]);
  const [grandTotalPax, setGrandTotalPax] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination Server-Side
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPeriode, setSelectedPeriode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await employeePresenceService.getPresenceData({
        page,
        perPage: pageSize,
        search: searchQuery,
        selectedPeriode,
        startDate,
        endDate,
      });

      setData(result.data);
      setGrandTotalPax(result.grandTotalPax ?? 0);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error('Gagal memuat data kehadiran karyawan.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedPeriode, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    grandTotalPax,
    loading,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    selectedPeriode,
    setSelectedPeriode,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch: fetchData,
  };
};