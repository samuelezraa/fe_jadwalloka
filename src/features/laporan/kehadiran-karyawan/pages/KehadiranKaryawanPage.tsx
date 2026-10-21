import React, { useState } from 'react';
import { initialKehadiranKaryawanData } from '../services/kehadiran-karyawan.service';
import type { KehadiranKaryawan } from '../types/kehadiran-karyawan.type';
import { KehadiranKaryawanTable } from '../components/KehadiranKaryawanTable';

export const KehadiranKaryawanPage: React.FC = () => {
  const [data] = useState<KehadiranKaryawan[]>(initialKehadiranKaryawanData);

  return (
    <div className="space-y-6">
      <KehadiranKaryawanTable data={data} />
    </div>
  );
};