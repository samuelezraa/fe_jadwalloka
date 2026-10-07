import React, { useState } from 'react';
import { initialAbsensiData } from '../services/absensi.service';
import type { LaporanAbsensi } from '../types/absensi.type';
import { AbsensiTable } from '../components/AbsensiTable';

export const AbsensiPage: React.FC = () => {
  const [data] = useState<LaporanAbsensi[]>(initialAbsensiData);

  return (
    <div className="space-y-6">
      <AbsensiTable data={data} />
    </div>
  );
};