import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

// Import Master Data Pages
import { DepartemenPage } from '@/features/master-data/departemen/pages/DepartemenPage';
import { SubDepartemenPage } from '@/features/master-data/sub-departemen/pages/SubDepartemenPage';
import { PosPage } from '@/features/master-data/pos/pages/PosPage'; 
import { GradePage } from '@/features/master-data/grade/pages/GradePage'; // <-- Tambahkan ini
import { SkemaHariKerjaPage } from '@/features/master-data/skema-hari-kerja/pages/SkemaHariKerjaPage';
import { EventTahunanPage } from '@/features/master-data/event-tahunan/pages/EventTahunanPage';
import { DataKaryawanPage } from '@/features/master-data/data-karyawan/pages/DataKaryawanPage';

// Import Jadwal Pages
import { JamKerjaPage } from '@/features/jadwal/jam-kerja/pages/JamKerjaPage';
import { InputJadwalPage } from '@/features/jadwal/input-jadwal/pages/InputJadwalPage';
import { JadwalkuPage } from '@/features/jadwal/jadwalku/pages/JadwalkuPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Master Data Routes
      {
        path: 'master-data/departemen',
        element: <DepartemenPage />,
      },
      {
        path: 'master-data/sub-departemen',
        element: <SubDepartemenPage />,
      },
      {
        path: 'master-data/pos', 
        element: <PosPage />,
      },
      {
        path: 'master-data/grade', // <-- Tambahkan path route Grade di sini
        element: <GradePage />,
      },
      {
        path: 'master-data/skema-hari-kerja',
        element: <SkemaHariKerjaPage />,
      },
      {
        path: 'master-data/event-tahunan',
        element: <EventTahunanPage />,
      },
      {
        path: 'master-data/data-karyawan',
        element: <DataKaryawanPage />,
      },
      // Jadwal Routes
      {
        path: 'jadwal/jam-kerja',
        element: <JamKerjaPage />,
      },
      {
        path: 'jadwal/input-jadwal',
        element: <InputJadwalPage />,
      },
      {
        path: 'jadwal/jadwalku',
        element: <JadwalkuPage />,
      },
    ],
  },
]);