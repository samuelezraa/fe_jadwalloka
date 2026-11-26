import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HrRoute } from './components/HrRoute';
import { ProtectedPageRoute } from './components/ProtectedPageRoute';
import { getDefaultHomeRoute, getStoredUser } from './utils/departmentAccess';

const lazyLoad = (importer: () => Promise<any>, exportName: string) =>
  lazy(() => importer().then((m) => ({ default: m[exportName] || m.default })));

// 1. AUTHENTICATION
const LoginPage = lazyLoad(() => import('./features/auth/pages/LoginPage'), 'LoginPage');
const AuthCallbackPage = lazyLoad(() => import('./features/auth/pages/AuthCallbackPage'), 'AuthCallbackPage');



// 2. DASHBOARD
const DashboardPage = lazyLoad(() => import('./features/dashboard/pages/DashboardPage'), 'DashboardPage');

// 3. MASTER DATA
const DepartemenPage = lazyLoad(() => import('./features/master-data/departemen/pages/DepartemenPage'), 'DepartemenPage');
const SubDepartemenPage = lazyLoad(() => import('./features/master-data/sub-departemen/pages/SubDepartemenPage'), 'SubDepartemenPage');
const PosPage = lazyLoad(() => import('./features/master-data/pos/pages/PosPage'), 'PosPage');
const GradePage = lazyLoad(() => import('./features/master-data/grade/pages/GradePage'), 'GradePage');
const ScheduleSchemePage = lazyLoad(() => import('./features/master-data/schedule-scheme/pages/ScheduleSchemePage'), 'ScheduleSchemePage');
const AnnualEventPage = lazyLoad(() => import('./features/master-data/annual-event/pages/AnnualEventPage'), 'AnnualEventPage');
const EmployeePage = lazyLoad(() => import('./features/master-data/employee/pages/EmployeePage'), 'EmployeePage');
const CustomWorkHourPage = lazyLoad(() => import('./features/master-data/custom-work-hours/pages/CustomWorkHourPage'), 'CustomWorkHourPage');

// 4. JADWAL
const FiveTwoWorkHourPage = lazyLoad(() => import('./features/schedule/five-two-work-hour/pages/FiveTwoWorkHourPage'), 'FiveTwoWorkHourPage');
const InputSchedulePage = lazyLoad(() => import('./features/schedule/input-schedule/pages/InputSchedulePage'), 'InputSchedulePage');
const EditEmployeeSchedulePage = lazyLoad(() => import('./features/schedule/input-schedule/pages/EditEmployeeSchedulePage'), 'EditEmployeeSchedulePage');
const MySchedulePage = lazyLoad(() => import('./features/schedule/my-schedule/pages/MySchedulePage'), 'MySchedulePage');

// 5. HR MANAGEMENT
const SchedulePeriodPage = lazyLoad(() => import('./features/hr-management/period/pages/SchedulePeriodPage'), 'SchedulePeriodPage');
const EmployeeAttendancePage = lazyLoad(() => import('./features/hr-management/employee-attendance/pages/EmployeeAttendancePage'), 'EmployeeAttendancePage');
const EditEmployeeAttendancePage = lazyLoad(() => import('./features/hr-management/employee-attendance/pages/EditEmployeeAttendancePage'), 'EditEmployeeAttendancePage');

// 6. LAPORAN
const AttendancePage = lazyLoad(() => import('./features/reports/attendance/pages/AttendancePage'), 'AttendancePage');
const PivotPage = lazyLoad(() => import('./features/reports/pivot/pages/PivotPage'), 'PivotPage');
const KomplimenPage = lazyLoad(() => import('./features/reports/komplimen/pages/KomplimenPage'), 'KomplimenPage');
const EmployeePresencePage = lazyLoad(() => import('./features/reports/employee-presence/pages/EmployeePresencePage'), 'EmployeePresencePage');

// 7. LOG HISTORY
const LogHistoryPage = lazyLoad(() => import('./features/log-history/pages/LogHistoryPage'), 'LogHistoryPage');

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
      Memuat halaman...
    </p>
  </div>
);

const SmartIndexRedirect = () => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultHomeRoute(user)} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth" element={<AuthCallbackPage />} />

          <Route element={<ProtectedPageRoute requireAdminDepartment={false} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<SmartIndexRedirect />} />

              {/* HALAMAN YANG BOLEH DIAKSES SEMUA DEPARTEMEN LOGIN */}
              <Route path="/schedule/five-two-work-hour" element={<FiveTwoWorkHourPage />} />
              <Route path="/schedule/my-schedule" element={<MySchedulePage />} />

              {/* DASHBOARD: HANYA UNTUK HR & IT (DEPARTEMEN LAIN TIDAK BISA AKSES) */}
              <Route element={<ProtectedPageRoute requireAdminDepartment={true} />}>
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

                {/* JADWAL LAINNYA */}
                <Route path="/schedule/input-schedule" element={<InputSchedulePage />} />
                <Route path="/schedule/input-schedule/edit/:id" element={<EditEmployeeSchedulePage />} />

                {/* HR MANAGEMENT (HANYA HR) */}
                <Route element={<HrRoute />}>
                  <Route path="/hr-management/period" element={<SchedulePeriodPage />} />
                  <Route path="/hr-management/employee-attendance" element={<EmployeeAttendancePage />} />
                  <Route path="/hr-management/employee-attendance/edit/:id" element={<EditEmployeeAttendancePage />} />
                </Route>

                {/* LAPORAN */}
                <Route path="/reports/attendance" element={<AttendancePage />} />
                <Route path="/reports/pivot" element={<PivotPage />} />
                <Route path="/reports/komplimen" element={<KomplimenPage />} />
                <Route path="/reports/employee-presence" element={<EmployeePresencePage />} />

                {/* LOG HISTORY */}
                <Route path="/log-history" element={<LogHistoryPage />} />
              </Route>

              <Route path="*" element={<SmartIndexRedirect />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}