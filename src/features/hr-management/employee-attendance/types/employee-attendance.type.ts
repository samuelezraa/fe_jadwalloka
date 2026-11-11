export interface HrManagementItem {
  id: string;
  employeeId?: string;
  nip: string;
  name: string;              // 👈 nama -> name
  department: string;        // 👈 departemen -> department
  subDepartment: string;     // 👈 subDepartemen -> subDepartment
  subDept: string;
  pos: string;
  grade: string;
  workScheme: string;        // 👈 skemaKerja -> workScheme
  totalOffDays: number;      // 👈 totalLibur -> totalOffDays
  totalPhDays: number;       // 👈 totalPH -> totalPhDays
  totalPermitDays: number;   // 👈 totalIzin -> totalPermitDays
  totalAlphaDays: number;    // 👈 totalAlfa -> totalAlphaDays
  totalSickDays: number;     // 👈 totalSakit -> totalSickDays
  totalLeaveDays: number;    // 👈 totalCuti -> totalLeaveDays
  totalLateDays: number;     // 👈 totalTerlambat -> totalLateDays
  totalWorkDays: number;     // 👈 totalMasuk -> totalWorkDays
  totalPeriodDays: number;   // 👈 totalHari -> totalPeriodDays
}

export interface DetailKehadiranHarian {
  id: string;
  no: number;
  day: string;               // 👈 hari -> day
  date: string;              // 👈 tanggal -> date
  attendanceStatus: 'Berangkat' | 'Libur' | 'PH' | 'Alfa' | 'Cuti'; // 👈 kehadiran -> attendanceStatus
  scheduledCheckIn: string;  // 👈 jamDatang -> scheduledCheckIn
  scheduledCheckOut: string; // 👈 jamPulang -> scheduledCheckOut
  actualCheckIn: string;     // 👈 absenDatang -> actualCheckIn
  actualCheckOut: string;    // 👈 absenPulang -> actualCheckOut
  status: string;
  notes: string;             // 👈 keterangan -> notes
  ref: string;
}

export interface KaryawanAttendanceInfo {
  name: string;              // 👈 nama -> name
  nip: string;
  period: string;            // 👈 periode -> period
  dateRange: string;         // 👈 rentangTanggal -> dateRange
  scheme: string;            // 👈 skema -> scheme
  totalWorkDays: number;     // 👈 totalHariKerja -> totalWorkDays
  hoursPerDay: number;       // 👈 jamKerjaPerHari -> hoursPerDay
}

export interface AttendanceDetailResponse {
  success: boolean;
  karyawanInfo: KaryawanAttendanceInfo;
  jadwalList: DetailKehadiranHarian[];
}

export interface EmployeeAttendanceApiResponse {
  success: boolean;
  data: HrManagementItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
  };
}