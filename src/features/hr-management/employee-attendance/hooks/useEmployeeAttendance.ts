import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { employeeAttendanceService } from '../services/employee-attendance.service';
import type { HrManagementItem, AttendanceDetailResponse, DetailKehadiranHarian } from '../types/employee-attendance.type';

export const useEmployeeAttendance = () => {
  const [data, setData] = useState<HrManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ambil periode awal dari sessionStorage jika sudah pernah dipilih
  const [selectedPeriode, setSelectedPeriode] = useState<string>(() => {
    return sessionStorage.getItem('hr_selected_periode') || '';
  });

  // Fetch daftar rekap absensi per periode
  const fetchAttendances = useCallback(async (period: string) => {
    if (!period) {
      setData([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await employeeAttendanceService.getAll(period);
      setData(result);
    } catch (error: any) {
      toast.error('Gagal memuat data absensi karyawan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simpan periode ke sessionStorage setiap kali berubah
  const handlePeriodeChange = (period: string) => {
    setSelectedPeriode(period);
    if (period) {
      sessionStorage.setItem('hr_selected_periode', period);
    } else {
      sessionStorage.removeItem('hr_selected_periode');
    }
    fetchAttendances(period);
  };

  // Muat data secara otomatis saat pertama kali komponen dirender jika selectedPeriode sudah ada
  useEffect(() => {
    if (selectedPeriode) {
      fetchAttendances(selectedPeriode);
    }
  }, [selectedPeriode, fetchAttendances]);

  return {
    data,
    selectedPeriode,
    isLoading,
    handlePeriodeChange,
    refetch: () => fetchAttendances(selectedPeriode),
  };
};

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