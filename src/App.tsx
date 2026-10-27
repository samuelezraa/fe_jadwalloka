import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// ==========================================
// 1. AUTHENTICATION
// ==========================================
import { LoginPage } from './features/auth/pages/LoginPage';

// ==========================================
// 2. DASHBOARD
// ==========================================
import { DashboardPage } from './features/dashboard/pages/DashboardPage';

// ==========================================
// 3. MASTER DATA
// ==========================================
import { DepartemenPage } from './features/master-data/departemen/pages/DepartemenPage';
import { SubDepartemenPage } from './features/master-data/sub-departemen/pages/SubDepartemenPage';
import { PosPage } from './features/master-data/pos/pages/PosPage';
import { GradePage } from './features/master-data/grade/pages/GradePage';
import { ScheduleSchemePage } from './features/master-data/schedule-scheme/pages/ScheduleSchemePage';
import { AnnualEventPage } from './features/master-data/annual-event/pages/AnnualEventPage';
import { EmployeePage } from './features/master-data/employee/pages/EmployeePage';
import { CustomWorkHourPage } from './features/master-data/custom-work-hours/pages/CustomWorkHourPage';

// ==========================================
// 4. JADWAL
// ==========================================
import { FiveTwoWorkHourPage } from './features/schedule/five-two-work-hour/pages/FiveTwoWorkHourPage';
import { InputSchedulePage } from './features/schedule/input-schedule/pages/InputSchedulePage';
import { EditEmployeeSchedulePage } from './features/schedule/input-schedule/pages/EditEmployeeSchedulePage';
import { MySchedulePage } from './features/schedule/my-schedule/pages/MySchedulePage';

// ==========================================
// 5. HR MANAGEMENT 🌟
// ==========================================
import { SchedulePeriodPage } from './features/hr-management/period/pages/SchedulePeriodPage';
import { EmployeeAttendancePage } from './features/hr-management/employee-attendance/pages/EmployeeAttendancePage';
import { EditEmployeeAttendancePage } from './features/hr-management/employee-attendance/pages/EditEmployeeAttendancePage';

// ==========================================
// 6. LAPORAN
// ==========================================
import { AttendancePage } from './features/reports/attendance/pages/AttendancePage';
import { PivotPage } from './features/reports/pivot/pages/PivotPage';
import { KomplimenPage } from './features/reports/komplimen/pages/KomplimenPage';
import { EmployeePresencePage } from './features/reports/employee-presence/pages/EmployeePresencePage';

// ==========================================
// 7. LOG HISTORY
// ==========================================
import { LogHistoryPage } from './features/log-history/pages/LogHistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Khusus Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Utama dengan MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* MASTER DATA */}
          <Route path="/master-data/departemen" element={<DepartemenPage />} />
          <Route path="/master-data/sub-departemen" element={<SubDepartemenPage />} />
          <Route path="/master-data/pos" element={<PosPage />} />
          <Route path="/master-data/grade" element={<GradePage />} />
          <Route path="/master-data/schedule-scheme" element={<ScheduleSchemePage />} />
          <Route path="/master-data/annual-event" element={<AnnualEventPage />} />
          <Route path="/master-data/employee" element={<EmployeePage />} />
          <Route path="/master-data/custom-work-hours" element={<CustomWorkHourPage />} />

          {/* JADWAL */}
          {/* SCHEDULE */}
          <Route path="/schedule/five-two-work-hour" element={<FiveTwoWorkHourPage />} />
          <Route path="/schedule/input-schedule" element={<InputSchedulePage />} />
          <Route path="/schedule/input-schedule/edit/:id" element={<EditEmployeeSchedulePage />} />
          <Route path="/schedule/my-schedule" element={<MySchedulePage />} />

          {/* HR MANAGEMENT 🌟 */}
          <Route path="/hr-management/period" element={<SchedulePeriodPage />} />
          <Route path="/hr-management/employee-attendance" element={<EmployeeAttendancePage />} />
          <Route path="/hr-management/employee-attendance/edit/:id" element={<EditEmployeeAttendancePage />} />

          {/* LAPORAN */}
          <Route path="/reports/attendance" element={<AttendancePage />} />
          <Route path="/reports/pivot" element={<PivotPage />} />
          <Route path="/reports/komplimen" element={<KomplimenPage />} />
          <Route path="/reports/employee-presence" element={<EmployeePresencePage />} />

          {/* LOG HISTORY */}
          <Route path="/log-history" element={<LogHistoryPage />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}