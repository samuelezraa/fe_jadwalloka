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
import { SkemaHariKerjaPage } from './features/master-data/skema-hari-kerja/pages/SkemaHariKerjaPage';
import { EventTahunanPage } from './features/master-data/event-tahunan/pages/EventTahunanPage';
import { DataKaryawanPage } from './features/master-data/data-karyawan/pages/DataKaryawanPage';

// ==========================================
// 4. JADWAL
// ==========================================
import { JamKerjaPage } from './features/jadwal/jam-kerja/pages/JamKerjaPage';
import { InputJadwalPage } from './features/jadwal/input-jadwal/pages/InputJadwalPage';
import { EditJadwalKaryawanPage } from './features/jadwal/input-jadwal/pages/EditJadwalKaryawanPage';
import { JadwalkuPage } from './features/jadwal/jadwalku/pages/JadwalkuPage';
import { PeriodeJadwalPage } from './features/jadwal/periode-jadwal/pages/PeriodeJadwalPage';

// ==========================================
// 5. LAPORAN
// ==========================================
import { AbsensiPage } from './features/laporan/absensi/pages/AbsensiPage';
import { PivotPage } from './features/laporan/pivot/pages/PivotPage';
import { KomplimenPage } from './features/laporan/komplimen/pages/KomplimenPage';

// ==========================================
// 6. LOG HISTORY
// ==========================================
import { LogHistoryPage } from './features/log-history/pages/LogHistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Khusus Login (Tanpa MainLayout Sidebar/Header) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Utama dengan MainLayout */}
        <Route element={<MainLayout />}>
          {/* Redirect Root '/' ke Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* MASTER DATA */}
          <Route path="/master-data/departemen" element={<DepartemenPage />} />
          <Route path="/master-data/sub-departemen" element={<SubDepartemenPage />} />
          <Route path="/master-data/pos" element={<PosPage />} />
          <Route path="/master-data/grade" element={<GradePage />} />
          <Route path="/master-data/skema-hari-kerja" element={<SkemaHariKerjaPage />} />
          <Route path="/master-data/event-tahunan" element={<EventTahunanPage />} />
          <Route path="/master-data/data-karyawan" element={<DataKaryawanPage />} />

          {/* JADWAL */}
          <Route path="/jadwal/jam-kerja" element={<JamKerjaPage />} />
          <Route path="/jadwal/input-jadwal" element={<InputJadwalPage />} />
          <Route path="/jadwal/input-jadwal/edit/:id" element={<EditJadwalKaryawanPage />} />
          <Route path="/jadwal/jadwalku" element={<JadwalkuPage />} />
          <Route path="/jadwal/periode-jadwal" element={<PeriodeJadwalPage />} />

          {/* LAPORAN */}
          <Route path="/laporan/absensi" element={<AbsensiPage />} />
          <Route path="/laporan/pivot" element={<PivotPage />} />
          <Route path="/laporan/komplimen" element={<KomplimenPage />} />

          {/* LOG HISTORY */}
          <Route path="/log-history" element={<LogHistoryPage />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}