import React, { useState } from 'react';
import { HrManagementTable } from '../components/HrManagementTable';
import type { HrManagementItem } from '../types/hr-management.type';

export const HrManagementPage: React.FC = () => {
  const [data] = useState<HrManagementItem[]>([
    {
      id: '1',
      nip: '99-9999-99',
      nama: 'User Trial IT',
      departemen: 'IT',
      subDepartemen: 'Antika Lorien',
      subDept: 'Aplikasi & System',
      pos: 'Trial',
      grade: 'Officer',
      skemaKerja: '5-2',
      totalLibur: 14,
      totalPH: 2,
      totalIzin: 0,
      totalAlfa: 8,
      totalSakit: 0,
      totalCuti: 2,
      totalTerlambat: 0,
      totalMasuk: 20,
      totalHari: 21,
    },
  ]);

  return (
    <div className="space-y-6">
      <HrManagementTable data={data} />
    </div>
  );
};

export default HrManagementPage;