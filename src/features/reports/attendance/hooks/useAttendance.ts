import { useState, useEffect } from 'react';
import type { AttendanceReport } from '../types/attendance.type';
import { attendanceService } from '../services/attendance.service';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [data, setData] = useState<AttendanceReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await attendanceService.getAttendanceList();
        setData(result);
      } catch (error) {
        toast.error('Gagal memuat data laporan absensi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};