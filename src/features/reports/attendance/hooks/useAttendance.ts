import { useState, useEffect, useCallback } from 'react';
import type { AttendanceReport } from '../types/attendance.type';
import { attendanceService } from '../services/attendance.service';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [data, setData] = useState<AttendanceReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State Master Data List
  const [departemenList, setDepartemenList] = useState<any[]>([]);
  const [subDepartemenList, setSubDepartemenList] = useState<any[]>([]);
  const [gradeList, setGradeList] = useState<any[]>([]);

  // State Server-Side Pagination
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

  // State Server-Side Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [subDeptFilter, setSubDeptFilter] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');

  // Fetch Master Data (Dept, Sub Dept, Grade) untuk Filter
// Di useAttendance.ts
useEffect(() => {
  const fetchMasterData = async () => {
    try {
      const [deptRes, subDeptRes, gradeRes] = await Promise.all([
        api.get('/departments'),
        api.get('/sub-departments'),
        api.get('/grades'),
      ]);

      const rawDepts = deptRes.data?.data || deptRes.data || [];
      const rawSubDepts = subDeptRes.data?.data || subDeptRes.data || [];
      const rawGrades = gradeRes.data?.data || gradeRes.data || [];

      // 🟢 HANYA AMBIL DATA YANG AKTIF (is_active !== false)
      setDepartemenList(rawDepts.filter((d: any) => d.is_active !== false));
      setSubDepartemenList(rawSubDepts.filter((sd: any) => sd.is_active !== false));
      setGradeList(rawGrades.filter((g: any) => g.is_active !== false));
    } catch (err) {
      console.error('Gagal memuat master data filter:', err);
    }
  };

  fetchMasterData();
}, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await attendanceService.getAttendanceList({
        page,
        perPage: pageSize,
        search: searchQuery,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        dept: deptFilter,
        subDept: subDeptFilter,
        grade: gradeFilter,
      });

      setData(result.data);
      setMeta(result.meta);
    } catch (error) {
      toast.error('Gagal memuat data laporan absensi.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, dateRange, deptFilter, subDeptFilter, gradeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    deptFilter,
    setDeptFilter,
    subDeptFilter,
    setSubDeptFilter,
    gradeFilter,
    setGradeFilter,
    departemenList,
    subDepartemenList,
    gradeList,
    refetch: fetchData,
  };
};