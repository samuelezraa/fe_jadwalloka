import React, { useState } from 'react';
import { initialPeriodeJadwalData } from '../services/periodeJadwal.service';
import type { PeriodeJadwal, PeriodeJadwalFormData } from '../types/periodeJadwal.type';
import { PeriodeJadwalForm } from '../components/PeriodeJadwalForm';
import { PeriodeJadwalTable } from '../components/PeriodeJadwalTable';

export const PeriodeJadwalPage: React.FC = () => {
  const [data, setData] = useState<PeriodeJadwal[]>(initialPeriodeJadwalData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = (formData: PeriodeJadwalFormData) => {
    const newEntry: PeriodeJadwal = {
      id: data.length + 1,
      idPeriode: `22000${data.length + 1}`,
      periode: formData.periodeJadwal,
      tanggalAwal: formData.tanggalAwal,
      tanggalAkhir: formData.tanggalAkhir,
      keterangan: 'Generate Successfully',
    };

    setData([...data, newEntry]);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section Form Tambah */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
          <h2 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-200">
            Form Tambah Periode Jadwal
          </h2>
          <PeriodeJadwalForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
        </div>
      )}

      {/* Section Tabel Data */}
      <PeriodeJadwalTable 
        data={data} 
        onAddClick={() => setIsFormOpen(!isFormOpen)} 
        isFormOpen={isFormOpen} 
      />
    </div>
  );
};