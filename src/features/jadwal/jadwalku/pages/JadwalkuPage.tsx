import React from 'react';
import { JadwalkuTable } from '../components/JadwalkuTable';
import { useJadwalku } from '../hooks/useJadwalku';

export const JadwalkuPage: React.FC = () => {
  const { 
    data,
    isLoading
   } = useJadwalku();


  const handleExport = () => {
    alert('Mengunduh data rekap Jadwalku...');
  };

   // Gunakan variabel isLoading di sini
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-xs animate-pulse">
          Memuat data Jadwal...
        </p>
      </div>
    );
  }
  return (
    /* Mengubah padding agar menyesuaikan perangkat mobile dan desktop dengan presisi */
    <div className="px-0 py-4 md:p-6">
      <JadwalkuTable data={data} onExport={handleExport} />
    </div>
  );
};

export default JadwalkuPage;