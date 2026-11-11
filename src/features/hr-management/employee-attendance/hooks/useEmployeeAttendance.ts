import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { employeeAttendanceService } from '../services/employee-attendance.service';
import type { HrManagementItem, AttendanceDetailResponse, DetailKehadiranHarian } from '../types/employee-attendance.type';

export const useEmployeeAttendance = () => {
  const [data, setData] = useState<HrManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pagination & Filter States
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('');
  const [filterSubDept, setFilterSubDept] = useState<string>('');
  
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const [selectedPeriode, setSelectedPeriode] = useState<string>(() => {
    return sessionStorage.getItem('hr_selected_periode') || '';
  });

  const fetchAttendances = useCallback(async () => {
    if (!selectedPeriode) {
      setData([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await employeeAttendanceService.getAll({
        period: selectedPeriode,
        page,
        perPage: pageSize,
        search: searchQuery,
        dept: filterDept,
        subDept: filterSubDept,
      });
      setData(result.data);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error('Gagal memuat data absensi karyawan.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriode, page, pageSize, searchQuery, filterDept, filterSubDept]);

  const handlePeriodeChange = (period: string) => {
    setSelectedPeriode(period);
    setPage(1);
    if (period) {
      sessionStorage.setItem('hr_selected_periode', period);
    } else {
      sessionStorage.removeItem('hr_selected_periode');
    }
  };

  useEffect(() => {
    if (selectedPeriode) {
      fetchAttendances();
    }
  }, [fetchAttendances]);

  return {
    data,
    selectedPeriode,
    isLoading,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filterSubDept,
    setFilterSubDept,
    handlePeriodeChange,
    refetch: fetchAttendances,
  };
};

// 🟢 EKSPOR HOOK DETAIL YANG DIBUTUHKAN OLEH HALAMAN EDIT
export const useEmployeeAttendanceDetail = (id?: string) => {
  const [detailData, setDetailData] = useState<AttendanceDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await employeeAttendanceService.getById(id);
      setDetailData(result);
    } catch (error: any) {
      toast.error('Gagal memuat rincian absensi karyawan.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveDetail = async (jadwalList: DetailKehadiranHarian[]) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await employeeAttendanceService.update(id, jadwalList);
      toast.success('Data Absensi Karyawan berhasil disimpan!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan absensi karyawan.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    detailData,
    isLoading,
    isSubmitting,
    fetchDetail,
    saveDetail,
  };
};