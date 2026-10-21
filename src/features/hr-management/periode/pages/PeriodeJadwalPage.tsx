import React, { useState } from 'react';
import { initialPeriodeJadwalData } from '../services/periodeJadwal.service';
import type { PeriodeJadwal, PeriodeJadwalFormData } from '../types/periodeJadwal.type';
import { PeriodeJadwalTable } from '../components/PeriodeJadwalTable';
import { PeriodeJadwalDialog } from '../components/PeriodeJadwalDialog';

export const PeriodeJadwalPage: React.FC = () => {
  const [data, setData] = useState<PeriodeJadwal[]>(initialPeriodeJadwalData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Tabel Data */}
      <PeriodeJadwalTable 
        data={data} 
        onAddClick={() => setIsDialogOpen(true)} 
        isFormOpen={isDialogOpen} 
      />

      {/* Pop-up Dialog Modal Form Tambah */}
      <PeriodeJadwalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};