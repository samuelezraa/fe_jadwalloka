import { api } from '@/lib/axios';
import type { AttendanceReport } from '../types/attendance.type';

export const attendanceService = {
  getAttendanceList: async (): Promise<AttendanceReport[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/attendance-log-details');

    return response.data.data.map((item) => ({
      nip: item.nik || '-',
      name: item.employee_name || item.employee?.full_name || '-',
      dept: item.department_name || item.employee?.department?.name || '-',
      subDept: item.employee?.sub_department?.name || item.employee?.subDepartment?.name || '-',
      pos: item.employee?.position?.name || item.employee?.position?.title || item.employee?.pos?.name || item.employee?.pos?.title || '-',
      grade: item.employee?.grade?.name || '-',
      attendanceEnrollId: item.nik || '-',
      attendanceVerification: '99',
      presenceVerification: '255',
      attendanceTime: item.attendance_time ? new Date(item.attendance_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-',
      attendanceDate: item.date ? String(item.date).split('T')[0] : '-',
      dataUploadTime: item.created_at ? new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-',
      machineId: item.attendance_log_id ? String(item.attendance_log_id) : '-',
      machineIp: item.attendance_log?.machine_ip || '-',
    }));
  },
};