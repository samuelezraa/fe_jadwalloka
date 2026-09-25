import React from 'react';
import { JadwalkuTable } from '../components/JadwalkuTable';
import { useJadwalku } from '../hooks/useJadwalku';

export const JadwalkuPage: React.FC = () => {
  const { data } = useJadwalku();

  const handleExport = () => {
    alert('Mengunduh data rekap Jadwalku...');
  };

  return (
    /* Mengubah padding agar menyesuaikan perangkat mobile dan desktop dengan presisi */
    <div className="px-0 py-4 md:p-6">
      <JadwalkuTable data={data} onExport={handleExport} />
    </div>
  );
};

export default JadwalkuPage;