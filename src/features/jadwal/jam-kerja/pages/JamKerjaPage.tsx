import React, { useState } from 'react';
import { useJamKerja } from '../hooks/useJamKerja';
import { JamKerjaTable } from '../components/JamKerjaTable';
import { JamKerjaDialog } from '../components/JamKerjaDialog';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';
import type { JamKerjaFormValues } from '../schemas/jam-kerja.schema';

export const JamKerjaPage: React.FC = () => {
  const { data, loading, updateJamKerja } = useJamKerja();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JamKerjaKaryawan | null>(null);

  const handleOpenEdit = (item: JamKerjaKaryawan) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: JamKerjaFormValues) => {
    if (selectedItem) {
      await updateJamKerja(selectedItem.id_karyawan, formData);
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Jam Kerja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JamKerjaTable data={data} onEdit={handleOpenEdit} />

      <JamKerjaDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};